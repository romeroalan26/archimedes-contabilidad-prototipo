import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollServices } from "../services";
import type { Employee } from "../types/employee";
import type { PayrollDetails } from "../types/payroll";

// Employee hooks
export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: payrollServices.getEmployees,
  });
};

export const useEmployee = (id: number) => {
  return useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => payrollServices.getEmployee(id),
  });
};

// Payroll hooks
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<PayrollDetails, Error, Omit<PayrollDetails, "id">>({
    mutationFn: payrollServices.createPayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};

export const usePayrollDetails = (id: number) => {
  return useQuery<PayrollDetails>({
    queryKey: ["payroll", id],
    queryFn: () => payrollServices.getPayrollDetails(id),
  });
};

export const usePayrollHistory = (filters?: {
  empleadoId?: number;
  periodoInicio?: string;
  periodoFin?: string;
}) => {
  return useQuery<PayrollDetails[]>({
    queryKey: ["payrolls", filters],
    queryFn: () => payrollServices.getPayrollHistory(filters),
  });
};

export const useExportPayroll = () => {
  return useMutation<Blob, Error, { id: number; format: "tss" | "pdf" }>({
    mutationFn: ({ id, format }) => payrollServices.exportPayroll(id, format),
  });
};

export const useCalculatePayroll = (employeeId: number) => {
  return useQuery<PayrollDetails>({
    queryKey: ["payroll-calculation", employeeId],
    queryFn: () => payrollServices.calculatePayroll(employeeId),
  });
}; 