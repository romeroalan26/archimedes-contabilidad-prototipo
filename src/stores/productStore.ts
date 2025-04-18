import { create } from "zustand";

interface Product {
  id: number;
  name: string;
  price: number;
  itbis: number;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [
    {
      id: 1,
      name: "Producto 1",
      price: 100,
      itbis: 18,
    },
    {
      id: 2,
      name: "Producto 2",
      price: 200,
      itbis: 36,
    },
  ],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
