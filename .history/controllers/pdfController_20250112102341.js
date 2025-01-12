const PDFDocument = require('pdfkit');

exports.generateHostelPDF = (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 40 });

    // Set response headers for the browser to recognize as a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="hostel-details.pdf"');

    // Pipe the PDF stream to the response
    doc.pipe(res);

    // Header Section
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Hostel Details', { align: 'center' })
      .moveDown(1);

    // Add a horizontal line below the title
    doc
      .moveTo(40, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#000000')
      .stroke()
      .moveDown(1);

    // Hostel Details Data
    const hostelDetails = [
      { key: 'Name', value: 'Cozy Haven - Bangalore' },
      { key: 'Type', value: 'Professional' },
      { key: 'Guest Type', value: 'Students' },
      { key: 'AC', value: 'No' },
      { key: 'Mess Facility', value: 'Yes' },
      { key: 'Laundry', value: 'Yes' },
      { key: 'Gym', value: 'Yes' },
    ];

    // Styling for Key-Value Pairs
    doc.fontSize(14).font('Helvetica');
    hostelDetails.forEach((detail, index) => {
      doc
        .text(`${detail.key}:`, 50, doc.y, { continued: true })
        .font('Helvetica-Bold')
        .text(detail.value)
        .font('Helvetica');

      // Add spacing between entries
      if (index < hostelDetails.length - 1) {
        doc.moveDown(0.5);
      }
    });

    // Add footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Generated on: ' + new Date().toLocaleDateString(), {
        align: 'right',
      });

    // Finalize the PDF and send it
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF: ' + error.message);
  }
};
