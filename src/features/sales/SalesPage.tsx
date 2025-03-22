import SalesForm from "./SalesForm";
import ClientList from "./ClientList";
import AccountStatement from "./AccountStatement";

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Ventas</h2>
      <ClientList />
      <SalesForm />
      <AccountStatement />
    </div>
  );
}
