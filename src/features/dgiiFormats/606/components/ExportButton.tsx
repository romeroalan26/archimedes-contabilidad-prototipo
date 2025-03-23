import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { Compra, Formato606Config } from "../types/formato606.types";

interface ExportButtonProps {
  compras: Compra[];
  config: Formato606Config;
  onExport: (config: Formato606Config, compras: Compra[]) => Promise<void>;
  loading: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  compras,
  config,
  onExport,
  loading,
}) => {
  const handleExport = async () => {
    await onExport(config, compras);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
      onClick={handleExport}
      disabled={loading || compras.length === 0}
    >
      {loading ? "Exportando..." : "Exportar Formato 606"}
    </Button>
  );
};
