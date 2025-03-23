import React, { useState } from "react";
import { ReconciliationForm } from "../components/ReconciliationForm";
import { MovementsList } from "../components/MovementsList";
import {
  useReconciliations,
  useUpdateReconciliation,
} from "../hooks/useReconciliation";
import { Reconciliation } from "../types";
import { exportService } from "../services/exportService";

export const BankReconciliationPage: React.FC = () => {
  const [selectedReconciliation, setSelectedReconciliation] =
    useState<Reconciliation | null>(null);
  const { data: reconciliations, isLoading } = useReconciliations();
  const updateReconciliation = useUpdateReconciliation();

  const handleToggleMovement = async (movementId: string) => {
    if (!selectedReconciliation) return;

    const updatedMovements = selectedReconciliation.movements.map((movement) =>
      movement.id === movementId
        ? { ...movement, isReconciled: !movement.isReconciled }
        : movement
    );

    const reconciledBalance = updatedMovements.reduce(
      (acc, movement) => acc + (movement.isReconciled ? movement.amount : 0),
      0
    );

    const difference = selectedReconciliation.bankBalance - reconciledBalance;

    await updateReconciliation.mutateAsync({
      id: selectedReconciliation.id,
      data: {
        movements: updatedMovements,
        balanceConciliado: reconciledBalance,
        diferencia: difference,
        movimientosAclarados: updatedMovements
          .filter((m) => m.isReconciled)
          .map((m) => m.id),
        status: difference === 0 ? "RECONCILED" : "DISCREPANCY",
      },
    });
  };

  const handleExportExcel = () => {
    if (selectedReconciliation) {
      exportService.exportToExcel(selectedReconciliation);
    }
  };

  const handleExportPDF = () => {
    if (selectedReconciliation) {
      exportService.exportToPDF(selectedReconciliation);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Conciliación Bancaria</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Nueva Conciliación</h2>
          <ReconciliationForm
            onSuccess={() => {
              // Refresh reconciliations list
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Conciliaciones Existentes
          </h2>
          {isLoading ? (
            <p>Cargando conciliaciones...</p>
          ) : (
            <div className="space-y-4">
              {reconciliations?.map((reconciliation) => (
                <div
                  key={reconciliation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReconciliation(reconciliation)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Banco: {reconciliation.bankId} -{" "}
                        {new Date(
                          reconciliation.year,
                          reconciliation.month - 1
                        ).toLocaleString("es-ES", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance en Banco:{" "}
                        {new Intl.NumberFormat("es-DO", {
                          style: "currency",
                          currency: "DOP",
                        }).format(reconciliation.bankBalance)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        reconciliation.status === "RECONCILED"
                          ? "bg-green-100 text-green-800"
                          : reconciliation.status === "DISCREPANCY"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reconciliation.status === "RECONCILED"
                        ? "Conciliado"
                        : reconciliation.status === "DISCREPANCY"
                          ? "Discrepancia"
                          : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReconciliation && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Detalles de Conciliación
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Balance en Banco</p>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("es-DO", {
                  style: "currency",
                  currency: "DOP",
                }).format(selectedReconciliation.bankBalance)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Balance Conciliado</p>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("es-DO", {
                  style: "currency",
                  currency: "DOP",
                }).format(selectedReconciliation.reconciledBalance)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Diferencia</p>
              <p
                className={`text-lg font-semibold ${
                  selectedReconciliation.difference === 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {new Intl.NumberFormat("es-DO", {
                  style: "currency",
                  currency: "DOP",
                }).format(selectedReconciliation.difference)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
