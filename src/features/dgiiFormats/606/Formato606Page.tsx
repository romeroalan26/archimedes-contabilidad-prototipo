import React, { useState, useEffect } from "react";
import { Container, Box, Alert } from "@mui/material";
import { Formato606Form } from "./components/Formato606Form";
import { ComprasTable } from "./components/ComprasTable";
import { ExportButton } from "./components/ExportButton";
import {
  getComprasByPeriodo,
  exportFormato606,
} from "./services/formato606Service";
import {
  generateFormato606,
  generateExcelContent,
  generateTxtContent,
} from "./utils/generateFormato606";
import {
  Compra,
  Formato606Config,
  ValidationError,
} from "./types/formato606.types";

const initialConfig: Formato606Config = {
  mes: new Date().getMonth() + 1,
  año: new Date().getFullYear(),
  formatoExportacion: "xlsx",
};

export const Formato606Page: React.FC = () => {
  const [config, setConfig] = useState<Formato606Config>(initialConfig);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    loadCompras();
  }, [config.mes, config.año]);

  const loadCompras = async () => {
    setLoading(true);
    try {
      const data = await getComprasByPeriodo(config.mes, config.año);
      setCompras(data);
      setErrors([]);
    } catch (error) {
      setErrors([
        {
          field: "general",
          message:
            "Error al cargar las compras. Por favor, intente nuevamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (newConfig: Formato606Config) => {
    setConfig(newConfig);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await exportFormato606(config, compras);
      if (result.success) {
        const fileName = await generateFormato606(config);

        // Create a blob with the file content
        const content =
          config.formatoExportacion === "xlsx"
            ? await generateExcelContent(compras)
            : await generateTxtContent(compras);

        const blob = new Blob([content], {
          type:
            config.formatoExportacion === "xlsx"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "text/plain",
        });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setErrors(result.errors || []);
      }
    } catch (error) {
      setErrors([
        {
          field: "general",
          message:
            "Error al exportar el archivo. Por favor, intente nuevamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Formato606Form config={config} onChange={handleConfigChange} />

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </Alert>
        )}

        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <ExportButton
            compras={compras}
            config={config}
            onExport={handleExport}
            loading={loading}
          />
        </Box>

        <ComprasTable compras={compras} loading={loading} />
      </Box>
    </Container>
  );
};
