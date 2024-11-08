'use client'

import {useState} from 'react';
import AddClientViewModal from '@/app/ui/projects/new-project-page/AddClientViewModal';

export default function AddClientView({
    id
}: {
    id: string
}) {


    const [modal, setModal] = useState(false);
    const handleClick = () => {modal ? setModal(false) : setModal(true)};

    return (
        <>
            {modal ? <AddClientViewModal 
            id={id}
            setModal={setModal}  
            /> : null}
            <button 
                className="rounded-md px-2 h-10 text-sm border bg-[#646e6e] border-[#646e6e] text-white"
                onClick={handleClick}
            >
                <span className="">+ Add Client View</span>
            </button>
        </>
    )

}