import Link from 'next/link';
import {fetchTPModelsByProjectId, fetchTPViewsByModelIds} from '@/app/lib/db/data'
import AddTenderPackageModel from '@/app/ui/projects/new-project-page/tender-packages/AddTenderPackageModel';
/* import TenderPackageModelInfo from '@/app/ui/projects/new-project-page/tender-packages/TenderPackageModelInfo';
import TenderPackageViewInfo from '@/app/ui/projects/new-project-page/tender-packages/TenderPackageViewInfo'; */
import { Session } from 'next-auth';
import { TPView } from '@/app/lib/db/data';
import React from 'react';

interface TenderPackages {
    id: string;
    session: Session | null
}

export default async function TenderPackages({id, session}: {id: string, session: Session | null } ): Promise<JSX.Element> {

    const models = await fetchTPModelsByProjectId(id);
    let TPviews: TPView[] = [];
    console.log('models are fetched ', models);

    if (models.length != 0) {
        const modelIds = models.map((model) => {return model.id})
        TPviews = await fetchTPViewsByModelIds(modelIds)
        console.log('views are fetched', TPviews);
    }
    
    return (
        <>
            <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            TP Title
                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            TP Subtitle
                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Link
                        </th>
                        <th scope="col" className="relative py-3 pl-6 pr-3">
                            <div className="flex justify-end gap-3">
                                <AddTenderPackageModel id={id} session={session}/>
                            </div>
                        </th>
                    </tr>
                </thead>
            </table>
            <div className="flex-1 flex-col min-h-0 overflow-y-auto">
                <table className="w-full">
                    <tbody className="bg-white">
                    {models?.map((model) => (
                            <React.Fragment key={model.id}>
                                <tr 
                                    key={`M${model.id}`}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none bg-gray-200 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td colSpan={4} className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p className="text-white font-bold">MODELS</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{model.title}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{model.subtitle}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/tenderpackage/tpm/${model.id}`} className="text-gray-500 hover:text-gray-700 underline">{`${model.title} | ${model.subtitle}`}</Link>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            {/* <ClientViewInfo view={model} /> modal with the TP */}
                                        </div>
                                    </td>
                                </tr>
                                {TPviews.map((view) => {
                                    if (view.model_id === model.id) {
                                        return (
                                            <>
                                            <tr 
                                                key={`M${view.id}`}
                                                className="w-full border-b text-sm last-of-type:border-none bg-gray-300 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                            >
                                                <td colSpan={4} className="whitespace-normal pl-6 pr-3">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-white font-bold">TENDER PACKAGES</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr 
                                                key={view.id}
                                                className="w-full border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                            >
                                                <td colSpan={2} className="whitespace-normal pl-6 pr-3">
                                                    <div className="flex items-center gap-3">
                                                        <p>{view.title}</p>
                                                    </div>
                                                </td>
                                                <td className="whitespace-normal pl-6 pr-3">
                                                    <div className="flex items-center gap-3">
                                                        <Link href={`/tenderpackage/tpv/${view.id}`} className="text-gray-500 hover:text-gray-700 underline">{`${model.title} | ${model.subtitle}`}</Link>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap pl-6 pr-3">
                                                    <div className="flex justify-end gap-3">
                                                        {/* <TPViewInfo view={model} /> */}
                                                    </div>
                                                </td>
                                            </tr>
                                            </>
                                        );
                                    }
                                    return null; // Return null if the condition is not met
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}


