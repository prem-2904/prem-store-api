import express from 'express';
import { addRating, calculateAvgRating, ratingsBasedOrderId } from '../controllers/rating.controller.js';

const ratingRoutes = express.Router();

ratingRoutes.post('/addrating', addRating);

ratingRoutes.get('/getrating/:pid', calculateAvgRating);

ratingRoutes.get('/getOrdersRating/:oid', ratingsBasedOrderId);

export default ratingRoutes;