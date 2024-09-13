'use client'

import {useState} from 'react';
import Viewer from '@/app/ui/projects/client/viewer';
import Chat from '@/app/ui/chat/chat';
import SupersetSelector from '@/app/ui/projects/client/superset-selector';
import CreateSuperset from '@/app/ui/projects/client/create-superset';

export default function ViewerAndChat(props) {

    const {urn, room, users, chat, session, views} = props;
    const [viewer, setViewer] = useState(null);
    const [activeMenu, setActiveMenu] = useState("chat");

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 104.5px)', width: '100%' }}>
            <Viewer urn={urn} setViewer={setViewer} activeMenu={activeMenu} setActiveMenu={setActiveMenu}></Viewer>
            <Chat room={room} users={users} chat={chat} session={session} views={views} viewer={viewer} activeMenu={activeMenu}/>
            <SupersetSelector views={views} viewer={viewer} activeMenu={activeMenu}/>
            <CreateSuperset viewer={viewer} activeMenu={activeMenu} room={room}/>
        </div>
    )
}