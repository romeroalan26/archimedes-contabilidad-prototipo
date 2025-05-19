import { useParams, useNavigate } from "react-router-dom";
import { usePurchase, useDeletePurchase } from "../hooks/usePurchases";


export default function PurchaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: purchase, isLoading, error } = usePurchase(Number(id));
  const { mutate: deletePurchase } = useDeletePurchase();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!purchase) return <div>No se encontró la compra</div>;

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de eliminar esta compra?")) {
      await deletePurchase(purchase.id);
      navigate("/purchases");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Detalles de Compra #{purchase.id}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/purchases/${purchase.id}/edit`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-gray-600">Fecha</dt>
              <dd>{new Date(purchase.fecha).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Estado</dt>
              <dd className="capitalize">{purchase.estado}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Fecha de Vencimiento</dt>
              <dd>
                {new Date(purchase.fechaVencimiento).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-gray-600">Tipo de Cuenta por Pagar</dt>
              <dd className="capitalize">
                {purchase.tipoCuentaPagar.replace("_", " ")}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Montos</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-gray-600">Monto Total</dt>
              <dd>${purchase.monto.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-gray-600">ITBIS</dt>
              <dd>${purchase.itbis.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Retención ISR</dt>
              <dd>${purchase.retencionIsr.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {purchase.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.productId}</td>
                  <td className="px-4 py-2">{item.description || "-"}</td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

