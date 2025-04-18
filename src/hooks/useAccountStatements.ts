import { useState, useEffect } from "react";
import { AccountStatement } from "../types/types";

export function useAccountStatements(clientId?: string) {
  const [data, setData] = useState<AccountStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatements = async () => {
      if (!clientId) {
        setData([]);
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API call
        const response = await new Promise<AccountStatement[]>((resolve) => {
          setTimeout(() => {
            resolve([]);
          }, 500);
        });
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch statements")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatements();
  }, [clientId]);

  return { data, isLoading, error };
}
