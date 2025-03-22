export interface Supplier {
  id: number;
  nombre: string;
  rnc: string;
}

export const suppliers: Supplier[] = [
  { id: 1, nombre: "Materiales Rivera", rnc: "201234567" },
  { id: 2, nombre: "Acero Dominicano", rnc: "202345678" },
  { id: 3, nombre: "ElectroFerretería SRL", rnc: "203456789" },
];
