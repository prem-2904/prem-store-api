import mongoose, { Schema } from "mongoose";

const stocksSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        addedStockNos: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        mrpPrice: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        onSale: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("product-stocks", stocksSchema);