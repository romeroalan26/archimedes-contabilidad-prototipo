import { useForm } from "react-hook-form";

export default function ChequesForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Cheque registrado:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Cheque</h3>
      {/* Aquí irá el formulario de cheques */}
    </div>
  );
}
