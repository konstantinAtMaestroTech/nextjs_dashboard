import { s3_get_label } from "@/app/lib/aws-s3/actions";

export async function POST(request: Request) {
    const { clientViewId, supersetId } = await request.json();

    const fileStream = await s3_get_label(clientViewId, supersetId);

    if (!(fileStream instanceof Uint8Array)) {
        console.error("no filestream!");
        return new Response("File not found", { status: 404 });
    }

    return new Response(fileStream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${supersetId}.pdf"`,
        },
    });
}