import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// Get reviews for a product
const getReviews = async (req, res) => {
    try {
        const { productId } = req.body;
        const reviews = await reviewModel.find({ productId }).populate('userId', 'name').sort({ date: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add a review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.body.userId;

        const reviewData = {
            productId,
            userId,
            rating: Number(rating),
            comment,
            date: Date.now()
        };

        const review = new reviewModel(reviewData);
        await review.save();

        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getReviews, addReview };