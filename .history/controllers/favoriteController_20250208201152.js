const Favorite = require('../models/Favorite');

// ✅ Add Favorite Hostel (Token-Based)
exports.addFavorite = async (req, res) => {
    try {
        const { hostelId } = req.params; // Extract hostelId from URL
        const userId = req.user.id; // Extract user ID from token

        // Check if already in favorites
        const existingFav = await Favorite.findOne({ user: userId, hostel: hostelId });
        if (existingFav) {
            return res.status(400).json({ message: 'Hostel already in favorites' });
        }

        // Add to favorites
        const favorite = new Favorite({ user: userId, hostel: hostelId });
        await favorite.save();

        res.status(201).json({ message: 'Hostel added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to favorites', error: error.message });
    }
};

// ✅ Remove Favorite Hostel
exports.removeFavorite = async (req, res) => {
    try {
        const { hostelId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOneAndDelete({ user: userId, hostel: hostelId });

        if (!favorite) {
            return res.status(404).json({ message: 'Hostel not found in favorites' });
        }

        res.status(200).json({ message: 'Hostel removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
};

// ✅ Get All Favorite Hostels for User
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await Favorite.find({ user: userId }).populate({
            path: 'User',
            select: 'name location price images' // Select specific fields
        });

        res.status(200).json({ message: 'Favorites retrieved successfully', favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
    }
};
