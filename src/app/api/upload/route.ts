import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const file: File | undefined = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate filename based on current time
    const currentTime = new Date();
    const timestamp = currentTime.getTime(); // Get timestamp in milliseconds
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;

    console.log(filename);
    try {
        await writeFile(
            path.join(process.cwd(), "public/assets/", filename),
            buffer
        );
        return NextResponse.json({ Message: "Success", filename }, { status: 201 });
    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({ Message: "Failed" }, { status: 500 });
    }
};
