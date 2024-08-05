import Image from 'next/image';
import { fetchUrnByClientViewId } from '@/app/lib/db/data';
import Viewer from '@/app/ui/projects/client/viewer';
import Client from '@/app/lib/AutodeskViewer/Auth'

export default async function Page({params}:{params: {id: string}}) {

    const id = params.id
    const {urn, title, subtitle} = await fetchUrnByClientViewId(id)
    var getToken = {accessToken: await Client.getAccessToken()};
    console.log('getToken from page', getToken)

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
            <Viewer urn={urn}/>
        </main>
    );
}