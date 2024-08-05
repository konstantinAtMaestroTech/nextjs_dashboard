'use client'

import  { useSearchParams, usePathname, useRouter } from  'next/navigation';

export default function Select({name, setSelection, searchParam}) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const handleSelection = (selected) => {
        setSelection(prevSelected => [...prevSelected, selected]);
        const params = new URLSearchParams(searchParams);
        params.delete(searchParam)
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <button
            type='button'
            className="flex h-10 items-center rounded-lg bg-[#ff0d0d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#646e6e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-[#ff0d0d] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            onClick={(e) =>  {handleSelection(e.target.value);}}
            value={name}
        >
            Select
        </button>
    );
  }