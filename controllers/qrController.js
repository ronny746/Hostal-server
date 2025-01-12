const QRCode = require('qrcode');

/**
 * Controller to generate QR code for hostel details
 */
exports.generateHostelQRCode = async (req, res) => {
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

    // Generate QR code as a Data URL
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(hostelData));

    // Send the QR code as a response
    res.status(200).json({
      success: true,
      message: 'QR code generated successfully',
      qrCode: qrCodeImage,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
