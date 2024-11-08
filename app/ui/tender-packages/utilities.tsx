'use client'

import {useState, useEffect} from 'react';
import {Message, User} from '@/app/tenderpackage/tpm/[id]/page';
import { Session } from 'next-auth';
import { TPViewData } from '@/app/lib/db/data';
import Playground from '@/app/ui/tender-packages/Panels/Playground';
import ProductionTag from '@/app/ui/tender-packages/Panels/ProductionTag';
import TenderPackageSchema from '@/app/ui/tender-packages/Panels/TenderPackageSchema';
import ComponentsTable from '@/app/ui/tender-packages/Panels/ComponentsTable'

import Viewer from '@/app/ui/tender-packages/Viewer';
import Icons from '@/app/ui/tender-packages/Icons';
/* import ComponentsTable from '@/app/ui/tender-packages/Panels/ComponentsTable';
import CurrentSelection from '@/app/ui/tender-packages/Panels/CurrentSelection';
import ViewAndPublish from '@/app/ui/tender-packages/Panels/ViewAndPublish'; */ 

interface Utilities {
    urn: string;
    viewableGuid: string | undefined;
    project_id: string;
    tpmodelid: string;
    users: User[];
    messages: Message[];
    session: Session | null;
    tpviews: TPViewData[];   
}

export default function Utilities({
    urn,
    viewableGuid, 
    project_id,
    tpmodelid, 
    users, 
    messages, 
    session, 
    tpviews}: {
        urn: string;
        viewableGuid: string | undefined;
        project_id: string;
        tpmodelid:string; 
        users: User[]; 
        messages: Message[]; 
        session: Session | null; 
        tpviews: TPViewData[];
    }
) : JSX.Element {

    const [viewer, setViewer] = useState(null);
    const [activeMenu, setActiveMenu] = useState("chat");

    // here we set what to be considered as the production element. It is mainly needed for two purposes:
    // to override the selection so the user selects the information-rich node and not just the bare 
    // geometry leaf node (which is default). The second purpose is to filter the geometry in the component
    // selector. I set it to "m_prod" but theoretically it must fetch the ProductionTag of the tpviews.
    // the problem is that i do not kow which one to fetch since there is a number of TPVIews and I do not
    // consider the current TP View feature. 

    const [leafNode, setLeafNode] = useState("m_prod");

    const [tpViews, setTpViews] = useState(tpviews);

    useEffect(() => {console.log('The active menu is ', activeMenu)},[activeMenu]);
     
    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 104.5px)', width: '100%' }}>
            <Viewer urn={urn} setViewer={setViewer}/>
            <Icons activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
            {/* Here come the panel components */}
            <ProductionTag leafNode={leafNode} activeMenu={activeMenu} setLeafNode={setLeafNode} />
            {viewer ? <Playground viewer={viewer} project_id={project_id} urn={urn} tpmodelid={tpmodelid} viewableGuid={viewableGuid} leafNode={leafNode} setLeafNode={setLeafNode} activeMenu={activeMenu}/> : null}
            {viewer ? <ComponentsTable activeMenu={activeMenu} viewer={viewer} leafNode={leafNode}/> : null}
            <TenderPackageSchema leafNode={leafNode} tpmodelid={tpmodelid} tpViews={tpViews} activeMenu={activeMenu} setTpViews={setTpViews}/>
            {/* <CurrentSelection viewer={viewer}  tpViews={tpViews}/>
            <Chat room={room} session={session} tpViews={tpViews} viewer={viewer} users={users} messages={messages}/>
            <ViewAndPublish tpViews={tpViews}/> */}
        </div>
    )

}