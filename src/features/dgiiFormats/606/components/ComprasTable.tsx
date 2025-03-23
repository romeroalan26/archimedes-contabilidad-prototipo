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
import { Compra } from "../types/formato606.types";

interface ComprasTableProps {
  compras: Compra[];
  loading: boolean;
}

export const ComprasTable: React.FC<ComprasTableProps> = ({
  compras,
  loading,
}) => {
  if (loading) {
    return <Typography>Cargando compras...</Typography>;
  }

  if (compras.length === 0) {
    return <Typography>No hay compras para mostrar</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>RNC/Cédula</TableCell>
            <TableCell>Tipo ID</TableCell>
            <TableCell>NCF</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell align="right">ITBIS</TableCell>
            <TableCell align="right">Ret. ISR</TableCell>
            <TableCell align="right">Ret. ITBIS</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compras.map((compra) => (
            <TableRow key={compra.id}>
              <TableCell>{compra.rncProveedor}</TableCell>
              <TableCell>{compra.tipoIdentificacion}</TableCell>
              <TableCell>{compra.ncf}</TableCell>
              <TableCell>
                {new Date(compra.fechaComprobante).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                {compra.montoFacturado.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                {compra.itbisFacturado.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                {compra.retencionISR.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                {compra.retencionITBIS.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{compra.tipoBienServicio}</TableCell>
              <TableCell>
                {new Date(compra.fechaPago).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
