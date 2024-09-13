import {handleMentionClick} from '@/app/lib/AutodeskViewer/ViewerAPI/chatCalls';
import clsx from 'clsx';
import {createSupersetView} from '@/app/lib/db/actions';
import {useState, useActionState} from 'react';

export default function CreateSuperset({ viewer, activeMenu, room}) {

    const [viewerState, setViewerState] = useState('');
    const initialState = {message:null, errors: {}};
    const [state, formAction] = useActionState(createSupersetView, initialState);

    const handleSubmit = (event) => {
        event.preventDefault();

        let view = {
            state: viewer.getState()
        };
        const viewStringified = JSON.stringify(view);
        setViewerState(viewStringified);

        const formData = new FormData();
        formData.append('new-superset-name', event.target['new-superset-name'].value);
        formData.append('new-superset-view', viewStringified);
        formData.append('new-superset-client-id', room);

        formAction(formData);

        document.getElementById("create-superset-form").reset();
    };

    return (
        <form
                action={formAction}
                onSubmit={handleSubmit}
                id='create-superset-form'
        >
            <div id='superset' className={clsx('absolute bg-white', {
                'hidden': activeMenu !== "create-superset"
            })} style={{ 
                left: 56,
                top: 10,
                zIndex: 1001, 
                overflow: 'auto'
            }}
            >
                <div className='flex flex-col'>
                    <div id='header' className='flex p-4 items-center bg-gray-300'>
                        <span id='headertitle' className='text-white text-lg font-semibold'>
                            CREATE A SUPERSET
                        </span>
                    </div>
                    <div className="flex overflow-y-auto scrollbar">
                        <div className="flex-grow flex-col gap-1">
                            <input 
                                type="text"
                                className="w-full p-4 self-start bg-white"
                                style={{ 
                                    wordWrap: 'break-word', // Ensures long words break and wrap
                                    whiteSpace: 'pre-wrap', // Preserves white space and wraps text when necessary
                                    overflowWrap: 'break-word', // Breaks long words to avoid overflow
                                    maxWidth: '100%', // Ensures the message does not exceed the container's width
                                    boxSizing: 'border-box' // Includes padding and border in the element's total width and height
                                }}
                                name='new-superset-name'
                                placeholder='Type the superset name'
                                required
                            />
                            <input 
                                type='text'
                                name='new-superset-view'
                                value={viewerState}
                                hidden
                            />
                            <input 
                                type='text'
                                name='new-superset-client-id'
                                value={room}
                                hidden
                            />
                        </div>
                    </div>
                    <div className='flex w-full p-4 items-center justify-center bg-gray-100 hover:bg-[rgba(255,60,0)] hover:text-white'
                        onClick={() => {
                            document.getElementById("create-superset-form")?.requestSubmit();
                        }}
                        id='view_default'>
                        <span id='default' className='text-lg font-semibold'>
                            SAVE
                        </span>
                    </div>
                </div>
            </div>
        </form>
    )
}