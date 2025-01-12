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

        // Draw Border
        doc
            .rect(30, 30, 550, 780)
            .strokeColor('#000000')
            .lineWidth(1)
            .stroke();

        // Add Company Logo
        if (companyDetails.logoPath) {
            const logoResponse = await axios.get(companyDetails.logoPath, { responseType: 'arraybuffer' });
            const logoBuffer = Buffer.from(logoResponse.data, 'base64');
            doc.image(logoBuffer, 40, 40, { width: 100 });
        }

        // Add Company Details
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#333333')
            .text(companyDetails.name, 150, 40, { align: 'left' });
        doc.fontSize(10).font('Helvetica').fillColor('#666666')
            .text(companyDetails.address, 150, 70, { align: 'left' })
            .text(`Phone: ${companyDetails.phone}`, 150, 85, { align: 'left' });

        // Add Invoice Details
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text('Invoice Details:', 40, 130);
        doc.fontSize(10).font('Helvetica').fillColor('#444444')
            .text(`Invoice Number: ${invoiceNumber}`, 40, 150)
            .text(`Date: ${new Date().toLocaleDateString()}`, 40, 165);

        // Add Customer Info
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text('Billed To:', 40, 200);
        doc.fontSize(10).font('Helvetica').fillColor('#444444')
            .text(customerName, 40, 220)
            .text('123 Your Street, Your City', 40, 235);

        // Table Header
        const tableTop = 270;
        doc.rect(40, tableTop, 510, 20).fill('#f0f0f0').stroke();
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
            .text('Description', 50, tableTop + 5)
            .text('Quantity', 250, tableTop + 5, { align: 'center' })
            .text('Unit Price', 350, tableTop + 5, { align: 'right' })
            .text('Total', 450, tableTop + 5, { align: 'right' });

        // Draw Items
        let currentY = tableTop + 30;
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
        const tax = subtotal * 0.18; // Example: 18% GST
        const grandTotal = subtotal + tax;

        currentY += 10;
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
        doc.fontSize(10).font('Helvetica').fillColor('#777777')
            .moveDown(4)
            .text('Thank you for your business!', { align: 'center' })
            .text('For inquiries, contact: support@yourcompany.com', { align: 'center' });

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};
