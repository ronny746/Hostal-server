const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

exports.generateBillPDF = (req, res) => {
    try {
        const { customerName, invoiceNumber, items, companyDetails } = req.body;

        // Validate input
        if (!customerName || !invoiceNumber || !items || !Array.isArray(items) || items.length === 0 || !companyDetails) {
            return res.status(400).json({ error: 'Invalid input data. Please provide customer name, invoice number, items, and company details.' });
        }

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 40 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');

        doc.pipe(res);

        // Add Border
        doc
            .rect(30, 30, 550, 750)
            .strokeColor('#000')
            .lineWidth(1)
            .stroke();

        // Add Logo
        if (companyDetails.logoPath) {
            axios({ url: companyDetails.logoPath, responseType: 'stream' }).then(response => {
                const logoPath = 'temp-logo.png';
                const stream = fs.createWriteStream(logoPath);
                response.data.pipe(stream);
                stream.on('finish', () => {
                    doc.image(logoPath, 40, 40, { width: 100 });
                    fs.unlinkSync(logoPath);

                    // Add Company Details
                    doc.fontSize(20).font('Helvetica-Bold').text(companyDetails.name, 150, 50, { align: 'left' });
                    doc.fontSize(10).font('Helvetica')
                        .text(companyDetails.address, 150, 80, { align: 'left' })
                        .text(`Phone: ${companyDetails.phone}`, 150, 100, { align: 'left' })
                        .moveDown(2);

                    // Add Invoice Details
                    doc.fontSize(12).font('Helvetica-Bold').text('Invoice Details:', 40, 140);
                    doc.fontSize(10).font('Helvetica')
                        .text(`Invoice Number: ${invoiceNumber}`, 40, 160)
                        .text(`Date: ${new Date().toLocaleDateString()}`, 40, 180);

                    // Add Customer Info
                    doc.fontSize(12).font('Helvetica-Bold').text('Billed To:', 40, 210);
                    doc.fontSize(10).font('Helvetica')
                        .text(customerName, 40, 230)
                        .text('123 Your Street, Your City', 40, 250);

                    // Add Table Header
                    const tableTop = 280;
                    doc.rect(40, tableTop, 510, 20).fill('#f3f3f3').stroke();
                    doc.fontSize(10).font('Helvetica-Bold')
                        .text('Description', 50, tableTop + 5)
                        .text('Quantity', 250, tableTop + 5, { align: 'center' })
                        .text('Unit Price', 350, tableTop + 5, { align: 'right' })
                        .text('Total', 450, tableTop + 5, { align: 'right' });

                    // Draw Items
                    let currentY = tableTop + 30;
                    let subtotal = 0;
                    items.forEach(item => {
                        const total = item.quantity * item.unitPrice;
                        subtotal += total;
                        doc.fontSize(10).font('Helvetica')
                            .text(item.name, 50, currentY)
                            .text(item.quantity, 250, currentY, { align: 'center' })
                            .text(`₹ ${item.unitPrice.toFixed(2)}`, 350, currentY, { align: 'right' })
                            .text(`₹ ${total.toFixed(2)}`, 450, currentY, { align: 'right' });
                        currentY += 20;
                    });

                    // Add Total Section
                    const tax = subtotal * 0.18; // Example: 18% GST
                    const grandTotal = subtotal + tax;
                    currentY += 10;
                    doc.fontSize(10).font('Helvetica-Bold')
                        .text('Subtotal', 350, currentY, { align: 'right' })
                        .text(`₹ ${subtotal.toFixed(2)}`, 450, currentY, { align: 'right' });
                    currentY += 15;
                    doc.text('Tax (18%)', 350, currentY, { align: 'right' })
                        .text(`₹ ${tax.toFixed(2)}`, 450, currentY, { align: 'right' });
                    currentY += 15;
                    doc.fontSize(12).font('Helvetica-Bold')
                        .text('Grand Total', 350, currentY, { align: 'right' })
                        .text(`₹ ${grandTotal.toFixed(2)}`, 450, currentY, { align: 'right' });

                    // Footer
                    doc.fontSize(10).font('Helvetica').fillColor('#555').moveDown(5)
                        .text('Thank you for your business!', { align: 'center' })
                        .text('For inquiries, contact: support@yourcompany.com', { align: 'center' });

                    doc.end();
                });
            }).catch(error => {
                console.error('Error loading logo:', error);
                res.status(500).send('Error loading logo');
            });
        } else {
            // If no logo, skip directly
            doc.fontSize(20).font('Helvetica-Bold').text(companyDetails.name, 40, 50);
            doc.end();
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};
