import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale } from "../types";
import { Client } from "../../../types/types";

interface InvoicePDFProps {
  sale: Sale;
  client: Client;
}

export const generateInvoicePDF = ({ sale, client }: InvoicePDFProps) => {
  // Crear un nuevo documento PDF
  const doc = new jsPDF();

  // Configuración de la página
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  

  // Título y encabezado
  doc.setFontSize(20);
  doc.text("FACTURA", pageWidth / 2, 20, { align: "center" });

  // Información de la empresa (placeholder)
  doc.setFontSize(12);
  doc.text("EMPRESA DEMO S.R.L.", margin, 35);
  doc.setFontSize(10);
  doc.text("RNC: 123-456789-0", margin, 42);
  doc.text("Dirección: Calle Principal #123", margin, 49);
  doc.text("Tel: (809) 123-4567", margin, 56);

  // Información del cliente
  doc.setFontSize(12);
  doc.text("Cliente:", margin, 70);
  doc.setFontSize(10);
  doc.text(`Nombre: ${client.name}`, margin, 77);
  doc.text(`RNC/Cédula: ${client.rnc}`, margin, 84);
  doc.text(`Email: ${client.email}`, margin, 91);
  doc.text(`Tel: ${client.phone}`, margin, 98);

  // Información de la factura
  doc.setFontSize(12);
  doc.text("Detalles de la Factura:", pageWidth - margin - 80, 70);
  doc.setFontSize(10);
  doc.text(
    `Fecha: ${new Date(sale.date).toLocaleDateString()}`,
    pageWidth - margin - 80,
    77
  );
  doc.text(`NCF: B01-${sale.id.padStart(5, "0")}`, pageWidth - margin - 80, 84);
  doc.text(
    `Tipo: ${
      client.ncfType === "consumidor_final"
        ? "Consumidor Final"
        : client.ncfType === "credito_fiscal"
          ? "Crédito Fiscal"
          : client.ncfType === "gubernamental"
            ? "Gubernamental"
            : "Otro"
    }`,
    pageWidth - margin - 80,
    91
  );
  doc.text(
    `Referencia: V-${sale.id.padStart(5, "0")}`,
    pageWidth - margin - 80,
    98
  );

  // Tabla de productos
  const tableData = sale.items.map((item) => [
    item.productId.toString(),
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${item.itbis.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`,
    `$${(item.quantity * item.price + item.itbis).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 110,
    head: [["Producto", "Cantidad", "Precio", "ITBIS", "Subtotal", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
    },
    footStyles: { fillColor: [240, 240, 240] },
  });

  // Obtener la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY || 110;

  // Totales
  const subtotal = sale.total - sale.itbis;

  doc.setFontSize(10);
  doc.text("Subtotal:", pageWidth - margin - 80, finalY + 10);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin - 20, finalY + 10, {
    align: "right",
  });

  doc.text("ITBIS:", pageWidth - margin - 80, finalY + 17);
  doc.text(`$${sale.itbis.toFixed(2)}`, pageWidth - margin - 20, finalY + 17, {
    align: "right",
  });

  // Si hay descuento, mostrarlo
  const totalDiscount = sale.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price + item.itbis;
    // Usar el total sin descuento si no hay discountedSubtotal
    return sum + (itemTotal - itemTotal);
  }, 0);

  if (totalDiscount > 0) {
    doc.text("Descuento:", pageWidth - margin - 80, finalY + 24);
    doc.text(
      `$${totalDiscount.toFixed(2)}`,
      pageWidth - margin - 20,
      finalY + 24,
      { align: "right" }
    );
  }

  // Total final
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Total:",
    pageWidth - margin - 80,
    finalY + (totalDiscount > 0 ? 31 : 24)
  );
  doc.text(
    `$${sale.total.toFixed(2)}`,
    pageWidth - margin - 20,
    finalY + (totalDiscount > 0 ? 31 : 24),
    { align: "right" }
  );

  // Información de pago
  if (sale.type === "credit" || sale.type === "mixed") {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Avance:",
      pageWidth - margin - 80,
      finalY + (totalDiscount > 0 ? 38 : 31)
    );
    doc.text(
      `$${(sale.advancePayment || 0).toFixed(2)}`,
      pageWidth - margin - 20,
      finalY + (totalDiscount > 0 ? 38 : 31),
      { align: "right" }
    );

    doc.text(
      "Balance Pendiente:",
      pageWidth - margin - 80,
      finalY + (totalDiscount > 0 ? 45 : 38)
    );
    doc.text(
      `$${(sale.remainingBalance || 0).toFixed(2)}`,
      pageWidth - margin - 20,
      finalY + (totalDiscount > 0 ? 45 : 38),
      { align: "right" }
    );
  }

  // Pie de página
  doc.setFontSize(8);
  doc.text(
    "Esta es una factura de demostración. No es un documento fiscal válido.",
    pageWidth / 2,
    finalY + (totalDiscount > 0 ? 60 : 53),
    { align: "center" }
  );

  // Guardar el PDF
  doc.save(`factura-${sale.id}.pdf`);
};

