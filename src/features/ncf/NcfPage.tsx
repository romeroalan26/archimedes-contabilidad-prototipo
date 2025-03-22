import NcfForm from "./NcfForm";
import NcfList from "./NcfList";

export default function NcfPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de NCF y e-CF
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <NcfForm />
        </div>
        <div>
          <NcfList />
        </div>
      </div>
    </div>
  );
}
