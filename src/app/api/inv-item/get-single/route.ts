import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const idSingleItem = url.searchParams.get("id");

        // Retrieve item from the database to get the filename of the associated image
        const item = await db.item.findUnique({
            where: {
                id: String(idSingleItem)
            }
        });

        return NextResponse.json({ message: "Single item successfully recieved!", data: item }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
