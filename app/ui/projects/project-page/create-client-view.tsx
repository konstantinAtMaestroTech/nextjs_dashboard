'use client'

import {createClientView} from '@/app/lib/AutodeskViewer/actions-viewer';
import {TagIcon} from '@heroicons/react/24/outline';
import {UploadClientView} from '@/app/ui/projects/project-page/upload-client-view';
import {Button} from '@/app/ui/button';
import FormNotification from '@/app/ui/projects/project-page/form-notification'
import {useState, useEffect} from 'react';

interface ClientViewFormProps {
    projectId: string;
}

const ClientViewForm: React.FC<ClientViewFormProps> = ({ projectId }) => {

    const [uploadStatus, setUploadStatus] = useState('empty'); // empty, selected

    const createClientViewWithId = createClientView.bind(null, projectId)

    const handleSubmit = (event: React.FormEvent) => {
        setUploadStatus('empty')
    }

    return (
        <form onSubmit={handleSubmit} action={createClientViewWithId}>
            <div className='flex  flex-col items-stretch justify-center'>
                <div className='flex rounded-md bg-gray-50 p-4 md:p-6 gap-2'>
                    <div className='relative flex-1'>
                        <label htmlFor='title' className='mb-2 block text-sm font-medium'>
                            View Title
                        </label>
                        <div className='relative mt-2 rounded-md'>
                            <input
                                id='title'
                                name='title'
                                type='text'
                                placeholder='Enter a title for the view'
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className='relative flex-1'>
                        <label htmlFor='title' className='mb-2 block text-sm font-medium'>
                            View Subtitle
                        </label>
                        <div className='relative mt-2 rounded-md'>
                            <input
                                id='subtitle'
                                name='subtitle'
                                type='text'
                                placeholder='Enter a subtitle for the view'
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-bottom relative self-end'>
                        <UploadClientView uploadStatus={uploadStatus} setUploadStatus={setUploadStatus}/>
                    </div>
                    <div className='flex flex-col items-center justify-bottom relative self-end'>
                        <Button>Submit the form</Button>
                    </div>         
                </div>
                <FormNotification />
            </div>
        </form>
    )
}

export default ClientViewForm;