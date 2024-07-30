import mongoose, { Schema } from "mongoose";

const orderStatusSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
            unique: true
        },
        statusText: {
            type: String,
            required: true,
        },
        statusComments: {
            type: String,
            required: true
        },
        statusOrder: {
            type: Number,
            required: true
        },
        returnStatus: {
            type: Boolean,
            required: true,
            default: false
        },
        isSellerAction: {
            type: Boolean,
            required: true,
            default: false
        },
        isWarehouseAction: {
            type: Boolean,
            required: true,
            default: false
        },
        isDeliveryPersonAction: {
            type: Boolean,
            required: true,
            default: false
        },
        isUserAction: {
            type: Boolean,
            required: true,
            default: false
        },
        isCancelStatus: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("order-status", orderStatusSchema);