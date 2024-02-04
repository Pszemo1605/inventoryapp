import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const extractItemData = await req.json();
        console.log(extractItemData);

        const newlyCreateItem = await db.item.create({
            data: extractItemData
        })

        if (newlyCreateItem) {
            return NextResponse.json({ message: "Item added Successfully!" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Something went wrong!" }, { status: 409 });
        }

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });

    }
}