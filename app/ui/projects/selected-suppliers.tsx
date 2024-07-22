import {XMarkIcon} from '@heroicons/react/24/outline';
import { Dispatch } from 'react';

export default function Selected({ selection, setSelectedSuppliers }: { selection: any[], setSelectedSuppliers: any }) {

    function handleDelete (supplier: any) {
        setSelectedSuppliers((prevSelectedSuppliers: any[]) => 
            prevSelectedSuppliers.filter(item => item !== supplier)
        );
    }

    return (
        <div className="flex rounded-md bg-gray-50 pt-0 pb-4 md:pb-6">
            {selection.map((supplier,index) => (
                <div className='relative' key={supplier}>
                    <span 
                    className='inline-flex items-center rounded-full px-2 py-1 text-xs bg-gray-100 text-gray-500'
                    key = {index}
                    >
                        {supplier}
                        <button
                            type='button'
                            key={supplier}
                            className='flex items-center justify-center p-1 h-[18px] w-[18px]'
                            onClick= {() => handleDelete(supplier)}
                        >
                            <XMarkIcon className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </button>
                    </span>
                    <input
                        type="hidden"
                        id={supplier}
                        name="supplier"
                        value={supplier?.trim()}
                    ></input>
                </div>
        ))}
        </div>
    );
}