import { useParams } from "react-router-dom";
import { usePayrollDetails } from "../hooks";
import { formatCurrency } from "../utils/format.ts";
import { calculateTotalBonificaciones, calculateTotalDeducciones } from "../utils/calculations";

export function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: payroll, isLoading, error } = usePayrollDetails(Number(id));

  if (isLoading) return <div>Cargando detalles...</div>;
  if (error) return <div>Error al cargar los detalles</div>;
  if (!payroll) return <div>Nómina no encontrada</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalles de Nómina #{payroll.id}</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Información General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Período</p>
            <p className="font-medium">
              {new Date(payroll.periodo.inicio).toLocaleDateString()} -{" "}
              {new Date(payroll.periodo.fin).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Pago</p>
            <p className="font-medium">
              {new Date(payroll.periodo.fechaPago).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salario Base</p>
            <p className="font-medium">{formatCurrency(payroll.salarioBase)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p className="font-medium capitalize">{payroll.estado}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Bonificaciones</h2>
        <div className="space-y-4">
          {payroll.bonificaciones.map((bonificacion, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium capitalize">{bonificacion.tipo}</p>
                <p className="text-sm text-gray-500">{bonificacion.descripcion}</p>
              </div>
              <p className="font-medium text-green-600">
                {formatCurrency(bonificacion.monto)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Bonificaciones</p>
              <p className="font-medium text-green-600">
                {formatCurrency(calculateTotalBonificaciones(payroll))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Deducciones</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">AFP</p>
            <p className="font-medium text-red-600">
              {formatCurrency(payroll.afp)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">ARS</p>
            <p className="font-medium text-red-600">
              {formatCurrency(payroll.ars)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">ISR</p>
            <p className="font-medium text-red-600">
              {formatCurrency(payroll.isr)}
            </p>
          </div>
          {payroll.deducciones.map((deduccion, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium capitalize">{deduccion.tipo}</p>
                <p className="text-sm text-gray-500">{deduccion.descripcion}</p>
              </div>
              <p className="font-medium text-red-600">
                {formatCurrency(deduccion.monto)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Deducciones</p>
              <p className="font-medium text-red-600">
                {formatCurrency(calculateTotalDeducciones(payroll))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Salario Neto</h2>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(payroll.salarioNeto)}
          </p>
        </div>
      </div>
    </div>
  );
} 