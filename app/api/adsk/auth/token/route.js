import {getPublicToken} from "@/app/lib/AutodeskViewer/services/aps" 

export async function GET() {
    try {
        const token = await getPublicToken();
        return Response.json(token);
    } catch (err) {
        console.error('Error fetching token:', err);
        return Response.json({ error: 'Internal Server Error' });
    }
}