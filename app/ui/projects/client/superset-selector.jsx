import {handleMentionClick} from '@/app/lib/AutodeskViewer/ViewerAPI/chatCalls';
import clsx from 'clsx';

export default function SupersetSelector({ views, viewer, activeMenu}) {

    console.log("views from the superset-selector", views);

    return (
        <div id='superset' className={clsx('absolute bg-white', {
            'hidden': activeMenu !== "superset"
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
                                        wordWrap: 'break-word', // Ensures long words break and wrap
                                        whiteSpace: 'pre-wrap', // Preserves white space and wraps text when necessary
                                        overflowWrap: 'break-word', // Breaks long words to avoid overflow
                                        maxWidth: '100%', // Ensures the message does not exceed the container's width
                                        boxSizing: 'border-box' // Includes padding and border in the element's total width and height
                                    }}
                                    onClick={(e) => {handleMentionClick(e,viewer,views)}}
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
                    onClick={(e) => {handleMentionClick(e,viewer,views)}}
                    id='view_default'>
                    <span id='default' className='text-lg font-semibold'>
                        DEFAULT
                    </span>
                </div>
            </div>
        </div>
    )
}