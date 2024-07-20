'use client';

import Link from 'next/link';
import {
  LinkIcon,
  PhoneIcon,
  AtSymbolIcon,
  UserCircleIcon,
  PencilSquareIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createSupplier, StateSupplier} from '@/app/lib/db/actions';
import {useActionState, useState} from 'react';


export default function Form() {
  const initialState: StateSupplier = {message:null, errors: {}};
  const [state, formAction] = useActionState(createSupplier, initialState);
  const [notes, setNotes] = useState('');
  const characterLimit = 128;

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement> ) => {
    setNotes(event.target.value);
  };

  return (
    <form action={formAction}>
      <div className="flex items-stretch justify-center">
        <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">
          {/* Supplier Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Corporate Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  step="0.01"
                  placeholder="Enter corporate name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Supplier email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  step="0.01"
                  placeholder="Enter e-mail"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Supplier phone */}
          <div className="mb-4">
            <label htmlFor="phone_main" className="mb-2 block text-sm font-medium">
              Phone
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="phone_main"
                  name="phone_main"
                  type="text"
                  step="0.01"
                  placeholder="Enter phone number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Supplier address */}
          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Address
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address"
                  name="address"
                  type="text"
                  step="0.01"
                  placeholder="Enter address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <HomeModernIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Supplier url */}
          <div className="mb-4">
              <label htmlFor="address" className="mb-2 block text-sm font-medium">
                URL
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="url"
                    name="url"
                    type="text"
                    step="0.01"
                    placeholder="Enter url"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* vat */}
            <div className="mb-4">
              <label htmlFor="address" className="mb-2 block text-sm font-medium">
                VAT
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="vat"
                    name="vat"
                    type="text"
                    step="0.01"
                    placeholder="Enter url"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Tax code */}
            <div className="mb-4">
              <label htmlFor="address" className="mb-2 block text-sm font-medium">
                Tax code
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="tax code"
                    name="tax code"
                    type="text"
                    step="0.01"
                    placeholder="Enter url"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>
        </div>


        <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">
          {/* Contact Name */}
          <div className="mb-4">
            <label htmlFor="contact" className="mb-2 block text-sm font-medium">
              Contact Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  step="0.01"
                  placeholder="Enter contact name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Contact Number
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  step="0.01"
                  placeholder="Enter contact phone"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

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

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/suppliers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Supplier</Button>
      </div>
    </form>
  );
}
