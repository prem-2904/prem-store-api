import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "sellers"
        },
        productName: {
            type: String,
            required: true
        },
        productDesc: {
            type: String,
            required: true
        },
        productImages: [{
            type: String,
            required: true
        }],
        isAvailableForSale: {
            type: Boolean,
            required: true,
            default: false
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        availabilityStocks: [{
            type: Schema.Types.ObjectId,
            ref: "product-stocks",
            default: []
        }]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
    }
);

productSchema.virtual("offers", {
    foreignField: "productId",
    localField: "_id",
    ref: "offers",
});

export default mongoose.model("products", productSchema);