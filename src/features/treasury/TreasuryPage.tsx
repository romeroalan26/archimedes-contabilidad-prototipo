import BankOperations from "./BankOperations";
import CashFlow from "./CashFlow";
import BankReconciliation from "./BankReconciliation";

export default function TreasuryPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Tesorería</h2>
      <BankOperations />
      <CashFlow />
      <BankReconciliation />
    </div>
  );
}
