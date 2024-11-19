import Image from 'next/image';
import { fetchUrnByClientViewId, fetchViewsByRoomId, fetchGeometryStatusByClientViewId, GeometryDataParsed } from '@/app/lib/db/data';
import {auth} from '@/auth';
import Utilities from '@/app/ui/assembly-control/utilities'

export default async function Page({params}: {params: {id: string}}): Promise<JSX.Element> {

    const id = params.id;
    const session = await auth();

    const {urn, title, subtitle} = await fetchUrnByClientViewId(id);
    const viewsFetched = await fetchViewsByRoomId(id) as any[];
    const geometry_data_raw = await fetchGeometryStatusByClientViewId(id);
    let geometry_data: GeometryDataParsed

    if (geometry_data_raw) {

        const parsedGeometryState = JSON.parse(geometry_data_raw.geometry_state)
        geometry_data = parsedGeometryState;

    } else {
        geometry_data = {
            geometry_state: {}
        };
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
            <Utilities session={session} urn={urn} title={title} subtitle={subtitle} viewsFetched={viewsFetched} page_id={id} geometry_data={geometry_data}/>
        </main>
    );

}
