import Image from 'next/image';
import { fetchSupersetById } from '@/app/lib/db/data';
import Viewer from '@/app/ui/projects/client/viewer';

export default async function Page({params}:{params: {id: string}}) {

    const supersetId = params.id
    const superset = await fetchSupersetById(supersetId)
    console.log(superset)

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
                        <strong>{superset.title}</strong>
                    </p>
                    <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                        {superset.subtitle}
                    </p>
                </div>
            </div>
            <Viewer urn={superset.urn}/>
        </main>
    );
}