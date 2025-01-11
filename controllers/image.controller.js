const multer = require('multer');
const ImageKit = require('imagekit');

// Configure ImageKit
const imagekit = new ImageKit({
    publicKey: "public_K8S/Lhh2WHGSLSj59jQ9lPPLSBw=",
    privateKey: "private_vhNSf+Re+o39wKE+zlE6YwawANQ=",
    urlEndpoint: "https://ik.imagekit.io/3jx45fxvj"
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
});

// Middleware to handle file upload
exports.uploadMiddleware = upload.single('image');

// Upload Image to ImageKit
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided." });
        }

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        const response = await imagekit.upload({
            file: fileBuffer, // Buffer from multer
            fileName: fileName || `uploaded-image-${Date.now()}`,
            folder: "/uploads",
        });

        res.status(201).json({
            message: "Image uploaded successfully.",
            imageUrl: response.url,
            fileId: response.fileId,
        });
    } catch (error) {
        console.error("Image upload failed:", error);
        res.status(500).json({ 
            message: "Image upload failed.", 
            error: error.message 
        });
    }
};
