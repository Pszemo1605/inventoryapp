import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

function generateReplacementDate(createdAt: Date, validitySpan: number): Date {
	const replacementDate = new Date(Date.now());
	replacementDate.setFullYear(createdAt.getFullYear() + validitySpan);

	return replacementDate;
}

export async function POST(req: NextRequest) {
	try {
		const itemData = await req.json();

		const createdItem = await db.item.create({
			data: itemData,
		});

		if (createdItem.category === "electronic") {
			await db.item.update({
				where: {
					id: createdItem.id,
					category: "electronic",
				},
				data: {
					replacementDate: generateReplacementDate(createdItem.createdAt, 5),
				},
			});
		}

		if (createdItem) {
			return NextResponse.json({ message: "Item added Successfully!" }, { status: 200 });
		} else {
			return NextResponse.json({ message: "Something went wrong!" }, { status: 409 });
		}
	} catch (e) {
		console.log(e);
		return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
	}
}
