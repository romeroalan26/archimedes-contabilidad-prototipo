import { Purchase, CreatePurchaseDTO, UpdatePurchaseDTO } from "../types";
import { mockPurchases } from "../purchasesData";

// TODO: Replace with actual API client
const API_BASE_URL = "/api/purchases";

export const purchaseService = {
  list: async (): Promise<Purchase[]> => {
    // TODO: Replace with actual API call
    // Simulando delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPurchases;
  },

  getById: async (id: number): Promise<Purchase> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const purchase = mockPurchases.find((p) => p.id === id);
    if (!purchase) throw new Error("Purchase not found");
    return purchase;
  },

  create: async (data: CreatePurchaseDTO): Promise<Purchase> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPurchase: Purchase = {
      id: mockPurchases.length + 1,
      supplierId: parseInt(data.supplierId),
      fecha: data.fecha,
      monto: parseFloat(data.monto),
      itbis: parseFloat(data.itbis),
      retencionIsr: parseFloat(data.retencionIsr),
      fechaVencimiento: data.fechaVencimiento,
      estado: "PENDING",
      tipoCuentaPagar: data.tipoCuentaPagar,
      cuentaGastoId: parseInt(data.cuentaGastoId),
      cuentaPagarId: parseInt(data.cuentaPagarId),
      items: data.items.map((item) => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        subtotal: parseInt(item.quantity) * parseFloat(item.price),
      })),
    };
    mockPurchases.push(newPurchase);
    return newPurchase;
  },

  update: async (id: number, data: UpdatePurchaseDTO): Promise<Purchase> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockPurchases.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Purchase not found");

    const updatedPurchase: Purchase = {
      ...mockPurchases[index],
      ...(data.fecha && { fecha: data.fecha }),
      ...(data.monto && { monto: parseFloat(data.monto) }),
      ...(data.itbis && { itbis: parseFloat(data.itbis) }),
      ...(data.retencionIsr && { retencionIsr: parseFloat(data.retencionIsr) }),
      ...(data.fechaVencimiento && { fechaVencimiento: data.fechaVencimiento }),
      ...(data.estado && { estado: data.estado }),
      ...(data.tipoCuentaPagar && { tipoCuentaPagar: data.tipoCuentaPagar }),
      ...(data.cuentaGastoId && {
        cuentaGastoId: parseInt(data.cuentaGastoId),
      }),
      ...(data.cuentaPagarId && {
        cuentaPagarId: parseInt(data.cuentaPagarId),
      }),
      ...(data.items && {
        items: data.items.map((item) => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          subtotal: parseInt(item.quantity) * parseFloat(item.price),
        })),
      }),
    };

    mockPurchases[index] = updatedPurchase;
    return updatedPurchase;
  },

  delete: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockPurchases.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Purchase not found");
    mockPurchases.splice(index, 1);
  },
};
