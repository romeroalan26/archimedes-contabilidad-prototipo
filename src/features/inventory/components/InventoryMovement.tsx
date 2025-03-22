import { useForm } from "react-hook-form";
import { Product } from "../types";

interface MovementFormData {
  productId: string;
  cantidad: string;
  tipo: "entrada" | "salida";
  motivo: string;
}

interface InventoryMovementProps {
  products: Product[];
  onSubmit: (data: MovementFormData) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export default function InventoryMovement({
  products,
  onSubmit,
  isLoading,
  error,
}: InventoryMovementProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MovementFormData>();

  const selectedProductId = watch("productId");
  const selectedProduct = products.find(
    (p) => p.id.toString() === selectedProductId
  );
  const tipo = watch("tipo");

  const onFormSubmit = (data: MovementFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Movimiento</h3>
      {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Producto</label>
          <select
            {...register("productId", { required: "Seleccione un producto" })}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre} ({product.codigo})
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.productId.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm">Cantidad</label>
          <input
            type="number"
            step="0.01"
            {...register("cantidad", {
              required: "La cantidad es requerida",
              min: { value: 0.01, message: "La cantidad debe ser mayor a 0" },
              validate: (value) => {
                if (!selectedProduct) return true;
                const cantidad = parseFloat(value);
                if (tipo === "salida" && cantidad > selectedProduct.stock) {
                  return "No hay suficiente stock disponible";
                }
                return true;
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.cantidad && (
            <p className="text-red-600 text-sm mt-1">
              {errors.cantidad.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm">Tipo</label>
          <select
            {...register("tipo", {
              required: "Seleccione el tipo de movimiento",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
          {errors.tipo && (
            <p className="text-red-600 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm">Motivo</label>
          <input
            type="text"
            {...register("motivo", { required: "El motivo es requerido" })}
            className="w-full p-2 border rounded"
          />
          {errors.motivo && (
            <p className="text-red-600 text-sm mt-1">{errors.motivo.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Registrando..." : "Registrar Movimiento"}
          </button>
        </div>
      </form>
    </div>
  );
}
