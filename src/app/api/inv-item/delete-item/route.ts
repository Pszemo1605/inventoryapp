import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises";

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const idToBeDelete = url.searchParams.get("id");

        // Retrieve item from the database to get the filename of the associated image
        const item = await db.item.findUnique({
            where: {
                id: String(idToBeDelete)
            }
        });

        if (!item) {
            return NextResponse.json({ message: "Item not found!" }, { status: 404 });
        }

        // Delete the associated image file from the filesystem
        if(item.image){
            const imagePath = path.join(process.cwd(), "public/assets/", item.image);
            await unlink(imagePath);
        }

        // Delete the item from the database
        await db.item.delete({
            where: {
                id: String(idToBeDelete)
            }
        });

        return NextResponse.json({ message: "Item and associated image deleted successfully!" }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
