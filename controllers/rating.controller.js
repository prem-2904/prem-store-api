import mongoose from "mongoose";
import ratingModel from "../models/rating.model.js";
import { createError, createSuccess } from "../utils/response-structure.js"

export const addRating = async (req, res, next) => {
    try {
        const payload = req.body;
        const rating = new ratingModel({
            productId: payload.productId,
            rating: payload.rating,
            comments: payload.comments,
            orderId: payload.orderId,
            isDeleted: false,
            userId: payload.userId
        });

        await rating.save();
        return next(createSuccess(201, 'Your rating added!'));
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}

export const calculateAvg = async (productId) => {
    const ObjectId = mongoose.Types.ObjectId;
    const avg = await ratingModel.aggregate([
        {
            $match: { productId: new ObjectId(productId) }
        },
        {
            $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } }
        }
    ]);
    let updatedAvg = {};
    if (avg && avg.length) {
        updatedAvg = { totalReviews: avg[0].count, avgRating: avg[0].avgRating.toFixed(1) }
    } else {
        updatedAvg = { totalReviews: 0, avgRating: 0 }
    }
    return updatedAvg;
}


export const ratingsBasedOrderId = async (req, res, next) => {
    try {
        const ratings = await ratingModel.find({ orderId: req.params.oid }).select('rating comments');
        return next(createSuccess(200, '', ratings));
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error))
    }
}

export const sellerRating = async (req, res, next) => {
    try {
        const avgSeller = await ratingModel.aggregate([
            {
                $lookup: {
                    from: 'products',
                    foreignField: '_id',
                    localField: 'productId',
                    as: 'products'
                }
            },
            {
                $match: { sellerId: req.params.sid }
            },
            {
                $group: { _id: '$products.sellerId', avgRating: { $avg: "$rating" }, count: { $sum: 1 } }
            }
        ]);
        let updatedAvg = {};
        if (avgSeller && avgSeller.length) {
            updatedAvg = { totalReviews: avgSeller[0].count, avgRating: avgSeller[0].avgRating.toFixed(1) }
        } else {
            updatedAvg = { totalReviews: 0, avgRating: 0 }
        }
        return next(createSuccess(200, '', updatedAvg))
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}

export const calculateAvgRating = async (req, res, next) => {
    try {
        const productId = req.params.pid;
        const avg = await calculateAvg(productId);
        return next(createSuccess(200, '', avg));
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}