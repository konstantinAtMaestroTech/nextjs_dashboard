'use client'

import {useState, Dispatch, SetStateAction} from 'react';
import {createClientView} from '@/app/lib/AutodeskViewer/actions-viewer';
import {Button} from '@/app/ui/button';
import {TagIcon} from '@heroicons/react/24/outline'
import FormNotification from '@/app/ui/projects/new-project-page/form-notification'
import {UploadClientView} from '@/app/ui/projects/new-project-page/upload-client-view'
import { XMarkIcon } from '@heroicons/react/20/solid';

export default function UploadClientViewModal({id, setModal}: {id: string, setModal: Dispatch<SetStateAction<boolean>>}) {

    const [uploadStatus, setUploadStatus] = useState('empty');
    const createCV = createClientView.bind(null, id)
    const handleSubmit = (event: React.FormEvent) => {
        setUploadStatus('empty')
    }

    const closeModal = () => {
        setModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSubmit} action={createCV}>
                <div className='flex flex-col justify-center bg-gray-50 max-w-sm'>
                    <div className="flex justify-end">
                        <button onClick={closeModal} className="p-2">
                            <XMarkIcon className="w-5 hover:text-gray-500" />
                        </button>
                    </div>
                    <div className='flex flex-col rounded-md p-4 md:p-6 gap-6
                    '>
                        <div className="flex flex-col items-center gap-4">
                            <div className='relative'>
                                <label htmlFor='title' className='text-center mb-2 block text-sm font-medium'>
                                    View Title
                                </label>
                                <div className='relative mt-2 rounded-md'>
                                    <input
                                        id='title'
                                        name='title'
                                        type='text'
                                        placeholder='Enter a title for the view'
                                        className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        required
                                    />
                                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className='relative'>
                                <label htmlFor='title' className='text-center mb-2 block text-sm font-medium'>
                                    View Subtitle
                                </label>
                                <div className='relative mt-2 rounded-md'>
                                    <input
                                        id='subtitle'
                                        name='subtitle'
                                        type='text'
                                        placeholder='Enter a subtitle for the view'
                                        className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        required
                                    />
                                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className='flex flex-col items-center justify-bottom relative'>
                                <UploadClientView uploadStatus={uploadStatus} setUploadStatus={setUploadStatus}/>
                            </div>
                            <div className='flex flex-col items-center justify-bottom relative'>
                                <Button>Submit the form</Button>
                            </div>
                        </div>         
                    </div>
                    <div className="flex p-4 items-center justify-center text-justify flex-wrap break-words whitespace-normal"><strong>Notice:</strong> Please ensure that for each upload, you either rename the file that you upload (i.e. example.dwg becomes example1.dwg) or delete all views based on the file across all projects (e.g., if you have created multiple project versions for testing purposes). It is essential for the system's functionality that the names of uploaded files remain unique across the entire platform. This is a temporary measure and will soon be handled automatically.
                    </div>
                    <FormNotification />
                </div>
            </form>
        </div>
    )
}