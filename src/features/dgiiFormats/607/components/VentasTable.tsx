import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Venta } from "../types/formato607.types";

interface VentasTableProps {
  ventas: Venta[];
  loading?: boolean;
}

export const VentasTable: React.FC<VentasTableProps> = ({
  ventas,
  loading = false,
}) => {
  if (loading) {
    return <Typography>Cargando ventas...</Typography>;
  }

  if (!ventas.length) {
    return <Typography>No hay ventas para mostrar</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>RNC/Cédula</TableCell>
            <TableCell>Tipo de ID</TableCell>
            <TableCell>NCF</TableCell>
            <TableCell>Tipo de Comprobante</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Monto Facturado</TableCell>
            <TableCell align="right">ITBIS Facturado</TableCell>
            <TableCell align="right">Retención ISR</TableCell>
            <TableCell align="right">Retención ITBIS</TableCell>
            <TableCell>Forma de Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell>{venta.rncCedula}</TableCell>
              <TableCell>{venta.tipoIdentificacion}</TableCell>
              <TableCell>{venta.ncf}</TableCell>
              <TableCell>{venta.tipoComprobante}</TableCell>
              <TableCell>{venta.fechaComprobante}</TableCell>
              <TableCell align="right">
                {venta.montoFacturado.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {venta.itbisFacturado.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {venta.retenciones.isr.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {venta.retenciones.itbis.toFixed(2)}
              </TableCell>
              <TableCell>{venta.formaPago}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
