import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollServices } from "./services";
import type { Employee } from "./employeesData";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: payrollServices.getEmployees,
  });
};

export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => payrollServices.getEmployee(id),
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payrollServices.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      employee,
    }: {
      id: number;
      employee: Partial<Employee>;
    }) => payrollServices.updateEmployee(id, employee),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payrollServices.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useCalculatePayroll = (employeeId: number) => {
  return useQuery({
    queryKey: ["payroll", employeeId],
    queryFn: () => payrollServices.calculatePayroll(employeeId),
  });
};

// Función auxiliar para calcular ISR
export const calculateISR = (salario: number): number => {
  if (salario <= 34685) return 0;
  if (salario <= 50000) return salario * 0.15;
  return salario * 0.25;
};

// Función auxiliar para calcular AFP
export const calculateAFP = (salario: number): number => {
  return salario * 0.0287;
};

// Función auxiliar para calcular ARS
export const calculateARS = (salario: number): number => {
  return salario * 0.0304;
};
