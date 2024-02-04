import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const idSingleItem = url.searchParams.get("id");

        const extractItemData = await req.json();
        console.log(extractItemData);

        // Retrieve item from the database to get the filename of the associated image
        const item = await db.item.update({
            where: {
                id: String(idSingleItem)
            },
            data: extractItemData
        });

        if (item) {
            return NextResponse.json({ message: "Successfull Updated item" }, { status: 200 });

        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });

    }
}