import mongoose, { Schema } from "mongoose";

const orderItemsSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            ref: 'orders'
        },
        orderItem: {
            type: String,
            ref: "products",
            required: true
        },
        orderStockId: {
            type: String,
            ref: "product-stocks",
            required: true
        },
        orderedQuantity: {
            type: Number,
            required: true
        },
        orderItemPrice: {
            type: String,
            required: true
        },
        orderTotal: {
            type: String,
            required: true
        },
        orderStatus: {
            type: String,
            ref: "order-status",
            required: true
        },
        sellerId: {
            type: String,
            ref: "sellers",
            required: true
        },
        isOrderCompleted: {
            type: Boolean,
            default: false,
            required: true
        },
        isReturned: {
            type: Boolean,
            default: false,
            required: true
        },
        isCancelled: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('order-items', orderItemsSchema);
