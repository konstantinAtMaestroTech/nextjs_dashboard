'use client'

import {useState} from 'react';
import AddTPModal from '@/app/ui/projects/new-project-page/tender-packages/AddTPModal';
import { Session } from 'next-auth';

export default function AddTenderPackageModel({ id, session }: {id: string; session: Session | null}): JSX.Element {

    const [modal, setModal] = useState(false);
    const handleClick = () => { modal ? setModal(false) : setModal(true)};

    return (
        <>
            {modal ? <AddTPModal
            id={id}
            setModal={setModal}
            session={session}
            /> : null}
            <button
                className="rounded-md px-2 h-10 text-sm border bg-[#646e6e] border-[#646e6e] text-white"
                onClick={handleClick}
            >
                <span className="">+ Add TP Model</span>
            </button>
        </>
    )
}

