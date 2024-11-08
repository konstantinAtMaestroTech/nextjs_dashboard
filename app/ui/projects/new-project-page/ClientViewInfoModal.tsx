'use client'

import {Dispatch, SetStateAction} from 'react'
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DeleteClientView, InviteUser } from '@/app/ui/projects/new-project-page/buttons';

export default function ClientViewInfoModal({view, setModal}: {view: any, setModal: Dispatch<SetStateAction<boolean>>}) {
    
    const closeModal = () => {
        setModal(false);
    }

    return (
        <div className="fixed inset-0 flex flex-col inline-flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col justify-center max-w-sm ">
                <div className="flex justify-end">
                        <button onClick={closeModal} className="p-2">
                            <XMarkIcon className="w-5 text-white hover:text-gray-500" />
                        </button>
                </div>
                <div className="bg-white rounded-md gap-2 p-2 min-w-80">
                    <div className="flex justify-center items-center py-3 bg-gray-100">
                        <span className="font-bold"> INFO </span>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-2 p-3">
                        <label htmlFor="title" className='text-start block text-sm font-medium'>
                            View Title
                        </label>
                        <div className="relative w-full">
                            <span
                            id="title"
                            className="peer block w-full border rounded-md py-2 pl-10 text-sm  placeholder:text-gray-500 p-2"
                            >{view.title}</span>
                            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-2 p-3">
                        <label htmlFor="subtitle" className='text-start block text-sm font-medium'>
                            View Subtitle
                        </label>
                        <div className="relative w-full">
                            <span
                            id="subtitle"
                            className="peer block w-full border rounded-md py-2 pl-10 text-sm  placeholder:text-gray-500 p-2"
                            >{view.subtitle}</span>
                            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-2 p-3">
                        <label htmlFor="filename" className='text-start block text-sm font-medium'>
                            File Name
                        </label>
                        <div className="relative w-full">
                            <span
                            id="filename"
                            className="peer block w-full border rounded-md py-2 pl-10 text-sm  placeholder:text-gray-500 p-2"
                            >{view.filename}</span>
                            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="flex justify-center items-center py-3 bg-gray-100">
                        <span className="font-bold"> ACTIONS </span>
                    </div>
                    <div className="flex p-3 justify-end gap-2">
                        <InviteUser id={view.id} title={view.title} subtitle={view.subtitle}/>
                        <DeleteClientView id={view.id} filename={view.filename} urn={view.urn}/>
                    </div>
                </div>
            </div>
        </div>
    )
}