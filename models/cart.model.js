import mongoose, { Schema } from "mongoose";

export const addToCartSchema = new mongoose.Schema(
    {
        userId: {
            type: [Schema.Types.ObjectId],
            ref: 'users',
            required: true,
        },
        itemId: {
            type: String,
            ref: 'products'
        },
        addedToCart: {
            type: Boolean,
            required: true
        },
        quantity: {
            type: String,
            required: true,
            default: 1
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// addToCartSchema.virtual('itemstockavailability', {
//     ref: 'itemStocks',
//     localField: 'itemId',
//     foreignField: 'itemId',
//     //  count: true, // only we'll get no.of counts
//     select: 'stocksAvailability stockFilledDate expirationDate'
// });


addToCartSchema.virtual('offers', {
    ref: 'offers',
    localField: 'itemId',
    foreignField: "productId"
})

export default mongoose.model("cart", addToCartSchema);