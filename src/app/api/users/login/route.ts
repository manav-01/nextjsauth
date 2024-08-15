import { connect } from "@/dbConfig/db.config";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // check user is exist
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 })
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        // create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: process.env.TOKEN_EXPIRY! });

        // Response
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        // Set Cookies
        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true
            }
        );

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
};

/*
https://nextjs.org/docs/app/api-reference/functions/cookies
*/