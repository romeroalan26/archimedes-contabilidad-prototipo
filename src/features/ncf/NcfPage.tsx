import { useState } from "react";
import NcfForm from "./NcfForm";
import NcfList from "./NcfList";
import { useNcfList, useCreateNcf } from "./hooks";
import { NcfFilters } from "./types";

export default function NcfPage() {
  const [filters, setFilters] = useState<NcfFilters>({});
  const { data: ncfList = [], isLoading, error } = useNcfList(filters);
  const createNcfMutation = useCreateNcf();

  const handleSubmit = async (formData: any) => {
    try {
      await createNcfMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error al crear NCF:", error);
      // TODO: Mostrar notificación de error
    }
  };

  const handleFiltersChange = (newFilters: NcfFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando NCF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error al cargar los NCF. Por favor, intente nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 pl-12 md:pl-0">
        Gestión de NCF y e-CF
      </h1>
      <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
        <div className="w-full">
          <NcfForm
            onSubmit={handleSubmit}
            isLoading={createNcfMutation.isPending}
          />
        </div>
        <div className="w-full">
          <NcfList ncfList={ncfList} onFiltersChange={handleFiltersChange} />
        </div>
      </div>
    </div>
  );
}
