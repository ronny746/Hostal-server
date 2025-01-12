const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

exports.generateBillPDF = async (req, res) => {
    try {
        const { customerName, invoiceNumber, items, companyDetails } = req.body;

        // Validate input
        if (!customerName || !invoiceNumber || !items || !Array.isArray(items) || items.length === 0 || !companyDetails) {
            return res.status(400).json({ error: 'Invalid input data. Please provide customer name, invoice number, items, and company details.' });
        }

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');

        doc.pipe(res);

        // Track the current y-coordinate for positioning text
        let currentY = 40;

        // Draw Border
        doc.rect(30, 30, 550, 750).strokeColor('#000000').lineWidth(1).stroke();

        // Add Logo at the Center
        if (companyDetails.logoPath) {
            try {
                const logoResponse = await axios.get(companyDetails.logoPath, { responseType: 'arraybuffer' });
                const logoBuffer = Buffer.from(logoResponse.data, 'base64');

                const logoWidth = 100; // Width for the logo
                const pageWidth = 595.28; // A4 page width in points
                const centerX = (pageWidth - logoWidth) / 2;

                doc.image(logoBuffer, centerX, currentY, { width: logoWidth });
                currentY += 80; // Adjust position below the logo
            } catch (error) {
                console.error('Error loading logo:', error.message);
                doc.fontSize(16).font('Helvetica-Bold').fillColor('#FF0000')
                    .text('[LOGO FAILED TO LOAD]', { align: 'center' });
                currentY += 40;
            }
        } else {
            // Placeholder if logo is missing
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#CCCCCC')
                .text('[NO LOGO PROVIDED]', { align: 'center' });
            currentY += 40;
        }

        // Add Company Details
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#333333')
            .text(companyDetails.name, { align: 'center' });
        currentY += 30;
        doc.fontSize(10).font('Helvetica').fillColor('#666666')
            .text(companyDetails.address, { align: 'center' })
            .text(`Phone: ${companyDetails.phone}`, { align: 'center' });
        currentY += 40;

        // Add Invoice Details
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text('Invoice Details:', 40, currentY);
        currentY += 20;
        doc.fontSize(10).font('Helvetica').fillColor('#444444')
            .text(`Invoice Number: ${invoiceNumber}`, 40, currentY)
            .text(`Date: ${new Date().toLocaleDateString()}`, 40, currentY + 15);
        currentY += 40;

        // Add Customer Info
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text('Billed To:', 40, currentY);
        currentY += 20;
        doc.fontSize(10).font('Helvetica').fillColor('#444444')
            .text(customerName, 40, currentY)
            .text('123 Your Street, Your City', 40, currentY + 15);
        currentY += 40;

        // Table Header
        doc.rect(40, currentY, 510, 20).fill('#f0f0f0').stroke();
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
            .text('Description', 50, currentY + 5)
            .text('Quantity', 250, currentY + 5, { align: 'center' })
            .text('Unit Price', 350, currentY + 5, { align: 'right' })
            .text('Total', 450, currentY + 5, { align: 'right' });
        currentY += 30;

        // Draw Items
        let subtotal = 0;
        items.forEach((item, index) => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;

            // Alternate row color
            if (index % 2 === 0) {
                doc.rect(40, currentY - 5, 510, 20).fill('#f9f9f9').stroke();
            }

            doc.fontSize(10).font('Helvetica').fillColor('#333333')
                .text(item.name, 50, currentY)
                .text(item.quantity, 250, currentY, { align: 'center' })
                .text(`₹ ${item.unitPrice.toFixed(2)}`, 350, currentY, { align: 'right' })
                .text(`₹ ${itemTotal.toFixed(2)}`, 450, currentY, { align: 'right' });
            currentY += 20;
        });

        // Add Totals Section
        currentY += 10;
        const tax = subtotal * 0.18; // Example: 18% GST
        const grandTotal = subtotal + tax;

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
            .text('Subtotal', 350, currentY, { align: 'right' })
            .text(`₹ ${subtotal.toFixed(2)}`, 450, currentY, { align: 'right' });
        currentY += 15;

        doc.text('Tax (18%)', 350, currentY, { align: 'right' })
            .text(`₹ ${tax.toFixed(2)}`, 450, currentY, { align: 'right' });
        currentY += 15;

        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text('Grand Total', 350, currentY, { align: 'right' })
            .text(`₹ ${grandTotal.toFixed(2)}`, 450, currentY, { align: 'right' });

        // Footer Section
        currentY += 50;
        doc.fontSize(10).font('Helvetica').fillColor('#777777')
            .text('Thank you for your business!', { align: 'center', baseline: 'bottom' })
            .text('For inquiries, contact: support@yourcompany.com', { align: 'center' });

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};
