import { useState } from "react";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";
import type { Client } from "../types";
import { saveClient } from "../../../services/clients/saveClient";
import { z } from "zod";
import { clientSchema } from "../components/ClientForm";
import { useClientStore } from "../../../stores/clientStore";

// Tipo inferido del esquema de validación
type ClientFormData = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { updateClient, addClient } = useClientStore();

  const handleOpenForm = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedClient(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const isEdit = !!selectedClient;
      const clientToSave: Client = {
        ...data,
        id: selectedClient?.id || crypto.randomUUID(),
      };

      const savedClient = await saveClient(clientToSave, isEdit);

      // Actualizar el estado local usando Zustand
      if (isEdit) {
        updateClient(savedClient);
      } else {
        addClient(savedClient);
      }

      setSuccessMessage(
        isEdit
          ? "Cliente actualizado correctamente"
          : "Cliente creado correctamente"
      );

      // Cerrar el formulario después de un breve retraso
      setTimeout(() => {
        handleCloseForm();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error al guardar el cliente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>
        <button
          onClick={handleOpenForm}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Cliente
        </button>
      </div>

      {/* Mensajes de feedback */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {isFormOpen ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ClientForm
            defaultValues={selectedClient || undefined}
            onSubmit={handleFormSubmit}
            isEdit={!!selectedClient}
            onSuccess={handleCloseForm}
          />
        </div>
      ) : null}

      <ClientList onEdit={handleEditClient} />
    </div>
  );
}
