

import Image from 'next/image';
import { fetchUrnByClientViewId } from '@/app/lib/db/data';
import {fetchRoomChat, fetchRoomUsers} from '@/app/lib/db/data-chat';
import {createUserRecord} from '@/app/lib/db/actions-chat';
import {auth} from '@/auth';
import ViewerAndChat from '@/app/ui/chat/chat-viewer-wrapper';
import {fetchViewsByRoomId} from "@/app/lib/db/data";
import {fetchRoomUserId} from '@/app/lib/db/data-auth';
import { redirect } from 'next/navigation'

export default async function Page({params}:{params: {id: string}}) {

    const id = params.id // here and after id is the client view id. Client view Id = Room Id

    const session = await auth();

    console.log('roomId is ', id);

    const usersAllowed = await fetchRoomUserId(id);

    const identifier = session?.user

    let thisUserAllowed = false

    if (identifier && usersAllowed) {

        thisUserAllowed = usersAllowed.some(user => user.user_id === identifier.email);

    }

    if (thisUserAllowed || identifier?.role === "MaestroTeam") {

        console.log('External users allowed in this room are ', usersAllowed);

        const {urn, title, subtitle} = await fetchUrnByClientViewId(id)

        /* there are two possible strategies to make the viewer and chat to communicate. 
            the obvious one is to to wrap everything in a client component and use useState
            to share the state. Another approach is to use search params. Let-s try the client side approach first
        */

        //server action
        async function createNewUserJoined(email, room, name) {
            await createUserRecord(email, room, name);
        }
        
        
        console.log('session', session);
        await createNewUserJoined(session.user.email, id, session.user.name);
        const chat = await fetchRoomChat(id);
        const users = await fetchRoomUsers(id);
        const views = await fetchViewsByRoomId(id);
        /* const views = await fetchRoomViews(data.room); suspended before the viewer migration*/
        console.log('users', users);

        if (!session) {
            // logic for temporary session. Maybe to implement OAuth but to make sure that it works
            // only for certian routes
        }

        return (
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
                            <strong>{title}</strong>
                        </p>
                        <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <ViewerAndChat urn={urn} room={id} users={users} chat={chat} session={session} views={views}></ViewerAndChat>
            </main>
        );

    } else {

        redirect('/login')

    }

    
}