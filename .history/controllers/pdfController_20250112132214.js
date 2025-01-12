const PDFDocument = require('pdfkit');

exports.generateBillPDF = (req, res) => {
    try {
        // अनुरोध बॉडी से डेटा निकालें
        const { customerName, orderId, items } = req.body;

        // इनपुट की वैधता जांचें
        if (!customerName || !orderId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'अमान्य इनपुट डेटा। कृपया ग्राहक का नाम, आदेश आईडी, और आइटम प्रदान करें।' });
        }

        // एक नया PDF दस्तावेज़ बनाएं
        const doc = new PDFDocument({ margin: 50 });

        // ब्राउज़र को PDF के रूप में पहचानने के लिए प्रतिक्रिया हेडर सेट करें
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="bill.pdf"');

        // PDF स्ट्रीम को प्रतिक्रिया में पाईप करें
        doc.pipe(res);

        // कंपनी का नाम और लोगो जोड़ें (आप इसे बाद में वास्तविक लोगो छवि से बदल सकते हैं)
        doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('Cozy Haven Enterprises', { align: 'center' })
            .moveDown(0.5);

        // कंपनी की संपर्क जानकारी जोड़ें
        doc
            .fontSize(12)
            .font('Helvetica')
            .text('456 Example Street, Bangalore, Karnataka, 560001', { align: 'center' })
            .text('Phone: +91-1234567890', { align: 'center' })
            .moveDown(2);

        // बिल जानकारी जोड़ें (आदेश आईडी, तिथि, ग्राहक का नाम)
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(`आदेश आईडी: ${orderId}`, 50)
            .text(`तिथि: ${new Date().toLocaleDateString()}`, 50)
            .text(`ग्राहक: ${customerName}`, 50)
            .moveDown(1);

        // आइटम की सूची के लिए तालिका शीर्षक जोड़ें
        const tableTop = doc.y;
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('आइटम', 50, tableTop)
            .text('मात्रा', 200, tableTop)
            .text('इकाई मूल्य', 300, tableTop, { width: 90, align: 'right' })
            .text('कुल', 400, tableTop, { width: 90, align: 'right' });

        // तालिका शीर्षक के नीचे रेखा जोड़ें
        doc
            .moveTo(50, tableTop + 20)
            .lineTo(500, tableTop + 20)
            .strokeColor('#000000')
            .stroke();

        // आइटम जोड़ें
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

        // आइटम की सूची के बाद रेखा जोड़ें
        doc
            .moveTo(50, currentY)
            .lineTo(500, currentY)
            .strokeColor('#000000')
            .stroke();

        // कुल राशि की गणना करें
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        // कुल राशि जोड़ें
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('कुल राशि', 300, currentY + 10, { width: 90, align: 'right' })
            .text(`₹ ${totalAmount.toFixed(2)}`, 400, currentY + 10, { width: 90, align: 'right' });

        // धन्यवाद संदेश जोड़ें
        doc
            .moveDown(2)
            .fontSize(10)
            .font('Helvetica')
            .fillColor('gray')
            .text('आपके व्यवसाय के लिए धन्यवाद!', { align: 'center' })
            .text('संपर्क के लिए: support@cozyhaven.com', { align: 'center' });

        // PDF को समाप्त करें और भेजें
        doc.end();
    } catch (error) {
        console.error('बिल PDF जनरेट करते समय त्रुटि:', error);
        res.status(500).send('बिल PDF जनरेट करते समय त्रुटि: ' + error.message);
    }
};
