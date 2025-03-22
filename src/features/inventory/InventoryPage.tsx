import { useState } from "react";
import InventoryList from "./InventoryList";
import InventoryMovement from "./InventoryMovement";
import InventoryAssignment from "./InventoryAssignment";

// Define una interfaz para el tipo de inventario
interface InventoryItem {
  id: number;
  nombre: string;
  unidad: string;
  stock: number;
}

// Tipado del inventario inicial
const initialInventory: InventoryItem[] = [
  { id: 1, nombre: "Bloques", unidad: "unidad", stock: 800 },
  { id: 2, nombre: "Cemento", unidad: "saco", stock: 200 },
  { id: 3, nombre: "Varilla", unidad: "barra", stock: 350 },
];

// Interfaz para los parámetros de actualizarStock
interface ActualizarStockParams {
  producto: string;
  cantidad: string;
  tipo: "entrada" | "salida";
}

export default function InventoryPage() {
  const [inventario, setInventario] =
    useState<InventoryItem[]>(initialInventory);

  const actualizarStock = ({
    producto,
    cantidad,
    tipo,
  }: ActualizarStockParams) => {
    setInventario((prev) =>
      prev.map((item) =>
        item.nombre === producto
          ? {
              ...item,
              stock:
                tipo === "entrada"
                  ? item.stock + parseInt(cantidad)
                  : item.stock - parseInt(cantidad),
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Inventario</h2>
      <InventoryList inventario={inventario} />
      <InventoryMovement actualizarStock={actualizarStock} />
      <InventoryAssignment />
    </div>
  );
}
