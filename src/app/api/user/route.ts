import { NextResponse } from "next/server";
import { hash } from "bcrypt"
import db from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = body;
        if(!email || !password || !username) {
            return NextResponse.json({ user: null, message: "Invalid Input!" }, { status: 409 })
        }

        const existingUserName = await db.user.findUnique({
            where: {
                username: username 
            }
        })

        if (existingUserName) {
            return NextResponse.json({ user: null, message: "Username already in use!" }, { status: 409 })
        }

        const existingUserByEmail = await db.user.findUnique({
            where: {
                email: email 
            }
        })

        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User Already Exist with this email!" }, { status: 409 })
        }
        const hashPassword = await hash(password, 10)
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        })
        const { password: hashedPassword, ...rest } = newUser;
        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });

    }
}