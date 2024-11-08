import Image from 'next/image';
import {fetchTPModelDataByTPModelId, TPModelData} from '@/app/lib/db/data';
import {fetchRoomChat, fetchRoomUsers} from '@/app/lib/db/data-chat';
import {createUserRecord} from '@/app/lib/db/actions-chat';
import {auth} from '@/auth';
import Utilities from '@/app/ui/tender-packages/utilities';
import {fetchTPViewDataByTPModelId} from '@/app/lib/db/data';
import {getPublicToken} from "@/app/lib/AutodeskViewer/services/aps" 

export interface Message {
    id: string;
    message: string;
    time_stamp: string;
    name: string;
    email: string;
}

export interface User {
    name: string;
    email: string;
}

export default async function Page({params}: {params: {id: string}}): Promise<JSX.Element> {

    const id = params.id;
    const session = await auth();

    const modelData: TPModelData | undefined = await fetchTPModelDataByTPModelId(id);

    if (session?.user && session?.user?.email && session?.user?.name) {
        await createUserRecord(session.user.email, id, session.user.name)
    }

    if (modelData) {

        const messages = await fetchRoomChat(id) as Message[];
        const users = await fetchRoomUsers(id) as User[];

        //  here we fetch server-data with the components being just a string. Let's parse it
        const tpviews_server = await fetchTPViewDataByTPModelId(id);

        if (tpviews_server) {

            // conversion of the component property from string (that is the storing format in mysql)
            // to a JS oBject (that we work with on the client)
        
            const tpviews = tpviews_server.map((tpview) => {
                if (typeof tpview.components === 'string') { // since the tpvies just came form the server the components are indeed a string
                    tpview.components = JSON.parse(tpview.components);
                }
                return tpview;
            });

            // it maybe can be done together with the viewer init, or even inside the viewer.
            // howerv i could not find the straightforward function that guarantees return of the 
            // necessary node in all cases

            const token = await getPublicToken();

            // the following application works only in case of a single model. The Revit case must be studied separetely

            const viewableGuid = await (async () => {
                try {
                    const res = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${modelData.urn}/metadata`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token.access_token}`,
                        }
                    });
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await res.json();
                    const metadata = data.data.metadata as { guid: string; name: string; role: string }[];
                    return metadata[0].guid;
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            })();

            return (
                <>
                    <main>
                        <div className="m-4 flex items-center justify-between">
                            <Image 
                            src='/Logo_Extended.png'
                            width={200}
                            height={152}
                            className="hidden md:block"
                            alt="Screenshots of the dashboard project showing desktop version"
                            />
                            <div className="flex flex-col justify-center rounded-lg">
                                <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                                    <strong>{modelData.title}</strong>
                                </p>
                                <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                                    {modelData.subtitle}
                                </p>
                            </div>
                        </div>
                        <Utilities urn={modelData.urn} project_id={modelData.project_id} viewableGuid={viewableGuid} tpmodelid={id} users={users} messages={messages} session={session} tpviews={tpviews}></Utilities>
                    </main>
                </>
            )

        }

    } else {
        return <span>No TP Model is find</span>
    }

    return <span>No TP Model is find</span>

}


