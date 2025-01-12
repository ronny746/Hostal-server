const PDFDocument = require('pdfkit');

exports.generateBillPDF = (req, res) => {
    try {
        // Extract data from the request body
        const { customerName, invoiceNumber, items, companyDetails } = req.body;

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
        if (companyDetails && companyDetails.logoPath) {
            doc.image(companyDetails.logoPath, 50, 50, { width: 100 });
        }

        // Add Company Name
        doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .text(companyDetails.name || 'Cozy Haven Enterprises', { align: 'center', letterSpacing: 1 })
            .moveDown(0.5);

        // Company contact details
        doc
            .fontSize(12)
            .font('Helvetica')
            .text(companyDetails.address || '456 Example Street, Bangalore, Karnataka, 560001', { align: 'center' })
            .text(companyDetails.phone || 'Phone: +91-1234567890', { align: 'center' })
            .moveDown(2);

        // Add Bill Info (Invoice number, Date, Customer Name)
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(`Invoice Number: ${invoiceNumber}`, 50)
            .text(`Date: ${new Date().toLocaleDateString()}`, 50)
            .text(`Customer: ${customerName}`, 50)
            .moveDown(1);

        // Draw a thin line under Bill Information
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#CCCCCC')
            .stroke();
        doc.moveDown(1);

        // Table Header for Itemized List
        const tableTop = doc.y;
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Item', 50, tableTop)
            .text('Quantity', 200, tableTop)
            .text('Unit Price', 300, tableTop, { width: 90, align: 'right' })
            .text('Total', 400, tableTop, { width: 90, align: 'right' });

        // Draw a separator line below the table headers
        doc
            .moveTo(50, tableTop + 20)
            .lineTo(550, tableTop + 20)
            .strokeColor('#000000')
            .stroke();

        // Add items to the table
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

        // Add a final line after the items section
        doc
            .moveTo(50, currentY)
            .lineTo(550, currentY)
            .strokeColor('#000000')
            .stroke();

        // Calculate the Total Amount
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        // Grand Total Section
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

        // Footer Section with Thank You and Contact Info
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
