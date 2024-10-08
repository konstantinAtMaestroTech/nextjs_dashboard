'use client';

import { TrashIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {deleteClientView} from '@/app/lib/db/actions';
import {useState} from 'react';
import Link from 'next/link';
import LoginFormClient from '@/app/ui/login-form-client'

export function DeleteClientView({ id, filename, urn }: { id: string, filename: string, urn:string }) {

  const deleteClientViewWithId = deleteClientView.bind(null, id, filename, urn);

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
    <button id={`show_superset_${ssid}`} className="rounded-md border p-2 hover:bg-gray-100" onClick={(e) => {handleClick(ssid)}}>
      <span className="sr-only">Delete</span>
      {show ? (<ChevronUpIcon className="w-5" />) : (<ChevronDownIcon className="w-5" />)}
    </button>
  );

}

export function CreateSuperset({ id }: { id: string, setShow: any, show: boolean }) {

  return (
    <Link href={`/client/superset/edit/${id}`} className="text-gray-500 hover:text-gray-700 underline">
      <button id={`create_superset_${id}`} className="rounded-md border p-2 hover:bg-gray-100">
        <PlusCircleIcon className="w-5" />
      </button>
    </Link>
  );

}


export function InviteUser({ id, title, subtitle }: { id: string, title: string, subtitle: string}) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInviteUser = (e) => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button id={`invite_${id}`} className="rounded-md border p-2 hover:bg-gray-100" onClick={handleInviteUser}>
        <UserPlusIcon className="w-5" />
      </button>
       {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="flex-col">
            <div className="flex justify-end">
              <button onClick={closeModal} className="p-2">
                <XMarkIcon className="w-5 text-white hover:text-gray-500" />
              </button>
            </div>
            <div className="flex-col bg-white p-4 rounded-md shadow-md">
              <LoginFormClient id={id} title={title} subtitle={subtitle}/>
            </div>
          </div>
        </div>
       )}
    </>
  );

}

