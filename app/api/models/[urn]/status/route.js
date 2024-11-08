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
                    url: manifest.derivatives[0].children[0].children[0].urn, // for now I just hardcoded it. Must be tested om an rvt model with multiple derivatives
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
