import ChartOfAccounts from "./ChartOfAccounts.tsx";
import JournalEntries from "./JournalEntries.tsx";
import GeneralLedger from "./GeneralLedger.tsx";
import TrialBalance from "./TrialBalance.tsx";

export default function AccountingPage() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Contabilidad General</h2>
      <ChartOfAccounts />
      <JournalEntries />
      <GeneralLedger />
      <TrialBalance />
    </div>
  );
}
