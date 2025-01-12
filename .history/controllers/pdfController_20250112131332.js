const PDFDocument = require('pdfkit');

exports.generateBillPDF = (req, res) => {
    try {
        // Extract data from the request body
        const { customerName, invoiceNumber, items } = req.body;

        // Validate the input
        if (!customerName || !invoiceNumber || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid input data. Please provide customer name, invoice number, and items.' });
        }

        // Create a new PDF document with customized margins and layout
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for the browser to recognize as a PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="bill.pdf"');

        // Pipe the PDF stream to the response
        doc.pipe(res);

        // Add Company Logo (replace it with an actual logo image later)
        // doc.image('path-to-logo.png', 50, 50, { width: 50 }); // Optionally add logo here
        doc
            .fontSize(30)
            .font('Helvetica-Bold')
            .text('Cozy Haven Enterprises', { align: 'center', letterSpacing: 1 })
            .moveDown(0.5);

        // Add company details (Address, Phone) with modern spacing
        doc
            .fontSize(12)
            .font('Helvetica')
            .text('456 Example Street, Bangalore, Karnataka, 560001', { align: 'center' })
            .text('Phone: +91-1234567890', { align: 'center' })
            .moveDown(2);

        // Add Bill Details Section with improved typography
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(`Invoice Number: ${invoiceNumber}`, 50)
            .text(`Date: ${new Date().toLocaleDateString()}`, 50)
            .text(`Customer: ${customerName}`, 50)
            .moveDown(1);

        // Draw a subtle line after bill details for separation
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#CCCCCC')
            .stroke();

        doc.moveDown(1);

        // Table Header with a more modern grid style
        const tableTop = doc.y;
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

        // Table Rows with improved layout and fonts
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

        // Grand Total Section with highlighted background and modern styling
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

        // Add a subtle divider line
        doc
            .moveTo(50, currentY + 50)
            .lineTo(500, currentY + 50)
            .strokeColor('#CCCCCC')
            .stroke();

        // Footer with modern thank you message and contact info
        doc
            .moveDown(2)
            .fontSize(10)
            .font('Helvetica')
            .fillColor('gray')
            .text('Thank you for your business!', { align: 'center', opacity: 0.7 })
            .text('For inquiries, contact support@cozyhaven.com', { align: 'center', opacity: 0.7 });

        // Finalize the PDF and send it
        doc.end();
    } catch (error) {
        console.error('Error generating bill PDF:', error);
        res.status(500).send('Error generating bill PDF: ' + error.message);
    }
};
