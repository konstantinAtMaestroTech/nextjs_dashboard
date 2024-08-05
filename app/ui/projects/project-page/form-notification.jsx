import {useFormStatus} from 'react-dom'

export default function FormNotification() {
    
    const {pending} = useFormStatus();

    if (!pending) {
        return null;
    }
    return (
        <div className='flex flex-grow justify-center rounded-md bg-[#ff0d0d] text-white p-4 md:p-6'>
            <span>Uploading the model. Please do not reload the page</span>
        </div>
    )
}