import {fetchClientViewsByProjectId} from '@/app/lib/db/data';
import Link from 'next/link';
import ClientViewInfo from '@/app/ui/projects/new-project-page/ClientVIewInfo';
import AddClientView from '@/app/ui/projects/new-project-page/AddClientView';

export default async function ClientViews (props: any) {

    const {id} = props

    // here i fetch only the views. ALl information regarding the view (supersets and chat rooms 
    // will be fetched directly on the view page)

    const views = await fetchClientViewsByProjectId(id);

    console.log("the fetched views are", views);

    return (
        <>
            <table className='hidden min-w-full text-gray-900 md:table'>
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            View Title
                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            View Subtitle
                        </th>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Link
                        </th>
                        <th scope="col" className="relative py-3 pl-6 pr-3">
                            <div className="flex justify-end gap-3">
                                <AddClientView id={id}/>
                            </div>
                        </th>
                    </tr>
                </thead>
            </table>
            <div className="flex-1 flex-col min-h-0 overflow-y-auto"> {/** it literally took me a whol day to understand tht in ordr to prevent oveflow you have to set ujp min-h-0 to flex containers  https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size*/}
                <table className="w-full">
                    <tbody className="bg-white">
                        {views?.map((view) => (
                                <tr
                                key={view.id}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{view.title}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{view.subtitle}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-normal py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/client/${view.id}`} className="text-gray-500 hover:text-gray-700 underline">{`${view.title} | ${view.subtitle}` }</Link>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <ClientViewInfo view={view}/>
                                        </div>
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <PaginationClientView totalPages={totalViewsPages} /> */}
        </>
    )
}