import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Formato606Config } from "../types/formato606.types";

interface Formato606FormProps {
  config: Formato606Config;
  onChange: (config: Formato606Config) => void;
}

export const Formato606Form: React.FC<Formato606FormProps> = ({
  config,
  onChange,
}) => {
  const handleChange =
    (field: keyof Formato606Config) =>
    (event: SelectChangeEvent<number | string>) => {
      onChange({
        ...config,
        [field]:
          field === "formatoExportacion"
            ? (event.target.value as "xlsx" | "txt")
            : Number(event.target.value),
      });
    };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configuración del Formato 606
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select
              value={config.mes}
              label="Mes"
              onChange={handleChange("mes")}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <MenuItem key={mes} value={mes}>
                  {new Date(2000, mes - 1).toLocaleString("es-DO", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select
              value={config.año}
              label="Año"
              onChange={handleChange("año")}
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - 2 + i
              ).map((año) => (
                <MenuItem key={año} value={año}>
                  {año}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Formato de Exportación</InputLabel>
            <Select
              value={config.formatoExportacion}
              label="Formato de Exportación"
              onChange={handleChange("formatoExportacion")}
            >
              <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
              <MenuItem value="txt">Texto (TXT)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};
