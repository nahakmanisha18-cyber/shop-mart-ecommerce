
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
    throw new Error("Please configure MONGODB_URL in .env.local");
}

const cached = globalThis.mongoose || {
    conn: null,
    promise: null,
};

globalThis.mongoose = cached;

export const dbConnect = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL)
            .then((mongooseInstance) => mongooseInstance)
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.conn = null;
        cached.promise = null;
        throw error;
    }
};
