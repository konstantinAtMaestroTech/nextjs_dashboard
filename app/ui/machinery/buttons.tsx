import { InformationCircleIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {deleteMachine} from '@/app/lib/db/actions';

export function CreateMachine() {
  return (
    <Link
      href="/dashboard/machinery/create"
      className="flex h-10 items-center rounded-lg bg-[#646e6e] px-4 text-sm font-medium text-white transition-colors hover:bg-[#ff0d0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Machine</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMachine({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/machinery/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function InfoMachine({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/machinery/${id}/info`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <InformationCircleIcon className="w-5" />
    </Link>
  );
}

export function DeleteMachine({ id }: { id: string }) {

  const deleteMachineWithId = deleteMachine.bind(null, id);

  return (
    <form action={deleteMachineWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
