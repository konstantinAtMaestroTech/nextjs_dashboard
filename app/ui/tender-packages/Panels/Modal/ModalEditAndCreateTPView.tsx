'use client'

import {Dispatch, SetStateAction, FormEvent, useState} from 'react';
import { TPViewData } from '@/app/lib/db/data';
import { XMarkIcon, TagIcon, EyeDropperIcon } from '@heroicons/react/20/solid';
import {v4} from 'uuid';

interface ModalEditAndCreateTPView {
    tpview?: TPViewData;
    leafNode: string;
    tpmodelid: string;
    setModal: Dispatch<SetStateAction<boolean>>;
    setTpViews: Dispatch<SetStateAction<TPViewData[]>> 
}

export default function ModalEditAndCreateTPView({tpview, leafNode, tpmodelid, setModal, setTpViews}: ModalEditAndCreateTPView) {

    const [tpViewTitle, setTpViewTitle] = useState(tpview ? tpview.title : '');
    const [tpViewColor, setTpViewColor] = useState(tpview ? tpview.hex_string : '');
    const [isHexValid, setIsHexValid] = useState(tpview ? true : false);

    const closeModal = () => {
        setModal(false);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (tpview) {
            setTpViews((prevViews) =>
                prevViews.map(view =>
                    view.id === tpview.id
                    ? {...view, title: tpViewTitle, color: tpViewColor}
                    : view
                )
            )
        } else {
            const newTpView: TPViewData = {
                id: v4(),
                model_id: tpmodelid,
                title: tpViewTitle,
                hex_string: tpViewColor,
                components: [],
                status: "Created", // yet to understand what to do with the statuses
                production_tag: leafNode
            }
            setTpViews((prevViews) => [...prevViews, newTpView])
        }
        setModal(false);
    }

    const validateHex = (hex: string) => {
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        return hexRegex.test(hex);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTpViewColor(value);
        setIsHexValid(validateHex(value));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1002]">
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center bg-gray-50 max-w-sm'>
                    <div className="flex justify-end">
                        <button onClick={closeModal} className="p-2">
                            <XMarkIcon className="w-5 hover:text-gray-500" />
                        </button>
                    </div>
                    <div className='flex flex-col rounded-md p-4 md:p-6 gap-6'>
                        <div className="felx flex-col items-center gap-4">
                            <div className='relative'>
                                <label htmlFor='title' className='text-center mb-2 block text-sm font-medium'>
                                    Tender Package Title
                                </label>
                                <div className='relative mt-2 rounded-md'>
                                    <input
                                        type='text'
                                        placeholder='Enter the Tender Package Title'
                                        value={tpViewTitle}
                                        onChange={(e) => setTpViewTitle(e.target.value)}
                                        className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        required
                                    />
                                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className='relative'>
                                <label htmlFor='title' className='text-center mb-2 block text-sm font-medium'>
                                    Tender Package Hex color
                                </label>
                                <div className='relative mt-2 rounded-md'>
                                    <input
                                        type='text'
                                        placeholder='Enter the hexadecimal colour code'
                                        value={tpViewColor}
                                        onChange={handleColorChange}
                                        className={`peer block rounded-md border ${isHexValid ? 'border-gray-200' : 'border-red-500'} py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                                        required
                                    />
                                    <EyeDropperIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                {!isHexValid && <p className="text-red-500 text-sm mt-1">Invalid hex color code</p>}
                            </div>
                        </div>
                        <div className="felx flex-col gap-2">
                            <button
                                type="submit" 
                                disabled={!isHexValid}
                            >
                                {tpview ? "Update Tender Package" : "Create Tender Package"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}