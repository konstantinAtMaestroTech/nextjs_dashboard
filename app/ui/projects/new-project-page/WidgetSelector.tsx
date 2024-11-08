'use client'

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

export default function WidgetSelector () {

    // let's test the option with searchParams. if it refreshes the whole page and makes unnecassary
    // data fetches we will switch to the clietn side rendering and states

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {replace} = useRouter();
    const currentWidgetMode = searchParams.get('wmode') || 'overview';
    const [currentIndex, setCurrentIndex] = useState(0);

    const widgetModes = ['overview', 'team', 'supplier'];

    function handleNext() {
        const i = (currentIndex + 1) % widgetModes.length;
        handleClick(widgetModes[i]);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % widgetModes.length);
    }

    function handlePrevious() {
        const i = (currentIndex - 1 + widgetModes.length) % widgetModes.length;
        handleClick(widgetModes[i]);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + widgetModes.length) % widgetModes.length);
    }

    function handleClick(mode: string) {

        const params = new URLSearchParams(searchParams);
        params.set('wmode', mode);
        replace(`${pathname}?${params.toString()}`);

    }

    return (
        <>
            <div className="flex justify-center items-center m-1 gap-2 ">
                <button id="prev" className="rounded-md p-2" onClick={() => handlePrevious()}>
                    <ChevronLeftIcon className="w-5 hover:text-gray-500" />
                </button>
                <span>{widgetModes[currentIndex].toUpperCase()}</span>
                <button id="next" className="rounded-md p-2" onClick={() => handleNext()}>
                    <ChevronRightIcon className="w-5 hover:text-gray-500" />
                </button>
            </div>
        </>
    )

}