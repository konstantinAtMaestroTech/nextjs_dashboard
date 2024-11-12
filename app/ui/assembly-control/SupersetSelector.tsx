import clsx from 'clsx';
import { View } from './utilities';
import { GeometryDataParsed } from '@/app/lib/db/data';
import {DeleteSuperset} from "@/app/ui/assembly-control/Actions/DeleteSuperset";
import {Dispatch, SetStateAction} from 'react';


interface SupersetSelectorProps {
    views: View[];
    geometryData: GeometryDataParsed;
    viewer: any;
    activeMenu: string | undefined;
    selectedView: View | undefined;
    showStatus: boolean;
    setSelectedView: (view: View | undefined) => void;
    room: string;
    setShowStatus: Dispatch<SetStateAction<boolean>>;
    setViews: Dispatch<SetStateAction<View[]>> ;
}

export default function SupersetSelector({ showStatus, views, viewer, activeMenu, selectedView, setSelectedView, room, setViews, geometryData, setShowStatus}: SupersetSelectorProps) {

    let measureExtension = viewer.getExtension("Autodesk.Measure");
    let sectionExtension = viewer.getExtension("Autodesk.Section");

    function handleViewClick(view: any): void {
        const {state, measurements} = view.data;

        // delete all previous extensions
        
        measureExtension.deleteMeasurements();
        sectionExtension.activate();
        sectionExtension.deactivate();

        viewer.restoreState(state);
        measureExtension.setMeasurements(measurements);
        setSelectedView(view);
    }

    function handleDefaultClick(): void {

        viewer.showAll()
        measureExtension.deleteMeasurements();
        sectionExtension.activate();
        sectionExtension.deactivate();

        viewer.setViewFromFile(viewer.model);
        setSelectedView(undefined)
    }
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setShowStatus(event.target.checked);
    }

    return (
        <div id='superset' className='absolute bg-white w-4/5 lg:w-2/5 xl:w-2/6 2xl:w-1/4'
         style={{ 
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
                        VIEW SELECTOR
                    </span>
                    <div className='ml-auto'>
                        <label className='flex items-center space-x-2'>
                            <input
                                type='checkbox'
                                checked={showStatus}
                                onChange={handleCheckboxChange}
                                className='form-checkbox h-5 w-5 text-[rgba(255,60,0)]'
                            />
                            <span className='text-white'>Show Status</span>
                        </label>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar">
                    <div className="flex flex-col gap-1">
                        {views.map((view, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-center w-full">
                                    <div className="flex justify-between w-full p-4 self-start bg-gray-100 hover:bg-gray-200" style={{ 
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%', 
                                        boxSizing: 'border-box'
                                    }}
                                    id={`view_${view.id}`}
                                    >
                                        <button 
                                            className="text-left flex-stretch w-full"
                                            onClick={() => {handleViewClick(view)}}
                                        >
                                            {view.ss_title}
                                        </button>
                                        <DeleteSuperset supersetId={view.id} clientViewId={room} setViews={setViews}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex w-full p-4 items-center justify-center bg-gray-100 hover:bg-[rgba(255,60,0)] hover:text-white'
                    onClick={() => {handleDefaultClick()}}
                    id='view_default'>
                    <span id='default' className='text-lg font-semibold'>
                        DEFAULT
                    </span>
                </div>
            </div>
        </div>
    )
}