'use client'

import { Dispatch, SetStateAction, useState, useEffect, FormEvent, useRef } from 'react';
import clsx from 'clsx';
import { useActionState } from 'react';
import {StateMessage} from '@/app/lib/db/actions-chat'
import { createTenderPackageRecord } from '@/app/lib/tender-package/actions';

interface Playground {
    viewer: any;
    tpmodelid: string;
    project_id: string;
    urn: string;
    viewableGuid: string | undefined;
    leafNode: string;
    setLeafNode: Dispatch<SetStateAction<string>>;
    activeMenu: string;
}

function OnSuccessCallback(prop: any) {
    const name = prop.name;
    console.log(prop.name)
    return name
};
function OnErrorCallback(prop: any) {console.log('OnErrorCallback ', prop)};

export type SelectedElement = {
    dbid: number;
    name: string;
}

export default function Playground({viewer, project_id, viewableGuid, urn, leafNode, tpmodelid, setLeafNode, activeMenu}: Playground) {

    const [filteredElements, setFilteredElements] = useState<SelectedElement[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedGeometries, setSelectedGeometries] = useState<SelectedElement[]>([]);
    const [tenderPackage, setTenderPackage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const initialState: StateMessage = {message:null, errors: {}};
    const [state, formAction] = useActionState(createTenderPackageRecord, initialState);

    // temporary to check


    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        viewer.search(inputValue, async (dbids: number[]) => {
            const components = await Promise.all(dbids.map(async (dbid) => {
                const name: string = await new Promise((resolve, reject) => {
                    viewer.getProperties(dbid, (prop: any) => {
                        resolve(prop.name);
                    }, (error: any) => {
                        console.log('OnErrorCallback ', error);
                        reject(error);
                    });
                });
                return { dbid, name };
            }));
            console.log('components are', components);
            setFilteredElements(components);
        });
    };

    /* const handleSubmit = (e: FormEvent) => {
        e. preventDefault();
        const form = formRef.current;
        form?.requestSubmit();
    } */

    const handleView = (item: number) => {
        viewer.fitToView(item);
    }

    const handleSelect = (item: SelectedElement) => {
        setSelectedGeometries((prevItem) => [...prevItem, item]);
    }

    return (
        <div id='components' className={clsx('absolute bg-white', {
            'hidden': activeMenu !== "components"
        })} style={{ 
            height: 'calc(70vh - 104.5px)', // i leave it this way as a reminder about the workaround i had to do to calculate the height of the element when it was full-width
            width: '25%',
            left: 56,
            top: 10,
            right: 0,
            bottom: 0,
            zIndex: 1001, 
            overflow: 'auto'
        }}
        >
            <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Set the leafNode"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border p-2"
            />
            <button className="border">
                Search
            </button>
            </form>
            <ul>
                {filteredElements.length > 0 ? (
                filteredElements.map((item, index) => (
                    <li 
                        key={index}
                    >
                        {`${item.name} | ${item.dbid}`}
                        <button
                            key={`view_${index}`}
                            onClick={() => handleView(item.dbid)}
                        >
                            View
                        </button>
                        <button
                            key={`select_${index}`}
                            onClick={() => handleSelect(item)}
                        >
                            Select
                        </button>
                    </li>
                ))
                ) : (
                <li>No results found</li>
                )}
            </ul>
            <form
                ref={formRef}
                /* onSubmit={handleSubmit} */
                action={formAction}
            >
                <input
                    type='text'
                    name='tp_view_name'
                    value={tenderPackage}
                    onChange={(e) => setTenderPackage(e.target.value)}
                    placeholder="Set the TenderPackage name"
                />
                <input
                    type="text"
                    name="project_id"
                    value={project_id}
                    readOnly
                    hidden
                />
                <input
                    type="text"
                    name='components'
                    value={JSON.stringify(selectedGeometries)}
                    readOnly
                />
                <input
                    type='text'
                    name='tpmodelid'
                    value={tpmodelid}
                    readOnly
                    hidden
                />
                <input
                    type="text"
                    name="urn"
                    value={urn}
                    readOnly
                    hidden
                />
                <input
                    type='text'
                    name='guid'
                    value={viewableGuid}
                    hidden
                    readOnly
                />
                <button>
                    Submit
                </button>
            </form>
        </div>
    )
}