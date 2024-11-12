'use client'

import {useState, useEffect} from 'react';
import { Session } from 'next-auth';
import Viewer from '@/app/ui/tender-packages/Viewer'; // to do it this way is very bad. It breaks modularity very badly
import Icons from '@/app/ui/assembly-control/Icons';
import CreateSuperset from '@/app/ui/projects/client/create-superset';
import SupersetSelector from '@/app/ui/assembly-control/SupersetSelector';
import SupersetData from '@/app/ui/assembly-control/SupersetData';
import StatusController from '@/app/ui/assembly-control/StatusController';
/* import Scanner from '@/app/ui/assembly-control/Scanner' */
import { GeometryDataParsed } from '@/app/lib/db/data';
import { getColorForStatus, getLeafNodes } from '@/app/ui/assembly-control/StatusController';


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
    geometry_data: GeometryDataParsed;
    session: Session | null
}

export default function Utilities({
    urn,
    page_id,
    viewsFetched,
    geometry_data,
    session
}: Utilities) : JSX.Element {

    const [viewer, setViewer] = useState<any | null>(null);
    const [geometryData, setGeometryData] = useState<GeometryDataParsed>(geometry_data);
    const [showStatus, setShowStatus] = useState<boolean>(false)
    const [views, setViews] = useState<View[]>(viewsFetched);
    const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);
    const [selectedView, setSelectedView] = useState<View | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        setSelectedView(views.find(view => view.id === hash));
    }, [views]);

    useEffect(() => {

    }, [isLoading])

    useEffect(() => {
        if (viewer) {
            if (showStatus) {
                Object.keys(geometryData.geometry_state).forEach((dbid) => {
                    const status = geometryData.geometry_state[Number(dbid)];
                    const color = getColorForStatus(status);
                    getLeafNodes( viewer.model, [Number(dbid)] )
                    .then( ( leafNodes ) => {
                        leafNodes.forEach((leafNode: number) => {
                            viewer.setThemingColor(leafNode, color, null, true);
                        })
                    })
                    .catch( ( error ) => console.warn( error ) );
                });
            } else {
                viewer.clearThemingColors();
            }
        }
    }, [geometryData, showStatus])

    //maybe it makes sense to create views as the state but let's see

    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1002]">
                </div>
            ) : (
                <div style={{ position: 'relative', height: 'calc(100vh - 104.5px)', width: '100%' }}>
                    <Viewer urn={urn} setViewer={setViewer} selectedView={selectedView}/> {/* This might be a problem if the viewer rerenders everytime the selected view is changed. Let's see */}
                    <Icons session={session} activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
                    {/* {viewer ? <Scanner activeMenu={activeMenu} setActiveMenu={setActiveMenu} views={views} viewer={viewer} setSelectedView={setSelectedView}/> : null} */}
                    {session && viewer ? <CreateSuperset viewer={viewer} activeMenu={activeMenu} room={page_id} setViews={setViews}/> : null}
                    {activeMenu === 'superset' && <SupersetSelector geometryData={geometryData} views={views} viewer={viewer} activeMenu={activeMenu} selectedView={selectedView} showStatus={showStatus} setShowStatus={setShowStatus} setSelectedView={setSelectedView} room={page_id} setViews={setViews}/>}
                    {activeMenu === 'superset-data' && <SupersetData selectedView={selectedView} viewer={viewer} activeMenu={activeMenu} />}
                    {session && activeMenu === 'status-controller' && <StatusController activeMenu={activeMenu}  setIsLoading={setIsLoading} geometryData={geometryData} setShowStatus={setShowStatus} setGeometryData={setGeometryData} viewer={viewer} room={page_id} />}
                </div>
            )}
        </>
        
    )
}
