import { createError, createSuccess } from '../utils/response-structure.js'
import ordersModel from "../models/orders/orders.model.js";
import orderHistoryModel from "../models/orders/orderHistory.model.js";
import orderItemsModel from "../models/orders/orderItems.model.js";
import productStocksModel from "../models/product-stocks.model.js";
import productsModel from "../models/products.model.js";
import mongoose from 'mongoose';

export const dashboardStats = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId;
        const objSellerId = new mongoose.Types.ObjectId(sellerId);
        const orderStats = await orderItemsModel.aggregate([
            {
                $match: { sellerId: sellerId }
            },
            {
                $group: { _id: null, totalOrderValue: { $sum: { $toDouble: '$orderTotal' } }, count: { $sum: 1 } }
            }
        ]);
        const productStats = await productsModel.find({ sellerId: sellerId }).countDocuments();
        const productStockStats = await productsModel.aggregate([
            { $match: { sellerId: objSellerId, isDeleted: false } },
            { $lookup: { from: 'product-stocks', localField: "availabilityStocks", foreignField: "_id", as: 'productStocks' } },
            { $unwind: '$productStocks' },
            { $match: { 'productStocks.addedStockNos': { $lte: 10 } } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ])
        const finalStats = {
            totalProducts: productStats,
            totalOrder: orderStats[0]?.count,
            totalOrderValue: orderStats[0]?.totalOrderValue,
            stocksOutage: productStockStats[0]?.count
        }
        return next(createSuccess(200, '', finalStats));
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}

export const orderStats = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId;
        const orderStats = await orderItemsModel.aggregate([
            { $match: { sellerId: sellerId } },
            { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
        ])

        const tempReport = [
            { _id: { month: 8, year: 2024 }, count: 5 },
            { _id: { month: 7, year: 2024 }, count: 12 },
            { _id: { month: 6, year: 2024 }, count: 17 },
            { _id: { month: 5, year: 2024 }, count: 12 },
            { _id: { month: 4, year: 2024 }, count: 4 }
        ];
        return next(createSuccess(200, '', tempReport))
    } catch (error) {
        return next(createError(500, 'Something went wrong!' + error));
    }
}