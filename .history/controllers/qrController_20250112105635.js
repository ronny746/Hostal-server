const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Controller to generate and download a QR code for hostel details
 */
exports.downloadHostelQRCode = async (req, res) => {
  try {
    const { title, description, address, contact } = req.body;

    // Validate required fields
    if (!title || !description || !address || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, address, and contact.',
      });
    }

    // Prepare hostel data for QR code
    const hostelData = {
      title,
      description,
      address,
      contact,
    };

    // Define the file path for the QR code image
    const qrFilePath = path.join(__dirname, `../temp/${title.replace(/\s+/g, '_')}_QRCode.png`);

    // Generate QR code and save it as a file
    await QRCode.toFile(qrFilePath, JSON.stringify(hostelData));

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}_QRCode.png"`);
    res.setHeader('Content-Type', 'image/png');

    // Create a readable stream and pipe it to the response
    const fileStream = fs.createReadStream(qrFilePath);
    fileStream.pipe(res);

    // Clean up the file after sending the response
    fileStream.on('close', () => {
      fs.unlinkSync(qrFilePath); // Delete the file from the server
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
