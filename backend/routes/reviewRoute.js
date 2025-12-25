import express from 'express';
import { getReviews, addReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/get', getReviews);
reviewRouter.post('/add', authUser, addReview);

export default reviewRouter;