import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { Reconciliation } from "../types";

export const exportService = {
  exportToExcel(reconciliation: Reconciliation) {
    const wb = XLSX.utils.book_new();

    // Movimientos sheet
    const movementsData = reconciliation.movements.map((movement) => ({
      Fecha: new Date(movement.date).toLocaleDateString("es-ES"),
      Tipo: movement.type,
      Descripción: movement.description,
      Monto: movement.amount,
      Estado: movement.isReconciled ? "Conciliado" : "Pendiente",
    }));

    const ws = XLSX.utils.json_to_sheet(movementsData);
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");

    // Resumen sheet
    const summaryData = [
      {
        "Balance en Banco": reconciliation.bankBalance,
        "Balance Conciliado": reconciliation.reconciledBalance,
        Diferencia: reconciliation.difference,
        Estado: reconciliation.status,
      },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

    XLSX.writeFile(
      wb,
      `conciliacion_${reconciliation.bankId}_${reconciliation.month}_${reconciliation.year}.xlsx`
    );
  },

  exportToPDF(reconciliation: Reconciliation) {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Conciliación Bancaria", 20, 20);

    // Información básica
    doc.setFontSize(12);
    doc.text(`Banco: ${reconciliation.bankId}`, 20, 30);
    doc.text(`Período: ${reconciliation.month}/${reconciliation.year}`, 20, 40);

    // Resumen
    doc.setFontSize(14);
    doc.text("Resumen", 20, 50);
    doc.setFontSize(12);
    doc.text(`Balance en Banco: ${reconciliation.bankBalance}`, 20, 60);
    doc.text(`Balance Conciliado: ${reconciliation.reconciledBalance}`, 20, 70);
    doc.text(`Diferencia: ${reconciliation.difference}`, 20, 80);

    // Movimientos
    doc.setFontSize(14);
    doc.text("Movimientos", 20, 100);
    doc.setFontSize(10);

    let y = 110;
    reconciliation.movements.forEach((movement) => {
      doc.text(
        `${new Date(movement.date).toLocaleDateString("es-ES")} - ${movement.type} - ${movement.amount}`,
        20,
        y
      );
      y += 10;
    });

    doc.save(
      `conciliacion_${reconciliation.bankId}_${reconciliation.month}_${reconciliation.year}.pdf`
    );
  },
};
