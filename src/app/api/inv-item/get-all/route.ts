import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);

	// /inv-item/
	if (url.searchParams.size === 0) {
		try {
			const items = await db.item.findMany({});
			return NextResponse.json({ message: "Request Successful!", data: items }, { status: 200 });
		} catch (e) {
			return NextResponse.json({ message: "No items found" }, { status: 404 });
		}
	}

	// /inv-item/?query=<some_string>
	const query = url.searchParams.get("query");
	if (query !== null) {
		try {
			const getAllItems = await db.item.findMany({
				where: {
					OR: [
						{
							title: {
								contains: query,
							},
						},
						{
							id: {
								contains: query,
							},
						},
						{
							category: {
								contains: query,
							},
						},
						{
							place: {
								contains: query,
							},
						},
					],
				},
			});

			if (getAllItems?.length !== 0) {
				return NextResponse.json({ message: "Request Successful!", data: getAllItems }, { status: 200 });
			} else {
				return NextResponse.json({ message: "No items found for given query." }, { status: 404 });
			}
		} catch (e) {
			console.error(e);
			return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
		}
	}

	try {
		// Extract parameters from the request query string
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		const category = url.searchParams.get("category");

		// Use the id parameter to filter items in the database
		const getAllItems = await db.item.findMany({
			where: {
				AND: [
					{
						authorId: id,
					},
					{
						OR: [
							{
								category: {
									contains: category || "",
								},
							},
						],
					},
				],
			},
		});

		if (getAllItems && getAllItems.length) {
			return NextResponse.json({ message: "Request Successful!", data: getAllItems }, { status: 200 });
		} else {
			return NextResponse.json({ message: "No items found for the given category." }, { status: 404 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
	}
}
