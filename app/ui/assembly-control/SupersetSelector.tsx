import clsx from 'clsx';
import { View } from './utilities';


interface SupersetSelectorProps {
    views: View[];
    viewer: any;
    activeMenu: string | undefined;
    selectedView: View | undefined;
    setSelectedView: (view: View | undefined) => void;
}

export default function SupersetSelector({ views, viewer, activeMenu, selectedView, setSelectedView}: SupersetSelectorProps) {

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


    return (
        <div id='superset' className={clsx('absolute bg-white w-4/5 lg:w-2/5 xl:w-2/6 2xl:w-1/4', {
            'hidden': activeMenu !== "superset"
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
                        VIEW SELECTOR
                    </span>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar">
                    <div className="flex flex-col gap-1">
                        {views.map((view, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-center w-full">
                                    <div className="w-full p-4 self-start bg-gray-100 hover:bg-gray-200" style={{ 
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%', 
                                        boxSizing: 'border-box'
                                    }}
                                    onClick={() => {handleViewClick(view)}}
                                    id={`view_${view.id}`}
                                    >
                                        {view.ss_title}
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