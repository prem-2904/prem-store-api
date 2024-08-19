import express from 'express'
import { calculateCouponValue, createCoupon, getCouponDetails } from '../controllers/offers.controller.js';
const offerRouter = express.Router();

offerRouter.post('/createCoupon', createCoupon);
offerRouter.get('/getCoupons/:sellerId', getCouponDetails);
offerRouter.post('/calculateCoupon', calculateCouponValue);

export default offerRouter;