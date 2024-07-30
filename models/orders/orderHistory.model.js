import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        orderStatus: {
            type: String,
            required: true,
            ref: "order-status"
        },
        statusUpdatePlace: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("order-history", orderHistorySchema);