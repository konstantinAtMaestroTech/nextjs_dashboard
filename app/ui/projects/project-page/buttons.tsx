'use client';

import { TrashIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import {deleteClientView} from '@/app/lib/db/actions';
import Link from 'next/link';

export function DeleteClientView({ id }: { id: string }) {

  const deleteClientViewWithId = deleteClientView.bind(null, id);

  return (
    <form action={deleteClientViewWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ShowSupersets({ ssid, setShow, show }: { ssid: string, setShow: any, show: boolean }) {

  function handleClick(id: string) {
    show ? setShow(false) : setShow(true)
  }

  return (
    <button id={ssid} className="rounded-md border p-2 hover:bg-gray-100" onClick={(e) => {handleClick(ssid)}}>
      <span className="sr-only">Delete</span>
      {show ? (<ChevronUpIcon className="w-5" />) : (<ChevronDownIcon className="w-5" />)}
    </button>
  );

}

export function CreateSuperset({ viewId }: { viewId: string, setShow: any, show: boolean }) {

  return (
    <Link href={`/client/superset/edit/${viewId}`} className="text-gray-500 hover:text-gray-700 underline">
      <button id={viewId} className="rounded-md border p-2 hover:bg-gray-100">
        <PlusCircleIcon className="w-5" />
      </button>
    </Link>
  );

}

