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

        // Add Company Logo (Top-Right)
        if (companyDetails.logoPath) {
            try {
                const logoResponse = await axios.get(companyDetails.logoPath, { responseType: 'arraybuffer' });
                const logoBuffer = Buffer.from(logoResponse.data, 'base64');
        
                const logoWidth = 100; // Desired width for the logo
                const logoHeight = 100; // Adjust as needed
                const pageWidth = 595.28; // A4 page width in points
        
                const topRightX = pageWidth - logoWidth - 20; // Right margin of 20
                const topY = 40; // Same Y position as the start of the page
        
                // Position the logo at the top-right corner
                doc.image(logoBuffer, topRightX, topY, { width: logoWidth, height: logoHeight });
            } catch (error) {
                console.error('Error loading logo:', error.message);
                doc.fontSize(16).font('Helvetica-Bold').fillColor('#FF0000')
                    .text('[LOGO FAILED TO LOAD]', { align: 'center', valign: 'center' });
            }
        } else {
            const pageWidth = 595.28;
            const placeholderWidth = 200;
        
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#CCCCCC')
                .text('[NO LOGO PROVIDED]', (pageWidth - placeholderWidth) / 2, 100, { align: 'center' });
        }

        // Company Details
        doc.fontSize(18).font('Helvetica-Bold').text(companyDetails.name, { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(companyDetails.address, { align: 'center' });
        doc.text(`Phone: ${companyDetails.phone}`, { align: 'center' });
        currentY += 80;

        // Invoice Title
        doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', 30, currentY, { align: 'center' });
        currentY += 40;

        // Customer and Invoice Details
        doc.fontSize(10).font('Helvetica').text(`Invoice Number: ${invoiceNumber}`, 50, currentY);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, currentY);
        currentY += 20;
        doc.text(`Customer Name: ${customerName}`, 50, currentY);
        currentY += 40;

        // Table Header
        const tableHeaderY = currentY;
        doc.rect(40, tableHeaderY, 510, 20).fill('#f0f0f0').stroke();
        doc.fillColor('#000000')
            .fontSize(10)
            .text('S.No', 50, tableHeaderY + 5)
            .text('Item Name', 100, tableHeaderY + 5)
            .text('Quantity', 300, tableHeaderY + 5, { align: 'center' })
            .text('Unit Price', 400, tableHeaderY + 5, { align: 'center' })
            .text('Total', 500, tableHeaderY + 5, { align: 'right' });

        currentY += 30;

        // Add Items to Table
        let subtotal = 0;
        items.forEach((item, index) => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;

            doc.fontSize(10).fillColor('#333333')
                .text(index + 1, 50, currentY)
                .text(item.name, 100, currentY)
                .text(item.quantity, 300, currentY, { align: 'center' })
                .text(`₹${item.unitPrice.toFixed(2)}`, 400, currentY, { align: 'center' })
                .text(`₹${itemTotal.toFixed(2)}`, 500, currentY, { align: 'right' });
            currentY += 20;
        });

        // Subtotal, Tax, and Grand Total
        currentY += 20;
        const tax = subtotal * 0.18; // Example: 18% GST
        const grandTotal = subtotal + tax;

        doc.fontSize(10).font('Helvetica-Bold').text('Subtotal', 400, currentY, { align: 'center' });
        doc.text(`₹${subtotal.toFixed(2)}`, 500, currentY, { align: 'right' });
        currentY += 20;

        doc.fontSize(10).text('Tax (18%)', 400, currentY, { align: 'center' });
        doc.text(`₹${tax.toFixed(2)}`, 500, currentY, { align: 'right' });
        currentY += 20;

        doc.fontSize(12).font('Helvetica-Bold').text('Grand Total', 400, currentY, { align: 'center' });
        doc.text(`₹${grandTotal.toFixed(2)}`, 500, currentY, { align: 'right' });

        // Footer (Thank you message at the bottom-center)
        currentY = 841.89 - 40; // Bottom of the page (A4 height - margin)
        doc.fontSize(10).font('Helvetica').fillColor('#777777')
            .text('Thank you for your business!', 295.28, currentY, { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};
