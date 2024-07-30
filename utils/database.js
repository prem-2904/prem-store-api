import mongoose from "mongoose";

export const connectToMongoDB = () => {
    try {
        mongoose.connect(process.env.MONGODB).then(() => {
            console.log("Connected with Mongo DB");
        })
    } catch (error) {
        console.log("Failed to connect with MongoDB");
    }
};