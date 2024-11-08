'use client'

import {useState} from 'react';
import ClientViewInfoModal from '@/app/ui/projects/new-project-page/ClientViewInfoModal';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function ClientViewInfo({view}: {view: any}) {
    
    const [modal, setModal] = useState(false);
    const handleClick = () => {modal ? setModal(false) : setModal(true)}

    return (
        <>
            {modal ? <ClientViewInfoModal
            view={view}
            setModal={setModal}  
            /> : null}
            <button 
                className="rounded-md border p-2 hover:bg-gray-100"
                onClick={handleClick}
            >
                <span className="sr-only">Client View Info</span>
                <ArrowsPointingOutIcon className="w-5" />
            </button>
        </>
    )

}