const ImageKit = require("imagekit");

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: "public_K8S/Lhh2WHGSLSj59jQ9lPPLSBw=",
    privateKey: "private_vhNSf+Re+o******************",
    urlEndpoint: "https://ik.imagekit.io/3jx45fxvj"
});

// Upload Image
exports.uploadImage = async (req, res) => {
    try {
        const { image, fileName } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Image file (Base64) is required." });
        }

        const response = await imagekit.upload({
            file: image, // Base64 string or file path
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
