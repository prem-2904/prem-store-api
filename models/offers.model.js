import mongoose, { Mongoose, Schema } from "mongoose";

const offerSchema = new Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
            required: true
        },
        sellerId: {
            type: mongoose.Types.ObjectId,
            ref: "sellers",
            required: true
        },
        couponName: {
            type: String,
            required: true
        },
        couponCode: {
            type: String,
            required: true
        },
        //flat amount, percentage
        couponOfferType: {
            type: String,
            required: true
        },
        couponValue: {
            type: String,
            required: true
        },
        couponTerms: {
            type: String,
            required: true
        },
        minPurchase: {
            type: Number,
            required: true,
            default: 0
        },
        dateOfExpiry: {
            type: Date,
            required: true
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

export default mongoose.model("offers", offerSchema);