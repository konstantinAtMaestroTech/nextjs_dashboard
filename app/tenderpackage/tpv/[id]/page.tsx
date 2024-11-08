import { fetchTPViewDataById, fetchURNbyTPViewId } from "@/app/lib/db/data";
import React from 'react';
import Image from 'next/image';
import TenderPackageView from "@/app/ui/tender-packages/tp-views/TenderPackageView";

export default async function Page({ params }: { params: { id: string } }): Promise<JSX.Element> {
    
    const tp_view_id = params.id;
    const tp_view = await fetchTPViewDataById(tp_view_id);

    if (tp_view) {

        const urn = await fetchURNbyTPViewId(tp_view[0].id);

        if (urn) {

            return (
                <main>
                    <div className="m-4 flex items-center justify between">
                            <Image 
                            src='/Logo_Extended.png'
                            width={200}
                            height={152}
                            className="hidden md:block"
                            alt="Screenshots of the dashboard project showing desktop version"
                            />
                            <div className="flex flex-col justify-center rounded-lg">
                                <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                                    <strong>{tp_view[0].title}</strong>
                                </p>
                            </div>
                    </div>
                    <TenderPackageView tp_view={tp_view} urn={urn[0].urn}/>
                </main>
            );

        }

    }

    return (
        <>
            The TP View is not found.
        </>
    );
}