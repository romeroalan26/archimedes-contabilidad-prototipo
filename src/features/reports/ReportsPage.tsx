import Report606 from "./Report606";
import Report607 from "./Report607";
import Report608 from "./Report608";
import IncomeStatement from "./IncomeStatement";
import BalanceSheet from "./BalanceSheet";

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Módulo de Reportes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Report606 />
        <Report607 />
        <Report608 />
        <IncomeStatement />
        <BalanceSheet />
      </div>
    </div>
  );
}
