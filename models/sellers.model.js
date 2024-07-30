import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
    {
        sellerName: {
            type: String,
            required: true,
            unique: true
        },
        sellerMailId: {
            type: String,
            required: true,
            unique: true
        },
        sellerPassword: {
            type: String,
            required: true
        },
        sellerAddress: {
            type: String,
            required: true
        },
        sellerState: {
            type: String,
            required: true
        },
        sellerCountry: {
            type: String,
            required: true
        },
        sellerContact: {
            type: String,
            required: true
        },
        sellerAvailableLocations: [{
            type: String,
            required: true
        }],
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

sellerSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, res) => {
        delete res.sellerPassword
    }
})

export default mongoose.model("sellers", sellerSchema);