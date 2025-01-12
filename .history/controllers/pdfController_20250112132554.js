const PDFDocument = require('pdfkit');

exports.generateBillPDF = (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for the browser to recognize as a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="bill.pdf"');

    // Pipe the PDF stream to the response
    doc.pipe(res);

    // Add Company Name and Logo (You can replace it with an actual logo image later)
    doc
      .fontSize(30)
      .font('Helvetica-Bold')
      .text('Cozy Haven Enterprises', { align: 'center' })
      .moveDown(0.5);

    // Add company details (Address, Phone) with modern spacing
    doc
      .fontSize(12)
      .font('Helvetica')
      .text('456 Example Street, Bangalore, Karnataka, 560001', { align: 'center' })
      .text('Phone: +91-1234567890', { align: 'center' })
      .moveDown(1);

    // Add Bill Details Section with better alignment
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`Invoice Number: INV12345`, 50)
      .text(`Date: ${new Date().toLocaleDateString()}`, 50)
      .text(`Customer: John Doe`, 50)
      .moveDown(1);

    // Table Header with grid-like style
    const tableTop = doc.y + 10;
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Item', 50, tableTop)
      .text('Quantity', 200, tableTop)
      .text('Unit Price', 300, tableTop, { width: 90, align: 'right' })
      .text('Total', 400, tableTop, { width: 90, align: 'right' });

    doc
      .moveTo(50, tableTop + 20)
      .lineTo(500, tableTop + 20)
      .strokeColor('#000000')
      .stroke();

    // Table Rows with better layout and fonts
    const items = [
      { name: 'Room Rent (Single)', quantity: 1, unitPrice: 6000 },
      { name: 'Mess Charges', quantity: 1, unitPrice: 2000 },
      { name: 'Laundry', quantity: 1, unitPrice: 500 },
    ];

    let currentY = tableTop + 30;

    items.forEach((item) => {
      const total = item.quantity * item.unitPrice;

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(item.name, 50, currentY)
        .text(item.quantity, 200, currentY)
        .text(`₹ ${item.unitPrice.toFixed(2)}`, 300, currentY, { width: 90, align: 'right' })
        .text(`₹ ${total.toFixed(2)}`, 400, currentY, { width: 90, align: 'right' });

      currentY += 20;
    });

    // Add a border line after items
    doc
      .moveTo(50, currentY)
      .lineTo(500, currentY)
      .strokeColor('#000000')
      .stroke();

    // Calculate the Total Amount
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // Grand Total Section with highlighted background
    doc
      .rect(300, currentY + 10, 200, 30)
      .fill('#f1f1f1')
      .strokeColor('#000000')
      .stroke();

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Grand Total', 300, currentY + 10, { width: 90, align: 'right' })
      .text(`₹ ${totalAmount.toFixed(2)}`, 400, currentY + 10, { width: 90, align: 'right' });

    // Footer with modern thank you message and contact info
    doc
      .moveDown(2)
      .fontSize(10)
      .font('Helvetica')
      .fillColor('gray')
      .text('Thank you for your business!', { align: 'center' })
      .text('For inquiries, contact support@cozyhaven.com', { align: 'center' });

    // Finalize the PDF and send it
    doc.end();
  } catch (error) {
    console.error('Error generating bill PDF:', error);
    res.status(500).send('Error generating bill PDF: ' + error.message);
  }
};
