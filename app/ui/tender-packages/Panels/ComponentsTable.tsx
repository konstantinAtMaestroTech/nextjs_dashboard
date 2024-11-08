'use client'

import {useEffect, useState} from 'react';
import clsx from 'clsx';

interface ComponentsTable {
    viewer: any;
    activeMenu: string;
    leafNode: string;
}

export type SelectionElement = {
    dbid: number;
    name: string;
}

export default function ComponentsTable({viewer, activeMenu, leafNode}: ComponentsTable) {

    const [groupedElements, setGroupedElements] = useState<{ [key: string]: SelectionElement[] }>({});
    const [openMenus, setOpenMenus] = useState<string[]>([])

    function handleShow(name: string) {
        openMenus.includes(name) ? (
            setOpenMenus(prevItems => 
                prevItems.filter(item => item != name)
            )
        ) : (
            setOpenMenus(prevItems => [...prevItems, name])
        )
    }

    function handleSelectGroup(name: string) {
        console.log('The group name is ', name);
    }

    function handleSelect(dbid: number) {
        console.log('The element dbid is ', dbid);
    }

    useEffect(() => {
        viewer.search(leafNode, async (dbids: number[]) => {
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
            const groupedByName: { [key: string]: SelectionElement[] } = components.reduce((acc: { [key: string]: SelectionElement[] }, obj: SelectionElement) => {
                const { name } = obj;
                if (!acc[name]) {
                    acc[name] = [];
                }
                acc[name].push(obj);
                return acc;
            }, {});
    
            setGroupedElements(groupedByName);
        });
    },[leafNode])

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
            <div className="flex flex-1 flex-col">
                {Object.keys(groupedElements).map(name => (
                    <div key={name} className='flex items-between justify-between flex-1'>
                        <span>{name}</span>
                        <button 
                        onClick={() => handleShow(name)}
                        className="border"
                        > Show Elements</button>
                        <button 
                        onClick={() => handleSelectGroup(name)}
                        className="border"
                        > Select All </button>
                        {openMenus.includes(name) ? (
                            <div className="nested-list">
                                {groupedElements[name].map((item, index) => (
                                    <div key={index} className='nested-item'>
                                        <span>{`${item.name} | ${item.dbid}`}</span>
                                        <button
                                        onClick={() => handleSelect(item.dbid)}
                                        >Select Element</button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}