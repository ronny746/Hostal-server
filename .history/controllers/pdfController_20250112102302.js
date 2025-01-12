const PDFDocument = require('pdfkit');

exports.generateHostelPDF = (req, res) => {
  try {
    // Create a new PDF document
    const invoiceData = {
        invoiceNumber: "INV-12345",
        date: "2024-12-29",
        sender: {
          name: "John Doe Enterprises",
          address: "123 Business Street, Cityville, Country",
          email: "contact@johndoe.com",
        },
        recipient: {
          name: "Jane Smith",
          address: "456 Home Street, Hometown, Country",
          email: "jane.smith@example.com",
        },
        items: [
          { description: "Website Development", quantity: 1, unitPrice: 1500, total: 1500 },
          { description: "Monthly Hosting", quantity: 12, unitPrice: 50, total: 600 },
          { description: "SEO Optimization", quantity: 1, unitPrice: 300, total: 300 },
        ],
        totalAmount: 2400,
      };
    
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 40 });
    
      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="invoice_${invoiceData.invoiceNumber}.pdf"`);
    
      // Pipe the PDF to the response
      doc.pipe(res);
    
      // Add Header
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
    
      // Invoice Details
      doc.fontSize(12)
        .text(`Invoice Number: ${invoiceData.invoiceNumber}`)
        .text(`Date: ${invoiceData.date}`)
        .moveDown();
    
      // Sender and Recipient
      doc.text("From:", { underline: true }).text(invoiceData.sender.name)
        .text(invoiceData.sender.address)
        .text(invoiceData.sender.email)
        .moveDown();
    
      doc.text("To:", { underline: true }).text(invoiceData.recipient.name)
        .text(invoiceData.recipient.address)
        .text(invoiceData.recipient.email)
        .moveDown();
    
      // Add Table Headers
      const tableHeaders = ["Description", "Quantity", "Unit Price", "Total"];
      doc.fontSize(12).text(`${tableHeaders[0].padEnd(40)}${tableHeaders[1].padEnd(15)}${tableHeaders[2].padEnd(15)}${tableHeaders[3]}`);
      doc.moveDown(0.5);
    
      // Add Table Rows
      invoiceData.items.forEach((item) => {
        const row = `${item.description.padEnd(40)}${String(item.quantity).padEnd(15)}${item.unitPrice.toFixed(2).padEnd(15)}${item.total.toFixed(2)}`;
        doc.text(row);
      });
    
      // Add Total
      doc.moveDown();
      doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`, { align: "right" });
    
      // Finalize and send the PDF
      doc.end();
};
