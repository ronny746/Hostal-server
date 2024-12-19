const Hostel = require('../models/hostel.model');

const User = require('../models/user.model'); // Path to your User model

exports.addReview = async (req, res) => {
    try {
        const { hostelId } = req.params; // Hostel ID
        const { userId, rating, comment } = req.body; // Review details

        // Validate required fields
        if (!userId || !rating) {
            return res.status(400).json({ message: "User ID and rating are required." });
        }

        // Find the hostel by ID
        const hostel = await Hostel.findByIdAndUpdate(hostelId);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found." });
        }

        const user = await User.findByIdAndUpdate(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Check if user already reviewed the hostel
        const existingReview = hostel.reviews.find((review) => review.user.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: "User has already reviewed this hostel." });
        }

        // Create new review object
        const newReview = {
            user: userId,
            rating,
            comment,
        };

        // Add the review to the hostel
        hostel.reviews.push(newReview);

        // Update the average rating and reviews count
        const totalRatings = hostel.reviews.reduce((sum, review) => sum + review.rating, 0);
        hostel.ratings = totalRatings / hostel.reviews.length;
        hostel.reviewsCount = hostel.reviews.length;

        // Save the updated hostel
        await hostel.save();

        res.status(201).json({
            message: "Review added successfully.",
            hostel,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while adding the review.",
            error: error.message,
        });
    }
};



exports.getReviews = async (req, res) => {
    try {
        const { hostelId } = req.params;

        // Find hostel and populate reviews with user details (optional)
        const hostel = await Hostel.findById(hostelId).populate('reviews.user');


        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found.' });
        }

        res.status(200).json({
            reviews: hostel.reviews,
            ratings: hostel.ratings,
            reviewsCount: hostel.reviewsCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews.', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { hostelId, reviewId } = req.params;

        // Find the hostel
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found.' });
        }

        // Find the review to delete
        const reviewIndex = hostel.reviews.findIndex(
            (review) => review._id.toString() === reviewId
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Remove the review
        hostel.reviews.splice(reviewIndex, 1);

        // Update reviews count and average rating
        hostel.reviewsCount = hostel.reviews.length;
        const totalRating = hostel.reviews.reduce((sum, review) => sum + review.rating, 0);
        hostel.ratings = hostel.reviewsCount > 0
            ? (totalRating / hostel.reviewsCount).toFixed(1)
            : 0;

        // Save the updated hostel
        await hostel.save();

        res.status(200).json({
            message: 'Review deleted successfully.',
            ratings: hostel.ratings,
            reviewsCount: hostel.reviewsCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete review.', error: error.message });
    }
};

