const Hostel = require('../models/hostel.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Favorite = require('../models/Favorite');
// Create Hostel
exports.createHostel = async (req, res) => {
    try {
        const predefinedRules = [
            { title: 'Check-In and Check-Out Timing', description: 'Guests must check in between 12:00 PM and 10:00 PM and check out by 11:00 AM. Early or late requests are subject to availability.' },
            { title: 'Cleanliness', description: 'Keep your room and shared spaces clean. Dispose of trash responsibly and avoid leaving personal items unattended.' },
            { title: 'Quiet Hours', description: "Maintain silence in dorms and common areas from 10:00 PM to 7:00 AM to respect other guests' comfort." }
        ];

        // Extract rules along with roomDetails and hostelData
        const { roomDetails, rules = [], ...hostelData } = req.body;

        // Merge predefined rules with provided rules (removing duplicates)
        const mergedRules = [...predefinedRules, ...rules.filter(rule =>
            !predefinedRules.some(preRule => preRule.title === rule.title)
        )];

         // Validate required fields
         if (!hostelData.title || !hostelData.hostelType || !hostelData.guestType || !hostelData.roomIn) {
            return res.status(400).json({ message: "Missing required fields: title, hostelType, guestType, or roomIn." });
        }

        const user = await User.findById(hostelData.host);
        if (!user || !user.isHost) {
            return res.status(403).json({
                message: 'Access denied. Only hosts can create hostels.',
            });
        }
        // Create hostel
        const hostel = await Hostel.create({
            ...hostelData,
            rules: mergedRules,
        });

        // If roomDetails exist, associate rooms with the hostel
        if (Array.isArray(roomDetails) && roomDetails.length > 0) {
            const roomData = roomDetails.map((room) => ({
                ...room,
                hostal: hostel._id,
            }));
            await Room.insertMany(roomData);
        }

        // Respond with required hostel details
        res.status(201).json({
            message: 'Hostel created successfully.',
            hostel: {
                ...hostel.toObject(),
                rules: mergedRules.map(({ title, description }) => ({ title, description })), // Remove _id from rules
            }
        });

    } catch (error) {
          console.error("Error creating hostel:", error);
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: error.message,
        });
    }
};

// Get All Hostels 
// exports.getHostels = async (req, res) => {
//     try {
//         const filters = {};

//         // Dynamically add filters based on request query
//         Object.keys(req.query).forEach((key) => {
//             if (req.query[key] !== undefined) {
//                 let value = req.query[key];

//                 // Convert boolean strings to actual boolean values
//                 if (value === 'true') value = true;
//                 if (value === 'false') value = false;

//                 filters[key] = value;
//             }
//         });

//         // Fetch hostels based on filters
//         const hostels = await Hostel.find(filters).populate('host', 'name phone email');

//         if (!hostels.length) {
//             return res.status(404).json({ message: 'No hostels found.' });
//         }

//         // Check if user is authenticated (token exists)
//         if (!req.user) {
//             return res.status(200).json({
//                 message: 'Hostels retrieved successfully.',
//                 hostels // No isFavorite flag for guests
//             });
//         }

//         const userId = req.user.id;

//         // Get user's favorite hostels
//         const favoriteHostels = await Favorite.find({ user: userId }).select('hostel');
//         const favoriteHostelIds = favoriteHostels.map(fav => fav.hostel.toString());

//         // Add isFavorite flag to hostels
//         const hostelsWithFavorites = hostels.map(hostel => ({
//             ...hostel.toObject(),
//             favorite: favoriteHostelIds.includes(hostel._id.toString())
//         }));

//         res.status(200).json({
//             message: 'Hostels retrieved successfully.',
//             hostels: hostelsWithFavorites
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while fetching hostels.',
//             error: error.message
//         });
//     }
// };

