'use client';

import Link from 'next/link';
import {
  LinkIcon,
  PhoneIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  PencilSquareIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createMachine, StateMachine} from '@/app/lib/db/actions';
import {useActionState, useState} from 'react';

interface MachineryType {
  type: string;
}


export default function Form({machineryTypes, selectedSupplier}: {machineryTypes: MachineryType[], selectedSupplier: string | null}) {
  const initialState: StateMachine = {message:null, errors: {}};
  const [state, formAction] = useActionState(createMachine, initialState);
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState('');
  const [websiteError, setWebsiteError] = useState('');

  const characterLimit = 128;

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement> ) => {
    setNotes(event.target.value);
  };

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(event.target.value);
  };

  const validateWebsite = () => {
    console.log(website);
    const regex = /^https:\/\/([\w-]+(\.[\w-]+)+)(\/[\w-]*)*$/;
    if (!regex.test(website)) {
      setWebsiteError('Please enter a valid website address starting with https://.');
      console.log('unvalidated');
      return false;
    } else {
      console.log('validated');
      setWebsiteError('');
      return true;
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (validateWebsite()) {
      formAction(formData);
      console.log('Form submitted');
    } else {
      console.log('Form not submitted due to validation error');
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <div className="flex items-stretch justify-center">
        <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">

          {/* Machine owner */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Owned By
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="owner-visible"
                  name="owner-visible"
                  type="text"
                  step="0.01"
                  placeholder='Use the search bar to search for suppliers'
                  value={selectedSupplier?.trim()}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  disabled
                  required
                />
                <input
                  type="hidden"
                  id="owner"
                  name="owner"
                  value={selectedSupplier?.trim()}
                /> {/*one input is to be shown to the user and the other one is to be submitted to the form action. a bit hacky in my opinion*/}
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Machine model */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Model
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="model"
                  name="model"
                  type="model"
                  step="0.01"
                  placeholder="Enter Model info"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <Cog6ToothIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Producer web-site */}
          <div className="mb-4">
            <label htmlFor="phone_main" className="mb-2 block text-sm font-medium">
              Technical data
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="website"
                  name="website"
                  type="text"
                  step="0.01"
                  value={website}
                  onChange={handleWebsiteChange}
                  onBlur={validateWebsite}
                  placeholder="Enter website address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {websiteError && <p className="mt-2 text-sm text-red-600">{websiteError}</p>}
            </div>
          </div>
        </div>


        <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">

          {/* Notes */}
          <div className="mb-4">
              <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                Notes
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={9}
                    placeholder="Add notes"
                    maxLength={characterLimit}
                    value={notes}
                    onChange={handleNotesChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 resize-none"
                  />
                  <PencilSquareIcon className="pointer-events-none absolute left-3 top-0 h-[18px] w-[18px] translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  <div className="absolute right-3 bottom-0 -translate-y-1/2 text-sm text-gray-500">
                    {notes.length}/{characterLimit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-md bg-gray-50 p-4 md:p-6">
          <div className="relative">
              <select
                id="type"
                name="type"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select machine type
                </option>
                {machineryTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
        </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/machinery"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Machine</Button>
      </div>
    </form>
  );
}
