import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  TableChart as ExcelIcon,
  TextFields as TxtIcon,
} from "@mui/icons-material";
import { Venta, ExportOptions } from "../types/formato607.types";
import { generateFormato607 } from "../utils/generateFormato607";

interface ExportButtonProps {
  ventas: Venta[];
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  ventas,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (options: ExportOptions) => {
    try {
      setLoading(true);
      const blob = await generateFormato607(ventas, options);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formato607_${new Date().toISOString().split("T")[0]}.${options.formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al exportar:", error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          loading ? <CircularProgress size={20} /> : <FileDownloadIcon />
        }
        onClick={handleClick}
        disabled={disabled || loading}
      >
        Exportar
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => handleExport({ formato: "xlsx", separador: "," })}
        >
          <ListItemIcon>
            <ExcelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar como Excel</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleExport({ formato: "txt", separador: "," })}
        >
          <ListItemIcon>
            <TxtIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar como TXT (CSV)</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleExport({ formato: "txt", separador: "\t" })}
        >
          <ListItemIcon>
            <TxtIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar como TXT (Tab)</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