exports.getHostels = async (req, res) => {
    try {
        const filters = {};

        // Allowed filter fields (matching schema exactly)
        const allowedFilters = {
            ac: ['true', 'false', 'Both'],
            mess: 'boolean',
            laundry: 'boolean',
            gym: 'boolean',
            city: 'string',
            state: 'string',
            hostelType: ['Hostel', 'PG', 'Guest House', 'House', '1 RK', '1 BHK', '2 BHK', '3 BHK', 'Resort'],
            onlyFor: ['Male', 'Female', 'Both'],
            guestType: ['Students', 'Family', 'Corporate Visitors', 'Stay for all'],
            smokingZone: 'boolean', // Corrected from smokingAllowed
            petsAllowed: 'boolean',
            purpose: 'string'
        };

        // Apply filters dynamically based on allowed fields
        Object.keys(req.query).forEach((key) => {
            if (allowedFilters[key]) {
                let value = req.query[key];

                // Convert boolean strings to actual boolean values
                if (allowedFilters[key] === 'boolean') {
                    value = value === 'true';
                }

                // Handle AC filtering logic
                if (key === 'ac') {
                    if (value === true) {
                        filters[key] = { $in: ['AC', 'Both'] };
                    } else if (value === false) {
                        filters[key] = { $eq: 'Non AC' };
                    }
                } else {
                    // Validate enum values
                    if (Array.isArray(allowedFilters[key]) && !allowedFilters[key].includes(value)) {
                        return res.status(400).json({ message: `Invalid value '${value}' for filter '${key}'. Allowed: ${allowedFilters[key].join(', ')}` });
                    }
                    filters[key] = value;
                }
            } else {
                console.warn(`Unsupported filter key: ${key}`); // Log unexpected keys
            }
        });

        let hostelsQuery = Hostel.find(filters).populate('host', 'name phone email position aboutMe profilePic');

        // Check if occupancy (roomType) filter is provided
        if (req.query.occupancy) {
            const roomTypeFilter = req.query.occupancy;

            // Find hostels that have rooms matching the roomType
            const matchingRooms = await Room.find({ roomType: roomTypeFilter }).select('hostal');

            if (matchingRooms.length === 0) {
                return res.status(404).json({ message: 'No hostels found with the given room type.' });
            }

            // Extract unique hostel IDs from matching rooms
            const hostelIds = matchingRooms.map(room => room.hostal.toString());

            // Modify the hostel query to filter based on found hostel IDs
            hostelsQuery = hostelsQuery.where('_id').in(hostelIds);
        }

        const hostels = await hostelsQuery;

        if (!hostels.length) {
            return res.status(404).json({ message: 'No hostels found.' });
        }

        // Check if user is authenticated (token exists)
        if (!req.user) {
            return res.status(200).json({
                message: 'Hostels retrieved successfully.',
                hostels // No isFavorite flag for guests
            });
        }

        const userId = req.user.id;

        // Get user's favorite hostels
        const favoriteHostels = await Favorite.find({ user: userId }).select('hostel');
        const favoriteHostelIds = favoriteHostels.map(fav => fav.hostel.toString());

        // Add isFavorite flag to hostels
        const hostelsWithFavorites = hostels.map(hostel => ({
            ...hostel.toObject(),
            favorite: favoriteHostelIds.includes(hostel._id.toString())
        }));

        res.status(200).json({
            message: 'Hostels retrieved successfully.',
            hostels: hostelsWithFavorites
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching hostels.',
            error: error.message
        });
    }
};

exports.getHostListings = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find hostels where the `addedBy` field matches userId
        const hostels = await Hostel.find({ host: userId });

        if (!hostels.length) {
            return res.status(404).json({ message: 'No hostels found for this user.' });
        }

        res.status(200).json({
            message: 'Hostels retrieved successfully.',
            hostels
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve hostels.',
            error: error.message
        });
    }
};

exports.getBookingsForHost = async (req, res) => {
    try {
        const { hostId } = req.params;

        // Find all hostels added by the host
        const hostels = await Hostel.find({ host: hostId });

        if (!hostels.length) {
            return res.status(404).json({ message: 'No hostels found for this host.' });
        }

        const hostelIds = hostels.map(hostel => hostel._id);

        // Find all bookings for these hostels
        const bookings = await Booking.find({ hostel: { $in: hostelIds } })
            .populate('user', 'name email')  // Populate user details
            .populate('hostel', 'title host ')  // Populate hostel details
            .populate('rooms.room', 'roomType ratePerDay');  // Populate room details

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for the host.' });
        }

        res.status(200).json({
            message: 'Bookings retrieved successfully.',
            bookings
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve bookings.',
            error: error.message
        });
    }
};

