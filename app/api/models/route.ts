import {listObjects, translateObject, urnify } from "@/app/lib/AutodeskViewer/services/aps";
import {NextResponse} from "next/server";
import path from 'path';
import { writeFile, mkdir, unlink } from "fs/promises";
import {uploadObject} from "@/app/lib/AutodeskViewer/services/aps"

export async function GET() {
    try {
        const objects = await listObjects();
        const formattedObjects = objects.map(o => ({
            name: o.objectKey,
            urn: urnify(o.objectId),
        }));
        return Response.json(formattedObjects);
    } catch (err) {
        console.error('Error listing objects:', err);
        return Response.json({ error: 'Internal Server Error' });
    }
}

export async function POST(req: Request) {

    const formData = await req.formData();
    const file = formData.get('model-file');

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
    if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = file.name;
        const uploadDir = path.join(process.cwd(), "public/assets/");
        const filePath = path.join(uploadDir, filename);
        try {
            await mkdir(uploadDir, { recursive: true });
            await writeFile(filePath, buffer);

            const obj = await uploadObject(file.name, filePath);
            console.log('here is obj from uploadObject', obj);
            console.log('the urn to input to translateObject is', urnify(obj.objectId));
            await translateObject(urnify(obj.objectId), undefined);

            // Delete the file after uploading to the cloud
            await unlink(filePath);

            return NextResponse.json({
                name: obj.objectKey,
                urn: urnify(obj.objectId)
            });

        } catch (error) {
            return NextResponse.json({ Message: "Failed", status: 500 });
        }
    } else {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
}


/* export async function POST(req: NextApiRequest) {

    const form = new formidable.IncomingForm();

    form.parse(req, async(err, fields, files) => {

        if (err) {
            return Response.json({error: "The upload was unsuccessful"})
        }
        const file = files.file;

        if (!file) {
            return Response.json({error: "The required filed 'model-input' is missing"});
        }
        try {
            const obj = await uploadObject(file.name, file.path);
            await translateObject(urnify(obj.objectId), req.fields['model-zip-entrypoint']);
            return Response.json({
                name: obj.objectKey,
                urn: urnify(obj.objectKey)
            });
        } catch (err) {
            return Response.json({
                error: 'Internal server Error'
            })
        }
    })

    return Response.json({ error: 'Internal server Error'});
} */