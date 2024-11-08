'use client'

import {usePathname, useSearchParams, useRouter} from 'next/navigation';
import clsx from 'clsx';

export default function ModeSelector () {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {replace} = useRouter();
    const currentMode = searchParams.get('mode') || 'client';

    function handleClick(mode: string) {

        const params = new URLSearchParams(searchParams);
        params.set('mode', mode);
        replace(`${pathname}?${params.toString()}`);

    }

    return (
        <div className="flex">
            <button className={clsx("p-2 hover:bg-gray-100", {"bg-gray-50": currentMode === "client"})} onClick={() => handleClick('client')}>
                <span>Client Views</span>
            </button>
            <button className={clsx("p-2 hover:bg-gray-100", {"bg-gray-50": currentMode === "tender"})} onClick={() => handleClick('tender')}>
                <span>Tender Packages</span>
            </button>
            <button className={clsx("p-2 hover:bg-gray-100", {"bg-gray-50": currentMode === "assembly"})} onClick={() => handleClick('assembly')}>
                <span>Assembly Control</span>
            </button>
        </div>
    )
}