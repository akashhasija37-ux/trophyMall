import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadInvoicePDF = async (invoice: any) => {
  try {
    // 🔥 FETCH ITEMS
    const res = await fetch(`/api/invoice-items?invoice_id=${invoice.id}`);
    if (!res.ok) throw new Error("Failed to fetch invoice items");
    const items = await res.json();

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // 🎨 COLORS
    const primary: [number, number, number] = [22, 163, 74]; // green-600
    const grayText: [number, number, number] = [113, 113, 122]; // zinc-500

    // 🔹 FORMATTERS (Using 'Rs.' instead of '₹' to avoid font corruption in jsPDF)
    const formatCurrency = (val: any) =>
      `Rs. ${Number(val || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const formatDate = (date: any) =>
      date
        ? new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";

    const data = invoice.raw || {};
    const finalAmount = Number(data.total_amount || 0);

    // 🏢 LOGO EMBEDDING
    try {
      const img = new Image();
      img.src = "/logo/logo.png";
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      if (img.complete && img.naturalWidth !== 0) {
        doc.addImage(img, "PNG", 14, 12, 18, 18);
      }
    } catch (e) {
      console.warn("Logo load failed");
    }

    // 🔲 QR CODE EMBEDDING (Fetched dynamically from qrserver API as base64/image)
    try {
      const qrData = `Invoice:${invoice.id}|Total:Rs.${finalAmount.toFixed(2)}|GST:27AEOPN2614P1ZX`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;
      
      const qrImage = new Image();
      qrImage.crossOrigin = "Anonymous";
      qrImage.src = qrUrl;
      await new Promise((resolve) => {
        qrImage.onload = resolve;
        qrImage.onerror = resolve;
      });
      if (qrImage.complete && qrImage.naturalWidth !== 0) {
        doc.addImage(qrImage, "PNG", 160, 12, 20, 20);
      }
    } catch (e) {
      console.warn("QR Code load failed");
    }

    // 🏢 HEADER SECTION (Shifted right to accommodate logo)
    doc.setFontSize(16);
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.text("TROPHY MALL", 36, 17);

    doc.setFontSize(7);
    doc.setTextColor(34, 197, 94);
    doc.text("CRAFTED FOR LEGENDS", 36, 21);

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.text("THE MAKERS OF Trophies & Awards", 36, 25);
    doc.text("Manoj Nagdev: +91 99 700 999 19 | Office: +91 98 222 459 50", 36, 29);
    doc.text("trophymallulhasnagar@gmail.com", 36, 33);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("GST NO. 27AEOPN2614P1ZX", 36, 38);

    // Company Right Address (Left aligned relative to QR code at x=166)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...grayText);
    doc.text("1st Floor, Murlidhar Complex, Central Hospital Road,", 196, 36, { align: "right" });
    doc.text("Above Indian Bank, Ulhasnagar, Thane, Maharashtra, 421003", 196, 40, { align: "right" });

    // 🏷 CATEGORY BANNER
    doc.setFillColor(24, 24, 27);
    doc.rect(14, 44, 182, 6, "F");
    doc.setFontSize(6.5);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text(
      "MEDALS / TROPHIES / MEMENTOS / CUPS / AWARDS / BADGES / CERTIFICATES / SPORTS TROPHIES",
      105,
      47.8,
      { align: "center" }
    );

    // 📄 CUSTOMER & INVOICE META BOX
    doc.setDrawColor(218, 218, 218);
    doc.rect(14, 53, 182, 22);

    doc.setFontSize(8.5);
    doc.setTextColor(...grayText);
    doc.text("Customer Name :", 18, 59);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.customer || "Walk-in Customer", 48, 59);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Mobile No :", 18, 65);
    doc.setTextColor(0, 0, 0);
    doc.text(data.customer_mobile || "9527555666", 48, 65);

    doc.setTextColor(...grayText);
    doc.text("State :", 18, 71);
    doc.setTextColor(0, 0, 0);
    doc.text("27 | Maharashtra", 48, 71);

    // Right Meta
    doc.setTextColor(...grayText);
    doc.text("Invoice No. :", 130, 59);
    doc.setTextColor(22, 163, 74);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.id, 160, 59);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Invoice Date :", 130, 65);
    doc.setTextColor(0, 0, 0);
    doc.text(formatDate(data.invoice_date), 160, 65);

    doc.setTextColor(...grayText);
    doc.text("Salesman :", 130, 71);
    doc.setTextColor(0, 0, 0);
    doc.text(data.salesperson_name || "MANOJ SIR", 160, 71);

    // 📦 TABLE DATA MAPPING
    const itemRows = Array.isArray(items) ? items : [];
    const tableData = itemRows.map((item: any, idx: number) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const disc = Number(item.discount || 0);
      const netRate = price - (price * (disc / 100));
      const rowTotal = Number(item.total || qty * netRate);

      return [
        idx + 1,
        item.tm_code || `TM-${idx + 1}`,
        item.product_name || "Trophy / Award",
        item.hsn || "8306",
        `${item.gstPercent || 18}%`,
        qty,
        formatCurrency(price),
        item.unit || "Pcs",
        `${disc}%`,
        formatCurrency(netRate),
        formatCurrency(rowTotal),
      ];
    });

    const finalTableData =
      tableData.length > 0
        ? tableData
        : [[1, "-", "No items found", "-", "18%", 1, formatCurrency(0), "Pcs", "0%", formatCurrency(0), formatCurrency(0)]];

    autoTable(doc, {
      startY: 78,
      head: [["Sr", "Code", "Description", "HSN", "GST%", "Qty", "Rate", "Per", "Dis%", "Net Rate", "Amount"]],
      body: finalTableData,
      theme: "grid",
      headStyles: {
        fillColor: [24, 24, 27],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [40, 40, 40],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        1: { halign: "center", cellWidth: 16 },
        2: { cellWidth: 44 },
        3: { halign: "center", cellWidth: 14 },
        4: { halign: "center", cellWidth: 12 },
        5: { halign: "center", cellWidth: 10 },
        6: { halign: "right", cellWidth: 18 },
        7: { halign: "center", cellWidth: 10 },
        8: { halign: "center", cellWidth: 12 },
        9: { halign: "right", cellWidth: 18 },
        10: { halign: "right", cellWidth: 20 },
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 4
      : 130;

    // 💳 BANK DETAILS & SUMMARY BOX
    doc.setDrawColor(218, 218, 218);
    doc.rect(14, finalY, 182, 44);

    // Bank Details (Left side inside box)
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Bank Details :", 18, finalY + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Name :", 18, finalY + 12);
    doc.setTextColor(0, 0, 0);
    doc.text("INDIAN BANK (BRANCH: ULHASNAGAR - 3)", 42, finalY + 12);

    doc.setTextColor(...grayText);
    doc.text("A/C No. :", 18, finalY + 17);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("7826821688", 42, finalY + 17);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("IFSC No. :", 18, finalY + 22);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("IDIB0000016", 42, finalY + 22);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Terms & Conditions:", 18, finalY + 28);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...grayText);
    doc.text("1) Goods Once sold will not be taken back.", 18, finalY + 33);
    doc.text("2) Our responsibility ceases as soon as goods leave our shop.", 18, finalY + 37);
    doc.text("3) Payment 100% Advance Against Order.", 18, finalY + 41);

    // Summary Totals (Right side inside box)
    const subtotalNum = Number(data.subtotal || 0);
    const taxNum = Number(data.tax || 0);
    const cgstVal = taxNum / 2;
    const sgstVal = taxNum / 2;
    const discountNum = Number(data.discount || 0);
    const roundOffNum = Number(data.round_off || 0);
    const totalQty = itemRows.reduce((sum: number, i: any) => sum + Number(i.quantity || 0), 0);

    doc.setFontSize(7.5);
    doc.setTextColor(...grayText);
    doc.text("Total Qty :", 125, finalY + 6);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(String(totalQty), 190, finalY + 6, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Total Gross Amount :", 125, finalY + 11);
    doc.setTextColor(0, 0, 0);
    doc.text(formatCurrency(subtotalNum), 190, finalY + 11, { align: "right" });

    doc.setTextColor(...grayText);
    doc.text("Trade Disc :", 125, finalY + 16);
    doc.setTextColor(220, 38, 38);
    doc.text(`-${formatCurrency(subtotalNum * (discountNum / 100))}`, 190, finalY + 16, { align: "right" });

    doc.setTextColor(...grayText);
    doc.text("CGST AMT :", 125, finalY + 21);
    doc.setTextColor(22, 163, 74);
    doc.text(formatCurrency(cgstVal), 190, finalY + 21, { align: "right" });

    doc.setTextColor(...grayText);
    doc.text("SGST AMT :", 125, finalY + 26);
    doc.setTextColor(22, 163, 74);
    doc.text(formatCurrency(sgstVal), 190, finalY + 26, { align: "right" });

    doc.setTextColor(...grayText);
    doc.text("ROUND OFF :", 125, finalY + 31);
    doc.setTextColor(0, 0, 0);
    doc.text(formatCurrency(roundOffNum), 190, finalY + 31, { align: "right" });

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    doc.text(`BILL AMOUNT: ${formatCurrency(finalAmount)}`, 190, finalY + 40, { align: "right" });

    // ✍️ SIGNATURE SECTION
    const sigY = finalY + 50;
    doc.setFontSize(7.5);
    doc.setTextColor(...grayText);
    doc.text("Amount In Words: Verified & Generated Electronically", 14, sigY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("FOR TROPHY MALL", 170, sigY - 2, { align: "center" });

    doc.setLineWidth(0.3);
    doc.line(145, sigY + 7, 195, sigY + 7);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Authorised Signatory", 170, sigY + 11, { align: "center" });

    // ⬇️ DOWNLOAD PDF
    doc.save(`${invoice.id}.pdf`);
  } catch (err) {
    console.error("PDF Error:", err);
    alert("Failed to generate invoice PDF");
  }
};