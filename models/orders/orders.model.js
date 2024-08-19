import mongoose, { Schema } from "mongoose";

const OfferDetailSchema = new mongoose.Schema({
    coupon: { type: String, required: true },
    discount: { type: String, required: true },
    couponId: { type: String, required: true }
});


const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            unique: true
        },
        totalAmount: {
            type: String,
            required: true
        },
        typeOfPayment: {
            type: String,
            required: true
        },
        paymentOrderId: {
            type: String,
        },
        paymentTransactionId: {
            type: String,
        },
        orderFullName: {
            type: String,
            required: true
        },
        orderAddressLine1: {
            type: String,
            required: true
        },
        orderAddressLine2: {
            type: String,
        },
        orderAddressPincode: {
            type: Number,
            required: true
        },
        orderEmail: {
            type: String,
            required: true
        },
        orderPhone: {
            type: String,
            required: true
        },
        // orderStatus: {
        //     type: String,
        //     required: true
        // },
        orderItems: {
            type: Schema.Types.ObjectId,
            ref: 'order-items',
            required: true,
        },
        orderHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'order-history',
            required: true,
            default: []
        }],
        orderedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        // updatedBy: {
        //     type: [Schema.Types.ObjectId],
        //     ref: "Admins",
        // },
        orderAmountPaid: {
            type: String,
            required: true
        },
        offerDetails: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

export default mongoose.model("orders", orderSchema);