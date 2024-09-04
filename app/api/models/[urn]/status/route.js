import {getManifest} from "@/app/lib/AutodeskViewer/services/aps"

export async function GET(req, {params}) {
    
    const { urn } = params; 

        try {
            const manifest = await getManifest(urn);

            if (manifest) {
                let messages = [];
                
                if (manifest.derivatives) {
                    for (const derivative of manifest.derivatives) {
                        messages = messages.concat(derivative.messages || []);
                        if (derivative.children) {
                            for (const child of derivative.children) {
                                messages = messages.concat(child.messages || []);
                            }
                        }
                    }
                }

                return Response.json({ 
                    status: manifest.status, 
                    progress: manifest.progress, 
                    messages 
                });
            } else {
                return Response.json({ status: 'n/a' });
            }
        } catch (err) {
            console.error('Error fetching manifest:', err);
            return Response.json({ error: 'Internal Server Error' });
        }

}