// // Update Hostel
// exports.updateHostel = async (req, res) => {
//     try {
//         const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { 
//             new: true, 
//             runValidators: true, 
//         }); // Ensure validation on update

//         if (!hostel) {
//             return res.status(404).json({ message: 'Hostel not found.' });
//         }

//         res.status(200).json({
//             message: 'Hostel updated successfully.',
//             hostel,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: 'Failed to update hostel. Please check the input data.',
//             error: error.message,
//         });
//     }
// };

exports.updateHostel = async (req, res) => {
    try {
        // Destructure hostel ID from the request parameters
        const { hostelId } = req.params;

        const predefinedRules = [
            { title: 'Check-In and Check-Out Timing', description: 'Guests must check in between 12:00 PM and 10:00 PM and check out by 11:00 AM. Early or late requests are subject to availability.' },
            { title: 'Cleanliness', description: ' Keep your room and shared spaces clean. Dispose of trash responsibly and avoid leaving personal items unattended.' },
            { title: 'Quiet Hours', description: "Maintain silence in dorms and common areas from 10:00 PM to 7:00 AM to respect other guest's comfort." }
        ];
        // Destructure `roomDetails` and other hostel-related data from the request body
        const { roomDetails, rules = [], ...hostelData } = req.body;

        // Fetch existing hostel data
        const existingHostel = await Hostel.findById(hostelId);
        if (!existingHostel) {
            return res.status(404).json({
                message: 'Hostel not found. Please check the hostel ID.',
            });
        }

        // Ensure predefined rules are retained
        const mergedRules = [
            ...predefinedRules,
            ...rules.filter(rule => !predefinedRules.some(preRule => preRule.title === rule.title))
        ];

        // Update the hostel with the merged rules
        const updatedHostel = await Hostel.findByIdAndUpdate(
            hostelId,
            { ...hostelData, rules: mergedRules },
            { new: true } // Return the updated document
        );

        // Handle room updates if `roomDetails` is provided
        if (roomDetails && Array.isArray(roomDetails)) {
            for (const room of roomDetails) {
                if (room._id) {
                    // If the room has an `_id`, update the existing room
                    await Room.findByIdAndUpdate(
                        room._id,
                        { ...room, hostal: hostelId },
                        { new: true }
                    );
                } else {
                    // If the room does not have an `_id`, create a new room
                    await Room.create({ ...room, hostal: hostelId });
                }
            }
        }


        // Return a success response
        res.status(200).json({
            message: 'Hostel and rooms updated successfully.',
            hostel: updatedHostel,
        });
    } catch (error) {
        // Catch and return any errors
        res.status(400).json({
            message: 'Failed to update hostel. Please check the input data.',
            error: error.message,
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
            error: error.message,
        });
    }
};

// Search Hostels
exports.searchHostels = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius,
            minPrice,
            maxPrice,
            tags,
            facilities,
            address,
            city,
            smokingAllowed,
            petsAllowed,
        } = req.query;

        const filters = {};

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
            filters['price.basePrice'] = {
                ...(minPrice && { $gte: parseFloat(minPrice) }),
                ...(maxPrice && { $lte: parseFloat(maxPrice) }),
            };
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
            filters['address'] = { $regex: address, $options: 'i' };
        }
        if (city) {
            filters['city'] = { $regex: city, $options: 'i' };
        }

        // Policy filters
        if (smokingAllowed !== undefined) {
            filters['smokingZone'] = smokingAllowed === 'true';
        }
        if (petsAllowed !== undefined) {
            filters['petsAllowed'] = petsAllowed === 'true';
        }

        // Fetch hostels based on filters
        const hostels = await Hostel.find(filters).populate('host', 'name email');

        if (!hostels.length) {
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
