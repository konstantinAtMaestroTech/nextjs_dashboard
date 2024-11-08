import {Button} from '@/app/ui/button'
import { ArrowUpCircleIcon, CheckIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface UploadClientViewProps {
    uploadStatus: string;
    setUploadStatus: (status: string) => void;
}

export function UploadClientView({ uploadStatus, setUploadStatus }: UploadClientViewProps) {

    // no button animmation because of typescript again
    console.log('upload status', uploadStatus)
    console.log('set upload status', setUploadStatus)

    const handleClick = () => {
        const input = document.getElementById('input')
        input.click();
    }

    const handleChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setUploadStatus('selected')
        } else {
            setUploadStatus('empty')
        }
    }

    // TODO: an upload status checker

    return (
        <div className="flex items-end justify-center">
        <Button
            id='upload'
            type='button'
            className={clsx(
                'flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors hover:bg-[#646e6e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-[#ff0d0d] aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
                {
                  'bg-[#ff0d0d]': uploadStatus === 'empty',
                  'bg-green-500': uploadStatus === 'selected',
                },
              )}
            onClick={handleClick}
        >
            {uploadStatus === 'empty' ? (
                <>
                Select the file 
                <ArrowUpCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
                </>
            ) : null}
            {uploadStatus === 'selected' ? (
                <>
                The file is selected 
                <CheckIcon className="ml-auto h-5 w-5 text-gray-50" />
                </>
            ) : null}
        </Button>
        <input
            type='file'
            name='input'
            id='input'
            className="absolute w-px h-px p-0 m-[-1px] overflow-hidden clip-rect border-0"
            onChange={handleChange}
            required
        />
        </div>
    )
}