import EmployeeList from "./EmployeeList.tsx";
import PayrollForm from "./PayrollForm.tsx";
import PayrollSummary from "./PayrollSummary.tsx";

export default function PayrollPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Nómina y TSS</h2>
      <PayrollForm />
      <EmployeeList />
      <PayrollSummary />
    </div>
  );
}
