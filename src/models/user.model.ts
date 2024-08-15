import mongoose from "mongoose";

interface UserType extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}

interface TimeStampType extends mongoose.Document {
    timestamps?: boolean;
}

// Combine UserType and TimeStampType interfaces
type UserDocument = UserType & TimeStampType;

const userSchema = new mongoose.Schema<UserDocument>(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    }
    , { timestamps: true });

const User: mongoose.Model<UserDocument> = mongoose.models.users || mongoose.model<UserDocument>("users", userSchema);

export default User;