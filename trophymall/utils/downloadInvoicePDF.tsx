import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadInvoicePDF = async (invoice: any) => {
  try {
    // 🔥 FETCH ITEMS
    const res = await fetch(
      `/api/invoice-items?invoice_id=${invoice.id}`
    );

    if (!res.ok) throw new Error("Failed to fetch invoice items");

    const items = await res.json();

    const doc = new jsPDF();

    // 🎨 COLORS
    const primary: [number, number, number] = [22, 163, 74]; // green
    const gray: [number, number, number] = [120, 120, 120];

    // 🏢 LOGO (IMPORTANT: must be public path or base64)
    try {
      const img = new Image();
      img.src = "/logo/logo.png";

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      doc.addImage(img, "PNG", 150, 10, 40, 20);
    } catch (e) {
      console.warn("Logo load failed");
    }

    // 🧾 TITLE
    doc.setFontSize(20);
    doc.setTextColor(...primary);
    doc.text("INVOICE", 14, 20);

    // 🔹 FORMATTERS
    const formatCurrency = (val: any) =>
      `₹${Number(val || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`;

    const formatDate = (date: any) =>
      date
        ? new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";

    // 📄 INVOICE INFO
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    console.log(items,'9999999999')
    console.log(invoice,'000000000000')

    doc.text(`Invoice No: ${invoice.id}`, 14, 35);
    doc.text(`Invoice Date: ${formatDate(invoice.invoice_date)}`, 14, 42);
    doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 14, 49);

    // 👤 CUSTOMER
    doc.setFontSize(11);
    doc.text("Billed To:", 14, 65);

    doc.setFontSize(10);
    doc.text(invoice.customer || "-", 14, 72);

    // 🏢 COMPANY
    doc.setFontSize(11);
    doc.text("Billed By:", 140, 65);

    doc.setFontSize(10);
    doc.text("TrophyMall", 140, 72);
    doc.text("India", 140, 78);

    // 📦 TABLE DATA (SAFE)

    //console.log(tableData)

    const tableData =
    
      Array.isArray(items) && items.length > 0
        ? items.map((item: any, i: number) => [
            i + 1,
            item.product_name || "-",
            item.quantity || 0,
            formatCurrency(item.price),
            formatCurrency(item.total),
          ])
        : [["-", "No items found", "-", "-", "-"]];

        console.log(tableData)

    autoTable(doc, {
      startY: 90,
      head: [["#", "Item", "Qty", "Rate", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: primary,
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 9,
      },
    });

    const finalY =
      (doc as any).lastAutoTable?.finalY
        ? (doc as any).lastAutoTable.finalY + 10
        : 120;

    // 💰 TOTALS
    doc.setFontSize(10);

    console.log(invoice)

    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 140, finalY);
    doc.text(`Discount: ${formatCurrency(invoice.discount)}`, 140, finalY + 6);
    doc.text(`GST: ${formatCurrency(invoice.tax)}`, 140, finalY + 12);
    doc.text(`Deposit: ${formatCurrency(invoice.deposit)}`, 140, finalY + 18);

    doc.setFontSize(12);
    doc.setTextColor(...primary);
    doc.text(
      `Total: ${formatCurrency(invoice.total_amount)}`,
      140,
      finalY + 28
    );

    // 📝 NOTES
    if (invoice.notes) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      doc.text("Notes:", 14, finalY + 20);
      doc.text(invoice.notes, 14, finalY + 26);
    }

    // 📌 FOOTER
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text(
      "This is an electronically generated document, no signature required.",
      14,
      285
    );

    // ⬇️ DOWNLOAD
    doc.save(`${invoice.invoice_id}.pdf`);
  } catch (err) {
    console.error("PDF Error:", err);
    alert("Failed to generate invoice PDF");
  }
};