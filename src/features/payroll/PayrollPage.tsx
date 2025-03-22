import EmployeeList from "./EmployeeList";
import PayrollForm from "./PayrollForm";
import PayrollSummary from "./PayrollSummary";

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
