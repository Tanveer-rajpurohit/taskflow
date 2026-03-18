import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/taskflow";
    if (!uri) throw new Error("MONGO_URI not defined in environment");

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }

};


mongoose.connection.on("disconnected", () =>
  console.warn("MongoDB disconnected")
);
mongoose.connection.on("reconnected", () =>
  console.log("MongoDB reconnected")
);
 
export default connectDB;