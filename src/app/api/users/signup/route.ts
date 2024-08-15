import mongoose from "mongoose";
import User from "@/models/user.model";
import { connect } from "@/dbConfig/db.config"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";
// Types
interface UserReqType extends mongoose.Document {
    username: string;
    email: string;
    password: string;
}

connect().then(() => console.log("DB Connection Successful")).catch(e => { throw new Error(e.message) });

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password }: UserReqType = await reqBody;
        // console.log(reqBody);

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // encrypt password
        const salt = await bcryptjs.genSalt(10); // async
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Make new User
        const newUser = new User({
            username, email, password: hashedPassword
        })

        // store in DB
        const savedUser = await newUser.save();
        console.log(savedUser);
        // send verification email
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id!.toString() })
        return NextResponse.json({ message: "User registered successfully", success: true, savedUser }, { status: 201 });


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}