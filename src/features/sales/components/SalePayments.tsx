import { useState } from "react";
import { Sale, Payment, PaymentMethod } from "../types";
import { formatCurrency } from "../../../utils/formatters";

interface SalePaymentsProps {
  sale: Sale;
  onUpdateSale: (updatedSale: Sale) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "efectivo",
  "transferencia",
  "tarjeta",
  "cheque",
  "otro",
];

export function SalePayments({ sale, onUpdateSale }: SalePaymentsProps) {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Omit<Payment, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "efectivo",
    reference: "",
  });

  const handleAddPayment = () => {
    if (
      newPayment.amount <= 0 ||
      newPayment.amount > (sale.remainingBalance || 0)
    ) {
      return;
    }

    const payment: Payment = {
      ...newPayment,
      id: crypto.randomUUID(),
    };

    const updatedPayments = [...(sale.payments || []), payment];
    const totalPaid = updatedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const remainingBalance = sale.total - totalPaid;

    // Determinar el nuevo estado
    let newStatus: Sale["status"];
    if (remainingBalance <= 0) {
      newStatus = "completed";
    } else if (totalPaid > 0) {
      newStatus = "partial";
    } else {
      newStatus = "pending";
    }

    const updatedSale: Sale = {
      ...sale,
      payments: updatedPayments,
      totalPaid,
      remainingBalance,
      status: newStatus,
    };

    onUpdateSale(updatedSale);
    setIsAddPaymentOpen(false);
    setNewPayment({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "efectivo",
      reference: "",
    });
  };

  // Calcular estadísticas de pago
  const calculatePaymentStats = () => {
    const totalPaid = sale.totalPaid || 0;
    const totalAmount = sale.total;
    const remainingAmount = sale.remainingBalance || 0;

    // Calcular porcentaje pagado
    const paymentPercentage = Math.min(
      Math.round((totalPaid / totalAmount) * 100),
      100
    );

    return {
      totalPaid,
      totalAmount,
      remainingAmount,
      paymentPercentage,
    };
  };

  const stats = calculatePaymentStats();

  return (
    <div className="p-6">
      {/* Barra de progreso de pago */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">
            Progreso de Pago
          </h3>
          <span className="text-sm text-gray-600">
            {stats.paymentPercentage}% completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              stats.paymentPercentage === 100
                ? "bg-green-600"
                : stats.paymentPercentage > 50
                  ? "bg-blue-600"
                  : "bg-yellow-500"
            }`}
            style={{ width: `${stats.paymentPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total a Pagar</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <div className="bg-indigo-100 rounded-md p-2">
              <svg
                className="h-5 w-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pagado Hasta Ahora
              </p>
              <p className="text-xl font-semibold text-green-600 mt-1">
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
            <div className="bg-green-100 rounded-md p-2">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Balance Pendiente
              </p>
              <p className="text-xl font-semibold text-red-600 mt-1">
                {formatCurrency(stats.remainingAmount)}
              </p>
            </div>
            <div className="bg-red-100 rounded-md p-2">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de agregar pago */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsAddPaymentOpen(true)}
          disabled={(sale.remainingBalance || 0) <= 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
            (sale.remainingBalance || 0) <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Registrar Nuevo Pago
        </button>
      </div>

      {/* Lista de pagos */}
      {sale.payments && sale.payments.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Monto
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Método
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Referencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sale.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {payment.method.charAt(0).toUpperCase() +
                        payment.method.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {payment.reference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay pagos registrados
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Los pagos que reciba por esta venta aparecerán aquí.
          </p>
        </div>
      )}

      {/* Modal para agregar pago */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Registrar Nuevo Pago
              </h2>
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                aria-label="Cerrar"
              >
                <svg
                  className="h-5 w-5"
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

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del Pago
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto del Pago
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={sale.remainingBalance || 0}
                      value={newPayment.amount}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  {newPayment.amount > (sale.remainingBalance || 0) && (
                    <p className="mt-1 text-sm text-red-600">
                      El monto no puede exceder el balance restante de{" "}
                      {formatCurrency(sale.remainingBalance || 0)}
                    </p>
                  )}
                  {newPayment.amount <= 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      El monto debe ser mayor que cero
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={newPayment.method}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        method: e.target.value as PaymentMethod,
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {(newPayment.method === "transferencia" ||
                  newPayment.method === "cheque") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newPayment.method === "transferencia"
                        ? "Número de Referencia"
                        : "Número de Cheque"}
                    </label>
                    <input
                      type="text"
                      value={newPayment.reference || ""}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          reference: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={
                        newPayment.method === "transferencia"
                          ? "Referencia bancaria"
                          : "Número de cheque"
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPayment}
                disabled={
                  newPayment.amount <= 0 ||
                  newPayment.amount > (sale.remainingBalance || 0)
                }
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  newPayment.amount <= 0 ||
                  newPayment.amount > (sale.remainingBalance || 0)
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                }`}
              >
                Registrar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
