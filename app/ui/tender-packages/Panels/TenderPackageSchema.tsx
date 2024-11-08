'use client'

import {Dispatch, SetStateAction, useState} from 'react';
import clsx from 'clsx';
import { TPViewData } from '@/app/lib/db/data';
import ModalEditAndCreateTPView from '@/app/ui/tender-packages/Panels/Modal/ModalEditAndCreateTPView'

interface TenderPackageSchema {
    tpViews:  TPViewData[];
    leafNode: string;
    tpmodelid: string;
    activeMenu: string;
    setTpViews: Dispatch<SetStateAction<TPViewData[]>>
}

export default function TenderPackageSchema({tpViews, leafNode, tpmodelid, activeMenu, setTpViews}: TenderPackageSchema): JSX.Element {

    const [modal, setModal] = useState(false);
    const [selectedTPView, setSelectedTPView] = useState<TPViewData | undefined>(undefined)

    const handleEditAndCreate = (item?: TPViewData ) => {
        setSelectedTPView(item);
        setModal(true);
    }

    const handleDelete = (item: TPViewData) => {
        setTpViews((prevViews) => 
            prevViews.filter(view => view.id != item.id)
        )
    }

    return(
        <>
        {modal ? <ModalEditAndCreateTPView
            tpview={selectedTPView}
            leafNode={leafNode}
            tpmodelid={tpmodelid}
            setModal={setModal}
            setTpViews={setTpViews}
        /> : null}
        <div id='production_tag' className={clsx('absolute bg-white', {
            'hidden': activeMenu !== "tpschema"
        })} style={{ 
            height: 'calc(70vh - 104.5px)', // i leave it this way as a reminder about the workaround i had to do to calculate the height of the element when it was full-width
            width: '25%',
            left: 56,
            top: 10,
            right: 0,
            bottom: 0,
            zIndex: 1001, 
            overflow: 'auto'
        }}>
            <div className="flex flex-col p-2 gap-2">
                <span className="flex justify-center items-center p-2"> <strong>TENDER PACKAGE SCHEMA</strong> </span>
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <ul>
                        {tpViews.length > 0 ? (tpViews.map((tpview, index) => (
                            <li
                                key={index}
                            >
                                <div className="flex p-2 justify-between items-between">
                                    <div>
                                        {tpview.title}
                                        <div key={`swatch_${index}`} className="h-5 w-5 border" style={{backgroundColor: tpview.hex_string}}></div>
                                    </div>
                                    <div>
                                        <button
                                            key={`edit_${index}`}
                                            onClick={() => handleEditAndCreate(tpview)}
                                            className="rounded border"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            key={`delete_${index}`}
                                            onClick={() => handleDelete(tpview)}
                                            className="rounded border"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))):(
                            <li className="flex justify-center items-center p-2"> NO TENDER PACKAGES</li>
                        )}
                    </ul>
                    <button
                        onClick={() => handleEditAndCreate()}
                    >
                        CREATE
                    </button>
                </div>
            </div>
        </div>
        </>
    )

}