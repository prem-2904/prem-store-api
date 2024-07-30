import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountMode: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    // Define a transform function for this individual schema type. Only called when calling toJSON() or toObject().
    transform: (doc, res) => {
        delete res.password
    }
});

export default mongoose.model("users", userSchema);