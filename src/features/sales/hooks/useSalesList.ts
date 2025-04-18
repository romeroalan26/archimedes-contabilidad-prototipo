import { useSalesStore } from "../../../stores/salesStore";

export function useSalesList() {
  const sales = useSalesStore((state) => state.sales);

  return {
    data: sales,
    isLoading: false,
    error: null,
  };
}
