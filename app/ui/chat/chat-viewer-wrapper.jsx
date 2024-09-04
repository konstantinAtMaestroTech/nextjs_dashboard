'use client'

import {useState} from 'react';
import Viewer from '@/app/ui/projects/client/viewer';
import Chat from '@/app/ui/chat/chat';

export default function ViewerAndChat(props) {

    const {urn, room, users, chat, session, views} = props;
    const [viewer, setViewer] = useState(null);

    return (
        <>
            <Viewer urn={urn} setViewer={setViewer}></Viewer>
            <Chat room={room} users={users} chat={chat} session={session} views={views} viewer={viewer}></Chat>
        </>
    )
}