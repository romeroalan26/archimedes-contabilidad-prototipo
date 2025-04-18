import { useState } from "react";
import { Sale } from "../types";

export function useCreateSale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (sale: Omit<Sale, "id">) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sale;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create sale"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
