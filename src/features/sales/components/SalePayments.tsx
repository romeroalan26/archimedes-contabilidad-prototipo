import { useState } from "react";
import { Sale, Payment, PaymentMethod } from "../types";
import { useSalesStore } from "../../../stores/salesStore";

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
    let newStatus = sale.status;
    if (remainingBalance === 0) {
      newStatus = "completed";
    } else if (totalPaid > 0) {
      newStatus = "partial";
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

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Pagos</h3>
        <button
          onClick={() => setIsAddPaymentOpen(true)}
          disabled={(sale.remainingBalance || 0) <= 0}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            (sale.remainingBalance || 0) <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Agregar Pago
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-medium">${sale.total.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Pagado</p>
          <p className="text-lg font-medium">
            ${(sale.totalPaid || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-lg font-medium">
            ${(sale.remainingBalance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {sale.payments && sale.payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sale.payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {payment.method.charAt(0).toUpperCase() +
                      payment.method.slice(1)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {payment.reference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No hay pagos registrados para esta venta
        </div>
      )}

      {isAddPaymentOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Agregar Pago
              </h2>
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
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

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monto
                  </label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {newPayment.amount > (sale.remainingBalance || 0) && (
                    <p className="mt-1 text-sm text-red-600">
                      El monto no puede exceder el balance restante de $
                      {(sale.remainingBalance || 0).toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Referencia
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Número de transferencia, cheque, etc."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
