import {listObjects, urnify } from "@/app/lib/services/aps"

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