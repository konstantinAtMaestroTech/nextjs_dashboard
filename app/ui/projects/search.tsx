'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import  { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import {useState, useEffect} from 'react';

export default function Search({ placeholder, searchParam, label}: {placeholder: string, searchParam: string, label: string}) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();
  const [inputValue, setInputValue] = useState(searchParams.get(searchParam)?.toString() || '');

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching ${term}`);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchParam, term);
    } else {
      params.delete(searchParam)
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    const supplier = searchParams.get(searchParam);
    if (!supplier) {
      setInputValue('');
    }
  }, [searchParams]);

  return (
    <div className="flex items-stretch justify-left mb-4">
      <div className="w-full rounded-md bg-gray-50">
      <div className="mb-0">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {label}
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
              <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearch(e.target.value);
              }}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
