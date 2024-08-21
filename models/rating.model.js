import mongoose, { Schema } from "mongoose";

const ratingScehma = new mongoose.Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        orderId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        comments: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("ratings", ratingScehma);