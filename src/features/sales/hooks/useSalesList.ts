import { useState, useEffect } from "react";
import { Sale } from "../types";
import { mockSales } from "../salesData";

export function useSalesList() {
  const [data, setData] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData(mockSales);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch sales")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  return { data, isLoading, error };
}
