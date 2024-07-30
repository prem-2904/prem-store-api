import mongoose, { Schema } from "mongoose";


const wishlistSchema = new mongoose.Schema(
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
        markedFav: {
            type: Boolean,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    }, {
    timestamps: true
}
);


export default mongoose.model("wishlist", wishlistSchema);
