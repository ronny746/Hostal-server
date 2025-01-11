
const Hostel = require('../models/hostel.model');
const Room = require('../models/room.model');
// Create Hostel
exports.createHostel = async (req, res) => {
    try {
        const hostel = new Hostel(req.body);
        await hostel.save();
        res.status(201).json({ 
            message: 'Hostel created successfully.', 
            hostel 
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to create hostel. Please check the input data.', 
            error: error.message 
        });
    }
};

// Get All Hostels
exports.getHostels = async (req, res) => {
    try {
        const filters = req.query;
        const hostels = await Hostel.find(filters).populate('host', 'name email');
        if (hostels.length === 0) {
            return res.status(404).json({ message: 'No hostels found.' });
        }
        res.status(200).json({ 
            message: 'Hostels retrieved successfully.', 
            hostels 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'An error occurred while fetching hostels.', 
            error: error.message 
        });
    }
};

// Update Hostel
exports.updateHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found.' });
        }
        res.status(200).json({ 
            message: 'Hostel updated successfully.', 
            hostel 
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to update hostel. Please check the input data.', 
            error: error.message 
        });
    }
};

// Delete Hostel
exports.deleteHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findByIdAndDelete(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found.' });
        }
        res.status(200).json({ 
            message: 'Hostel deleted successfully.' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'An error occurred while deleting the hostel.', 
            error: error.message 
        });
    }
};
// Search Hostels
// Search Hostels by Various Filters
exports.searchHostels = async (req, res) => {
    try {
        const filters = {};
        const { latitude, longitude, radius, minPrice, maxPrice, tags, facilities, address, city, smokingAllowed, petsAllowed } = req.query;

        // Location-based filter
        if (latitude && longitude && radius) {
            const radiusInRadians = radius / 6378.1; // Convert km to radians
            filters['location.coordinates'] = {
                $geoWithin: {
                    $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusInRadians],
                },
            };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filters['price.basePrice'] = {};
            if (minPrice) filters['price.basePrice'].$gte = parseFloat(minPrice);
            if (maxPrice) filters['price.basePrice'].$lte = parseFloat(maxPrice);
        }

        // Tag-based filter
        if (tags) {
            filters['tags'] = { $in: tags.split(',') };
        }

        // Facility-based filter
        if (facilities) {
            filters['facilities'] = { $all: facilities.split(',') };
        }

        // Address or city filter
        if (address) {
            filters['location.address'] = { $regex: address, $options: 'i' };
        }
        if (city) {
            filters['location.city'] = { $regex: city, $options: 'i' };
        }

        // Policy filters
        if (smokingAllowed !== undefined) {
            filters['policies.smokingAllowed'] = smokingAllowed === 'true';
        }
        if (petsAllowed !== undefined) {
            filters['policies.petsAllowed'] = petsAllowed === 'true';
        }

        // Execute the query
        const hostels = await Hostel.find(filters).populate('host', 'name email');

        if (hostels.length === 0) {
            return res.status(404).json({ message: 'No hostels found based on the search criteria.' });
        }

        res.status(200).json({
            message: 'Hostels retrieved successfully based on search criteria.',
            hostels,
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while searching for hostels.',
            error: error.message,
        });
    }
};

