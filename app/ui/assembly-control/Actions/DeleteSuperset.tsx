import {deleteSuperset} from '@/app/lib/db/actions';
import { View } from '@/app/ui/assembly-control/utilities';
import {Dispatch, SetStateAction, useRef} from 'react';

export function DeleteSuperset({ clientViewId, supersetId, setViews }: {clientViewId: string, supersetId: string, setViews: Dispatch<SetStateAction<View[]>>}) {

  const deleteSupersetWithId = deleteSuperset.bind(null, clientViewId, supersetId);
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick(supersetId: string): void {
      setViews((prevState) => prevState.filter(view => view.id !== supersetId));
      formRef.current?.requestSubmit();
  }

  return (
    <form 
    ref={formRef}
    action={deleteSupersetWithId}
    >
      <button 
          className="rounded-md px-2 h-5 text-sm border bg-[#646e6e] border-[#646e6e] text-white"
          onClick={() => handleClick(supersetId)}
      >
        Delete
      </button>
    </form>
  );
}