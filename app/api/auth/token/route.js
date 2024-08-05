const viewerUrl = process.env.VIEWER_URL;

export async function GET() {
    try {
        const resp = await fetch(`${viewerUrl}/api/auth/token`);
        const data = await resp.json()
        return Response.json({data})
    } catch (error) {

      return Response.json({ error }, { status: 500 });
    }
}