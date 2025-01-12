const PDFDocument = require('pdfkit');

exports.generateHostelPDF = (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for the browser to recognize as a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="hostel-details.pdf"');

    // Pipe the PDF stream to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Hostel Details', { align: 'center' });
    doc.moveDown();

    const hostelDetails = [
      { key: 'Name', value: 'Cozy Haven - Bangalore' },
      { key: 'Type', value: 'Professional' },
      { key: 'Guest Type', value: 'Students' },
      { key: 'AC', value: 'No' },
      { key: 'Mess Facility', value: 'Yes' },
    ];

    hostelDetails.forEach((detail) => {
      doc.fontSize(14).text(`${detail.key}: ${detail.value}`);
    });

    doc.moveDown();

    // Finalize the PDF and send it
    doc.end();
  } catch (error) {
    res.status(500).send('Error generating PDF: ' + error.message);
  }
};
