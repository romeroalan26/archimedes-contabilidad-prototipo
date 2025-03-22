import SupplierList from "./SupplierList";
import PurchasesForm from "./PurchasesForm";
import PayableStatus from "./PayableStatus";

export default function PurchasesPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Compras</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <SupplierList />
          <PayableStatus />
        </div>
        <PurchasesForm />
      </div>
    </div>
  );
}
