import { TrashIcon } from '@heroicons/react/24/outline';
import {deleteClientView} from '@/app/lib/db/actions';

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