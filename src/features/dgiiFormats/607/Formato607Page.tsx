import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { Formato607Form } from "./components/Formato607Form";
import { VentasTable } from "./components/VentasTable";
import { ExportButton } from "./components/ExportButton";
import { formato607Service } from "./services/formato607Service";
import { Venta, Periodo } from "./types/formato607.types";

export const Formato607Page: React.FC = () => {
  const [periodo, setPeriodo] = React.useState<Periodo>({
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear(),
  });
  const [ventas, setVentas] = React.useState<Venta[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchVentas = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await formato607Service.getVentasByPeriodo(periodo);
      if (response.success) {
        setVentas(response.data);
      } else {
        setError(response.message || "Error al cargar las ventas");
      }
    } catch (err) {
      setError("Error al cargar las ventas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  React.useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const handlePeriodoChange = (newPeriodo: Periodo) => {
    setPeriodo(newPeriodo);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Formato 607 - Ventas
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Formato607Form
            periodo={periodo}
            onPeriodoChange={handlePeriodoChange}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ExportButton
              ventas={ventas}
              disabled={loading || !ventas.length}
            />
          </Box>

          <VentasTable ventas={ventas} loading={loading} />
        </Paper>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
