'use client'

import {useState, useEffect} from 'react';
import { Session } from 'next-auth';
import Viewer from '@/app/ui/tender-packages/Viewer'; // to do it this way is very bad. It breaks modularity very badly
import Icons from '@/app/ui/assembly-control/Icons';
import CreateSuperset from '@/app/ui/projects/client/create-superset';
import SupersetSelector from '@/app/ui/assembly-control/SupersetSelector';
import SupersetData from '@/app/ui/assembly-control/SupersetData';
import Scanner from '@/app/ui/assembly-control/Scanner'

export interface View {
    id: string;
    ss_title: string;
    client_view_id: string;
    data: {
        state: any;
        measurements: any;
    };
}

export interface ViewInterface {
    id: string;
    ss_title: string;
    client_view_id: string;
    data: {
        state: any;
        measurements: any;
    };
}


interface Utilities {
    urn: string;
    page_id: string;
    viewsFetched: View[];
}

export default function Utilities({
    urn,
    page_id,
    viewsFetched
}: Utilities) : JSX.Element {

    const [viewer, setViewer] = useState(null);
    const [views, setViews] = useState<View[]>(viewsFetched);
    const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);
    const [selectedView, setSelectedView] = useState<View | undefined>(undefined);

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        setSelectedView(views.find(view => view.id === hash));
    }, [views]);

    //maybe it makes sense to create views as the state but let's see

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 104.5px)', width: '100%' }}>
            <Viewer urn={urn} setViewer={setViewer} selectedView={selectedView}/> {/* This might be a problem if the viewer rerenders everytime the selected view is changed. Let's see */}
            <Icons activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
            {/* {viewer ? <Scanner activeMenu={activeMenu} setActiveMenu={setActiveMenu} views={views} viewer={viewer} setSelectedView={setSelectedView}/> : null} */}
            {viewer ? <CreateSuperset viewer={viewer} activeMenu={activeMenu} room={page_id} setViews={setViews}/> : null}
            {viewer ? <SupersetSelector views={views} viewer={viewer} activeMenu={activeMenu} selectedView={selectedView} setSelectedView={setSelectedView}/> : null}
            {viewer ? <SupersetData selectedView={selectedView} viewer={viewer} activeMenu={activeMenu} /> : null}
        </div>
    )
}