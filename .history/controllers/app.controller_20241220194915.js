exports.getAppDetails = async (req, res) => {
    try {
        const appDetails = {
            appName: "Hostalio",
            version: "1.0.0",
            developer: {
                name: "Rohit Rana",
                email: "rana@example.com",
                website: "https://yourwebsite.com"
            },
            releaseDate: "2025-12-07",
            description: "all essential features for bookings, hostels, and user management."
        };

        res.status(200).json(appDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};