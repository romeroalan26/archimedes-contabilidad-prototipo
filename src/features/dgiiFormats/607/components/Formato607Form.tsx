import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import { Periodo } from "../types/formato607.types";

interface Formato607FormProps {
  periodo: Periodo;
  onPeriodoChange: (periodo: Periodo) => void;
}

export const Formato607Form: React.FC<Formato607FormProps> = ({
  periodo,
  onPeriodoChange,
}) => {
  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const años = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Seleccionar Período
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select
              value={periodo.mes}
              label="Mes"
              onChange={(e) =>
                onPeriodoChange({
                  ...periodo,
                  mes: Number(e.target.value),
                })
              }
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select
              value={periodo.año}
              label="Año"
              onChange={(e) =>
                onPeriodoChange({
                  ...periodo,
                  año: Number(e.target.value),
                })
              }
            >
              {años.map((año) => (
                <MenuItem key={año} value={año}>
                  {año}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
