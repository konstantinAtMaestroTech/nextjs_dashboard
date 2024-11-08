import clsx from 'clsx';
import {useEffect, useState} from 'react';
import { View } from './utilities';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

interface SupersetDataProps {
    selectedView: View | undefined;
    viewer: any;
    activeMenu: string | undefined;
}

export default function SupersetData({selectedView, viewer, activeMenu}: SupersetDataProps) {

    const [viewData, setViewData] = useState<any[] | undefined>(undefined);
    const [openSublist, setOpenSublist] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const fetchDbidProps = async () => {
            try {
                const isolatedArray = selectedView?.data.state.objectSet[0].isolated || [];
                const instanceTree = viewer.model.getData().instanceTree;
                const parentsArray: number[] = isolatedArray.map((dbid: number) => {
                    return instanceTree.getNodeParentId(dbid)
                })
                const uniqueParents = [...new Set(parentsArray)];
                const components = await Promise.all(uniqueParents.map(async (dbid: number) => {
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
                const groupedByName = components.reduce((acc: any, item: any) => {
                    if (!acc[item.name]) {
                        acc[item.name] = {count: 0, items: []};
                    }
                    acc[item.name].count += 1;
                    acc[item.name].items.push(item);
                    return acc;
                }, {});
                setViewData(groupedByName);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDbidProps();
        setOpenSublist({});
    },[selectedView, activeMenu]);

    const selectAll = (dbids: number[]) => {
        viewer.select(dbids);
    }

    const toggleSublist = (index: number) => {
        setOpenSublist(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    return (
        <div id='superset-data' className={clsx('absolute bg-white w-4/5 lg:w-2/5 xl:w-2/6 2xl:w-1/4', {
            'hidden': activeMenu !== "superset-data"
        })} style={{ 
            height: 'calc(70vh - 104.5px)', // i leave it this way as a reminder about the workaround i had to do to calculate the height of the element when it was full-width
            left: 56,
            top: 10,
            right: 0,
            bottom: 0,
            zIndex: 1001, 
            overflow: 'auto'
        }}
        >
            <div className='flex flex-col h-full'>
                <div id='header' className='flex p-4 items-center bg-gray-300'>
                    <span id='headertitle' className='text-white text-lg font-semibold'>
                        {selectedView? `${selectedView.ss_title.toLocaleUpperCase()} BREAKDOWN` : "ZONE IS NOT SELECTED"}
                    </span>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar">
                    <div className="flex flex-col gap-1">
                        {viewData ? (Object.entries(viewData).map(([name, data], index) => (
                            <div key={index}>
                                <div className="flex items-center justify-center w-full">
                                    <div className="w-full p-4 self-start bg-gray-100 hover:bg-gray-200" style={{ 
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%', 
                                        boxSizing: 'border-box'
                                    }}
                                    id={`${index}`}
                                    >
                                        <div className="flex justify-between gap-2">
                                            {name} | {data.count}
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    className="rounded-md px-2 h-5 text-sm border bg-[#646e6e] border-[#646e6e] text-white"
                                                    onClick={() => {selectAll(data.items.map((item: any) => item.dbid))}}
                                                >
                                                    Select All
                                                </button>
                                                <button onClick={() => {toggleSublist(index)}}>
                                                    {
                                                        openSublist[index] ? (<ChevronUpIcon className="w-5 hover:text-gray-300"/>) :(<ChevronDownIcon className="w-5 hover:text-gray-300"/>)
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {openSublist[index] && (
                                    <ul>
                                        {data.items && data.items.map((item: any, itemIndex: number) => (
                                            <li key={itemIndex} className="border border-gray-200">
                                                <div className="flex justify-between p-2 bg-gray-100">
                                                    {item.dbid}: {item.name}
                                                    <button
                                                        className="rounded-md px-2 h-5 text-sm border bg-[#646e6e] border-[#646e6e] text-white"
                                                        onClick={() => {selectAll([item.dbid])}}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))) : (<span>No view is selected</span>)}
                    </div>
                </div>
            </div>
        </div>
    )
}