const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

exports.generateBillPDF = (req, res) => {
    try {
        // Extract data from the request body
        const { customerName, invoiceNumber, items, companyDetails } = req.body;

        // Validate the input
        if (!customerName || !invoiceNumber || !items || !Array.isArray(items) || items.length === 0 || !companyDetails) {
            return res.status(400).json({ error: 'Invalid input data. Please provide customer name, invoice number, items, and company details.' });
        }

        // Create a new PDF document with customized margins and layout
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for the browser to recognize as a PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="bill.pdf"');

        // Pipe the PDF stream to the response
        doc.pipe(res);

        // Add Border around the content
        doc
            .rect(40, 40, 520, 720) // Border around the page (X, Y, Width, Height)
            .strokeColor('#000000')
            .lineWidth(1)
            .stroke();

        // Add Company Logo
        if (companyDetails.logoPath) {
            axios({ url: companyDetails.logoPath, responseType: 'stream' }).then(response => {
                response.data.pipe(fs.createWriteStream('logo.png')).on('finish', () => {
                    doc.image('logo.png', 50, 50, { width: 100 });
                    doc.moveDown(1);
                    doc.fontSize(24).font('Helvetica-Bold').text(companyDetails.name, { align: 'center' }).moveDown(0.5);

                    // Company contact details
                    doc.fontSize(12).font('Helvetica')
                        .text(companyDetails.address, { align: 'center' })
                        .text(companyDetails.phone, { align: 'center' })
                        .moveDown(2);

                    // Add Bill Info (Invoice number, Date, Customer Name)
                    doc.fontSize(14).font('Helvetica-Bold')
                        .text(`Invoice Number: ${invoiceNumber}`, 50)
                        .text(`Date: ${new Date().toLocaleDateString()}`, 50)
                        .text(`Customer: ${customerName}`, 50)
                        .moveDown(1);

                    // Draw a thin line under Bill Information
                    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#CCCCCC').stroke();
                    doc.moveDown(1);

                    // Table Header for Itemized List
                    const tableTop = doc.y;
                    doc.fontSize(12).font('Helvetica-Bold')
                        .text('Item', 50, tableTop)
                        .text('Quantity', 200, tableTop)
                        .text('Unit Price', 300, tableTop, { width: 90, align: 'right' })
                        .text('Total', 400, tableTop, { width: 90, align: 'right' });

                    // Draw a separator line below the table headers
                    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).strokeColor('#000000').stroke();

                    // Add items to the table
                    let currentY = tableTop + 30;
                    items.forEach((item) => {
                        const total = item.quantity * item.unitPrice;
                        doc.fontSize(12).font('Helvetica')
                            .text(item.name, 50, currentY)
                            .text(item.quantity, 200, currentY)
                            .text(`₹ ${item.unitPrice.toFixed(2)}`, 300, currentY, { width: 90, align: 'right' })
                            .text(`₹ ${total.toFixed(2)}`, 400, currentY, { width: 90, align: 'right' });

                        currentY += 20;
                    });

                    // Add a final line after the items section
                    doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor('#000000').stroke();

                    // Calculate the Total Amount
                    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

                    // Grand Total Section
                    doc.rect(300, currentY + 10, 200, 30).strokeColor('#000000').stroke();
                    doc.fontSize(14).font('Helvetica-Bold')
                        .text('Grand Total', 300, currentY + 10, { width: 90, align: 'right' })
                        .text(`₹ ${totalAmount.toFixed(2)}`, 400, currentY + 10, { width: 90, align: 'right' });

                    // Footer Section with Thank You and Contact Info
                    doc.moveDown(2)
                        .fontSize(10)
                        .font('Helvetica')
                        .fillColor('gray')
                        .text('Thank you for your business!', { align: 'center' })
                        .text('For inquiries, contact support@cozyhaven.com', { align: 'center' });

                    // Finalize the PDF and send it
                    doc.end();
                });
            }).catch(err => {
                console.error('Error loading logo:', err);
                res.status(500).send('Error loading logo: ' + err.message);
            });
        } else {
            // If logo URL is not available, skip the logo
            doc.fontSize(24).font('Helvetica-Bold').text(companyDetails.name, { align: 'center' }).moveDown(0.5);

            // Company contact details
            doc.fontSize(12).font('Helvetica')
                .text(companyDetails.address, { align: 'center' })
                .text(companyDetails.phone, { align: 'center' })
                .moveDown(2);

            // Add Bill Info (Invoice number, Date, Customer Name)
            doc.fontSize(14).font('Helvetica-Bold')
                .text(`Invoice Number: ${invoiceNumber}`, 50)
                .text(`Date: ${new Date().toLocaleDateString()}`, 50)
                .text(`Customer: ${customerName}`, 50)
                .moveDown(1);

            // Draw a thin line under Bill Information
            doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#CCCCCC').stroke();
            doc.moveDown(1);

            // Table Header for Itemized List
            const tableTop = doc.y;
            doc.fontSize(12).font('Helvetica-Bold')
                .text('Item', 50, tableTop)
                .text('Quantity', 200, tableTop)
                .text('Unit Price', 300, tableTop, { width: 90, align: 'right' })
                .text('Total', 400, tableTop, { width: 90, align: 'right' });

            // Draw a separator line below the table headers
            doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).strokeColor('#000000').stroke();

            // Add items to the table
            let currentY = tableTop + 30;
            items.forEach((item) => {
                const total = item.quantity * item.unitPrice;
                doc.fontSize(12).font('Helvetica')
                    .text(item.name, 50, currentY)
                    .text(item.quantity, 200, currentY)
                    .text(`₹ ${item.unitPrice.toFixed(2)}`, 300, currentY, { width: 90, align: 'right' })
                    .text(`₹ ${total.toFixed(2)}`, 400, currentY, { width: 90, align: 'right' });

                currentY += 20;
            });

            // Add a final line after the items section
            doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor('#000000').stroke();

            // Calculate the Total Amount
            const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

            // Grand Total Section
            doc.rect(300, currentY + 10, 200, 30).strokeColor('#000000').stroke();
            doc.fontSize(14).font('Helvetica-Bold')
                .text('Grand Total', 300, currentY + 10, { width: 90, align: 'right' })
                .text(`₹ ${totalAmount.toFixed(2)}`, 400, currentY + 10, { width: 90, align: 'right' });

            // Footer Section with Thank You and Contact Info
            doc.moveDown(2)
                .fontSize(10)
                .font('Helvetica')
                .fillColor('gray')
                .text('Thank you for your business!', { align: 'center' })
                .text('For inquiries, contact support@cozyhaven.com', { align: 'center' });

            // Finalize the PDF and send it
            doc.end();
        }
    } catch (error) {
        console.error('Error generating bill PDF:', error);
        res.status(500).send('Error generating bill PDF: ' + error.message);
    }
};