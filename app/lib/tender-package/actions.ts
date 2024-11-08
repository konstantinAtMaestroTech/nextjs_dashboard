"use server"

import {getInternalToken} from "@/app/lib/AutodeskViewer/services/aps";
import { s3_getSignedURL_dbid } from '@/app/lib/aws-s3/actions';
import { StateMessage } from "@/app/lib/db/actions-chat";
import {pool} from "@/app/lib/db/pool"; 
import {v4} from 'uuid';
import { revalidatePath } from "next/cache";
import { TwoLeggedToken } from "@aps_sdk/authentication";
import { SelectedElement } from "@/app/ui/tender-packages/Panels/Playground";

export async function createGeometryRecord({dbid, viewableGuid, urn, token}: {dbid: number; viewableGuid: string; urn: string; token: TwoLeggedToken }): Promise<number[] | undefined> {

    // tender packages are made of multiple lements. Theoretically a single element has to be represented by a single
    // dbid. However let's not disregard the case when a single production order is in fact a complex geometry made of
    // several leaf nodes. In this case it is represented by the dbid of the parent node (the one that was selected 
    // by the user) that encapsulate all the children nodes

    // It is possible to run a single convertion routine to process all selected geometries. In this case the final obj
    // output will be an unstructured list of single elements. The complexity of working with such list is that it does 
    // not preserve the hierarchical structure of the elements and if for some reasone certain element was made of 
    // number of subelements it is then diffucult to draw the original structure. So here are the two scenarious:
    // first is to run single job but to restrict the element selection to leafNodes (no complex elements);
    // second allow any type of nodes to be processed but run one job at once. As of now i ma more inclined to the
    // second option

    console.log('the token is', token)

    const translationJob = await (async () => {
        try {

            const body = {
                input: {
                    urn: `${urn}`
                },
                output: {
                    destination: {
                        region: "us"
                    }, 
                    formats: [
                        {
                            type: "obj",
                            advanced: {
                                modelGuid: `${viewableGuid}`,
                                objectIds : [dbid]
                            }
                        }
                    ]
                }
            };

            const res = await fetch('https://developer.api.autodesk.com/modelderivative/v2/designdata/job', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token.access_token}`,
                    'x-ads-force': 'true',
                },
                body: JSON.stringify(body)
            });

            console.log('the response is', res);

            if (!res.ok) {
                console.error(res);
            }

            const data = await res.json();
            return data;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    })();

    const newUrn: string = translationJob.urn

    async function checkStatus(newUrn: string) {
        while (true) {
            const resp = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${newUrn}/manifest`, {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${token.access_token}`,
                }
            });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const status = await resp.json();
            if (status.progress === 'complete') {
                console.log('The model is translated');
                return status;
            } else {
                console.log('the status is', status);
                console.log(`Model is being translated.`);
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 5 seconds before the next check
        }
    }

    const status = await checkStatus(newUrn);
    console.log('The status is ', status);

    // the whole knowledge below is purely phenomenological i.e. result of responses analysis. The obj data
    // about the objects passed as the initaial prop is contined in the second-to-last children array member of the second
    // derivative (i = 1). The material properties are contained in the last children array member

    const children_data: Array<any> = status.derivatives[1].children;
    console.log('The chidlren_data is', children_data);

    const objUrl = children_data[children_data.length-2];
    console.log('The objUrl is', objUrl);

    const signedCookiesAndURL = await ( async () => {
        try {

            const res = await fetch (`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest/${objUrl.urn}/signedcookies`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                }
            })

            const headers: any[] = [];
            res.headers.forEach((value, name) => {
                headers.push({ name, value });
            });

            if (!res.ok) {
                console.error(res);
            }

            // Obtain signed cookies
            const specificHeaderName = 'set-cookie';
            const specificHeaders = headers.filter(header => header.name === specificHeaderName);
            const signedCookies = specificHeaders.map(header => header.value).join(';');

            // Obtain signed url
            const data = await res.json();
            const signedURL = data.url;

            console.log('The signedCookies is', signedCookies);
            console.log('The signedURL is ', signedURL);

            return {signedCookies, signedURL}

        } catch (err) {
            console.error('Error obtaining signed url data:', err);
        }
    } )();

    if (signedCookiesAndURL) {

        const {signedCookies, signedURL} = signedCookiesAndURL

        const obj = await ( async () => {
            try {
                const res = await fetch(signedURL, {
                    method: 'GET',
                    headers: {
                        'Cookie': signedCookies,
                    }
                })

                if (!res.ok) {
                    console.error(res)
                }

                const data = await res.blob();
                return data;
            } catch (err) {
                console.error('Error obtaining the obj', err);
            }
        })();

        console.log('The object is ', obj);

        // figure out the children nodes

        if (!obj) {return}

        const obj_def = await obj?.text();

        const children_ids = obj_def.split('\n')
            .filter(line => line.startsWith('g '))
            .map(line => Number(line.split(' ')[1].replace('Obj.', '')));

        console.log('List of children ', children_ids);

        const objBlob = new Blob([obj], { type: 'text/plain' });

        // now let's upload this object to our s3 bucket. I believe that this step can be generally avoided, since
        // we have just retrieved the obj from a aws s3 bicket of autodesk. However as of now it is rather a research
        // efford

        const maestro_signedURL = await s3_getSignedURL_dbid(dbid)

        if (maestro_signedURL.failure !== undefined) {
            console.error("Couldn't obtain a signd url for the maestro bucket");
            return
        }

        const url = maestro_signedURL.success?.url;

        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: objBlob
        });

        return children_ids

    };

    return
}

export async function createTPViewDBRecord({ project_id, tpmodelid, tp_view_name, hex_string, components, status }: { project_id: string; tpmodelid: string; tp_view_name: string; hex_string: string; components: string; status: string; }) {

    const id = v4();

    console.log('we are inside the createTPViewDBRecord function');

    try {
        const query = `
            INSERT INTO tp_views (id, model_id, title, hex_string, components, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [id, tpmodelid, tp_view_name, hex_string, components, status];
        const [results, field] = await pool.query(query, values);
        console.log('the database query results are:', results);
    } catch (error) {
        console.error('couldnt update the tp_views table', error);
    }

    revalidatePath(`/dashboard/projects/${project_id}`);
}

// The leaf_nodes property are the leaf nodes of the given dbid. They are needed since the loadOneNode
// function from the viewer loader accepts only the leaf nodes as the arguments.

export type ComponentData = {
    component_dbid: number;
    name: string;
    leaf_nodes: number[]
};

// I failed to come up with good traversal strategy as well as read that there is a risk of a stack overflow
// so it is safer to do the .obj parsing

/* export async function traverseModelTree({token, urn, viewableGuid, dbids}: {token: TwoLeggedToken; urn: string; viewableGuid: string; dbids: number[]}): Promise<ComponentData> {

    async function fetchModelTree(urn: string, viewableGuid: string) {
        while (true) {
            const resp = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${viewableGuid}`, {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${token.access_token}`,
                }
            });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const tree = await resp.json();

            return tree
        }
    }

    function findLeafIds(parentNode, targetIds) {

        function traverse(node) {
            // Check if the current node's ID is in the targetIds array
            if (targetIds.includes(node.objectid)) {
                if (node.objects.length === 0) {
                    // If there are no children, add the ID to the leafIds
                    leafIds.push(node.objectid);
                } else {
                    // If there are children, traverse them
                    for (const child of node.objects) {
                        traverse(child);
                    }
                }
            } else {
                // Continue traversing even if the current ID is not in targetIds
                for (const child of node.objects) {
                    traverse(child);
                }
            }
        }

    }

    

    const tree = await fetchModelTree(urn, viewableGuid);

    const parentNode = tree.data.objects[0];



} */

export async function createTenderPackageRecord(prevState: StateMessage | undefined, formData: FormData): Promise<StateMessage | undefined> {
    
    const components_string = formData.get("components") as string;

    const input_elements = JSON.parse(components_string) as SelectedElement[];

    const viewableGuid = formData.get('guid') as string; // Viewable GUID of the source geometry

    const tpmodelid = formData.get('tpmodelid') as string; // The Model coressponding to the given Tender Package View

    const urn = formData.get('urn') as string; // the urn of the source model

    const tp_view_name = formData.get('tp_view_name') as string;

    const project_id = formData.get('project_id') as string;

    const token = await getInternalToken();

    /* const components = await traverseModelTree({token, urn, viewableGuid, dbids}) */

    // create the TP View Record in the dataset

    // start the translation job

    const components: ComponentData[] = []

    for (const el of input_elements) {

        const dbid = el.dbid;
        const leaf_nodes = await createGeometryRecord({dbid, viewableGuid, urn, token});
        const name = el.name;

        if (dbid && leaf_nodes && dbid) {
            components.push({component_dbid: dbid, name: name, leaf_nodes: leaf_nodes});
        }

    }

    const cmpnts_string = JSON.stringify(components);

    console.log("the cmpnts_string is ", cmpnts_string);

    await createTPViewDBRecord({project_id, tpmodelid, tp_view_name, hex_string: "#FFFFFF", components: cmpnts_string, status: "Uploading" });

    return

}

