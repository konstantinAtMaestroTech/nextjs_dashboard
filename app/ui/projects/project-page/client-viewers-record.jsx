'use client';

import {useState} from 'react';
import Link from 'next/link';
import {DeleteClientView, ShowSupersets, CreateSuperset} from '@/app/ui/projects/project-page/buttons';

export default function ViewRecord(view) {

    view = view.view // pls fix it for the love of god
    
    const [show, setShow] = useState(false)

    return (
        <>
            <tr
            key={view.id}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <p>{view.title}</p>
                </div>
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <p>{view.subtitle}</p>
                </div>
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <Link href={`/client/${view.id}`} className="text-gray-500 hover:text-gray-700 underline">{`${view.title} | ${view.subtitle}` }</Link>
                </div>
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <CreateSuperset id={view.id}/>
                    <ShowSupersets id={view.id} setShow={setShow} show={show}/>
                    <DeleteClientView id={view.id} />
                </div>
            </td>
            </tr>
            {view.supersets.map((superset)=>(
                <>
                    { show ? (
                    <tr
                        key={superset.id}
                        className="w-full bg-gray-100 border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap pl-6 pr-3">
                        </td>
                        <td className="whitespace-nowrap pl-6 pr-3">
                        </td>
                        <td className="whitespace-nowrap pl-6 pr-3">
                            <div className="flex items-center gap-3">
                                <Link href={`/client/superset/${superset.id}`} className="text-gray-500 hover:text-gray-700 underline">{`${superset.ss_title}` }</Link>
                            </div>
                        </td>
                        <td className="whitespace-nowrap pl-6 pr-3">
                            <div className="flex justify-end gap-3">
                                <DeleteClientView id={view.id} />
                            </div>
                        </td>
                    </tr>
                    ) : (<></>)
                    }
                </>
            ))}
        </>
    )
}