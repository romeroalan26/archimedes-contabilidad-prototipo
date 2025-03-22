import InventoryList from "./InventoryList";
import InventoryMovement from "./InventoryMovement";
import InventoryAssignment from "./InventoryAssignment";

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Inventario</h2>
      <InventoryList />
      <InventoryMovement />
      <InventoryAssignment />
    </div>
  );
}
