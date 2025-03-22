import {
  Product,
  Project,
  InventoryMovement,
  InventoryAssignment,
  Category,
  StockAlert,
  InventoryReport,
} from "./types";
import {
  mockProducts,
  mockProjects,
  mockMovements,
  mockAssignments,
  mockCategories,
  mockStockAlerts,
  mockInventoryReport,
} from "./mockData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Servicios para Productos
export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return mockProducts;
};

export const getProductById = async (
  id: number
): Promise<Product | undefined> => {
  await delay(300);
  return mockProducts.find((p) => p.id === id);
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  await delay(500);
  const newProduct: Product = {
    ...product,
    id: mockProducts.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  await delay(500);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");
  mockProducts[index] = { ...mockProducts[index], ...product };
  return mockProducts[index];
};

export const deleteProduct = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");
  mockProducts.splice(index, 1);
};

// Servicios para Movimientos
export const getMovements = async (): Promise<InventoryMovement[]> => {
  await delay(300);
  return mockMovements;
};

export const createMovement = async (
  movement: Omit<InventoryMovement, "id" | "createdAt">
): Promise<InventoryMovement> => {
  await delay(500);
  const newMovement: InventoryMovement = {
    ...movement,
    id: mockMovements.length + 1,
    createdAt: new Date().toISOString(),
  };
  mockMovements.push(newMovement);

  // Actualizar stock del producto
  const product = mockProducts.find((p) => p.id === movement.productId);
  if (product) {
    product.stock +=
      movement.tipo === "entrada" ? movement.cantidad : -movement.cantidad;
  }

  return newMovement;
};

// Servicios para Proyectos
export const getProjects = async (): Promise<Project[]> => {
  await delay(300);
  return mockProjects;
};

export const getProjectById = async (
  id: number
): Promise<Project | undefined> => {
  await delay(300);
  return mockProjects.find((p) => p.id === id);
};

// Servicios para Asignaciones
export const getAssignments = async (): Promise<InventoryAssignment[]> => {
  await delay(300);
  return mockAssignments;
};

export const createAssignment = async (
  assignment: Omit<InventoryAssignment, "id" | "fecha" | "usuario" | "estado">
): Promise<InventoryAssignment> => {
  await delay(500);
  const newAssignment: InventoryAssignment = {
    ...assignment,
    id: mockAssignments.length + 1,
    fecha: new Date().toISOString().split("T")[0],
    usuario: "admin",
    estado: "pendiente",
  };
  mockAssignments.push(newAssignment);
  return newAssignment;
};

export const updateAssignmentStatus = async (
  id: number,
  estado: InventoryAssignment["estado"]
): Promise<InventoryAssignment> => {
  await delay(500);
  const index = mockAssignments.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Asignación no encontrada");

  const assignment = mockAssignments[index];
  mockAssignments[index] = { ...assignment, estado };

  // Si se aprueba, actualizar el stock
  if (estado === "aprobada") {
    const product = mockProducts.find((p) => p.id === assignment.productId);
    if (product) {
      product.stock -= assignment.cantidad;
    }
  }

  return mockAssignments[index];
};

// Servicios para Categorías
export const getCategories = async (): Promise<Category[]> => {
  await delay(300);
  return mockCategories;
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  await delay(500);
  const newCategory: Category = {
    ...category,
    id: mockCategories.length + 1,
  };
  mockCategories.push(newCategory);
  return newCategory;
};

// Servicios para Alertas de Stock
export const getStockAlerts = async (): Promise<StockAlert[]> => {
  await delay(300);
  return mockStockAlerts;
};

// Servicios para Reportes
export const getInventoryReport = async (): Promise<InventoryReport> => {
  await delay(500);
  return mockInventoryReport;
};
