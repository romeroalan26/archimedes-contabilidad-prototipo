import {
  Product,
  Category,
  InventoryMovement,
  StockAlert,
  InventoryStats,
} from "./types";
import {
  mockProducts,
  mockCategories,
  mockMovements,
  mockStockAlerts,
} from "./mockData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Servicios de Productos
export const productService = {
  async getAll(): Promise<Product[]> {
    await delay(500);
    return mockProducts;
  },

  async getById(id: number): Promise<Product | null> {
    await delay(300);
    return mockProducts.find((product: Product) => product.id === id) || null;
  },

  async create(
    productData: Omit<Product, "id" | "fechaCreacion" | "fechaActualizacion">
  ): Promise<Product> {
    await delay(800);
    const newProduct: Product = {
      ...productData,
      id: Math.max(...mockProducts.map((p: Product) => p.id)) + 1,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async update(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    await delay(600);
    const index = mockProducts.findIndex(
      (product: Product) => product.id === id
    );
    if (index === -1) return null;

    mockProducts[index] = {
      ...mockProducts[index],
      ...productData,
      fechaActualizacion: new Date().toISOString(),
    };
    return mockProducts[index];
  },

  async delete(id: number): Promise<boolean> {
    await delay(400);
    const index = mockProducts.findIndex(
      (product: Product) => product.id === id
    );
    if (index === -1) return false;

    mockProducts.splice(index, 1);
    return true;
  },
};

// Servicios de Categorías
export const categoryService = {
  async getAll(): Promise<Category[]> {
    await delay(300);
    return mockCategories;
  },

  async create(categoryData: Omit<Category, "id">): Promise<Category> {
    await delay(600);
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...mockCategories.map((c: Category) => c.id)) + 1,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  async update(
    id: number,
    categoryData: Partial<Category>
  ): Promise<Category | null> {
    await delay(500);
    const index = mockCategories.findIndex(
      (category: Category) => category.id === id
    );
    if (index === -1) return null;

    mockCategories[index] = { ...mockCategories[index], ...categoryData };
    return mockCategories[index];
  },

  async delete(id: number): Promise<boolean> {
    await delay(400);
    const index = mockCategories.findIndex(
      (category: Category) => category.id === id
    );
    if (index === -1) return false;

    mockCategories.splice(index, 1);
    return true;
  },
};

// Servicios de Movimientos
export const movementService = {
  async getAll(): Promise<InventoryMovement[]> {
    await delay(400);
    return mockMovements.sort(
      (a: InventoryMovement, b: InventoryMovement) =>
        new Date(b.fechaCreacion).getTime() -
        new Date(a.fechaCreacion).getTime()
    );
  },

  async getByProductId(productId: number): Promise<InventoryMovement[]> {
    await delay(300);
    return mockMovements.filter(
      (movement: InventoryMovement) => movement.productId === productId
    );
  },

  async create(
    movementData: Omit<InventoryMovement, "id" | "fechaCreacion">
  ): Promise<InventoryMovement> {
    await delay(700);
    const newMovement: InventoryMovement = {
      ...movementData,
      id: Math.max(...mockMovements.map((m: InventoryMovement) => m.id)) + 1,
      fechaCreacion: new Date().toISOString(),
    };

    mockMovements.push(newMovement);

    // Actualizar stock del producto
    const productIndex = mockProducts.findIndex(
      (p: Product) => p.id === movementData.productId
    );
    if (productIndex !== -1) {
      const stockChange =
        movementData.tipo === "entrada"
          ? movementData.cantidad
          : movementData.tipo === "salida"
            ? -movementData.cantidad
            : movementData.cantidad; // ajuste puede ser positivo o negativo

      mockProducts[productIndex].stock += stockChange;
      mockProducts[productIndex].fechaActualizacion = new Date().toISOString();
    }

    return newMovement;
  },
};

// Servicios de Alertas de Stock
export const alertService = {
  async getStockAlerts(): Promise<StockAlert[]> {
    await delay(200);
    return mockStockAlerts;
  },

  async generateAlerts(): Promise<StockAlert[]> {
    await delay(500);
    const alerts: StockAlert[] = [];

    mockProducts.forEach((product: Product) => {
      if (product.stock <= product.stockMinimo && product.estado === "activo") {
        const diferencia = product.stock - product.stockMinimo;
        alerts.push({
          productId: product.id,
          codigo: product.codigo,
          nombre: product.nombre,
          stockActual: product.stock,
          stockMinimo: product.stockMinimo,
          diferencia,
          categoria: product.categoria,
          nivel:
            product.stock === 0
              ? "critico"
              : diferencia <= -5
                ? "critico"
                : "bajo",
        });
      }
    });

    return alerts;
  },
};

// Servicios de Estadísticas
export const statsService = {
  async getInventoryStats(): Promise<InventoryStats> {
    await delay(400);

    // Calcular estadísticas en tiempo real basadas en los datos actuales
    const productosActivos = mockProducts.filter(
      (p: Product) => p.estado === "activo"
    ).length;
    const productosInactivos = mockProducts.filter(
      (p: Product) => p.estado === "inactivo"
    ).length;

    const valorInventario = mockProducts.reduce(
      (total: number, product: Product) =>
        total + product.precioVenta * product.stock,
      0
    );

    const valorCompra = mockProducts.reduce(
      (total: number, product: Product) =>
        total + product.precioCompra * product.stock,
      0
    );

    const alerts = await alertService.generateAlerts();
    const productosStockBajo = alerts.filter(
      (a: StockAlert) => a.nivel === "bajo"
    ).length;
    const productosStockCritico = alerts.filter(
      (a: StockAlert) => a.nivel === "critico"
    ).length;

    const hoy = new Date().toISOString().split("T")[0];
    const movimientosHoy = mockMovements.filter(
      (m: InventoryMovement) => m.fecha === hoy
    ).length;

    const margenPromedio =
      valorCompra > 0
        ? ((valorInventario - valorCompra) / valorCompra) * 100
        : 0;

    return {
      totalProductos: mockProducts.length,
      productosActivos,
      productosInactivos,
      valorInventario,
      valorCompra,
      productosStockBajo,
      productosStockCritico,
      categorias: mockCategories.filter((c: Category) => c.estado === "activo")
        .length,
      movimientosHoy,
      margenPromedio,
    };
  },
};

// Funciones de compatibilidad para otros módulos
export const getProducts = async (): Promise<Product[]> => {
  return productService.getAll();
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return productService.getById(id);
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>
): Promise<Product | null> => {
  return productService.update(id, data);
};
