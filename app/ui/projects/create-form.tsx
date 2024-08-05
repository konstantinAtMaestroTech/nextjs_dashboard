'use client';

import Link from 'next/link';
import {
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createProject, StateProject} from '@/app/lib/db/actions';
import {useActionState, useState} from 'react';
import Search from '@/app/ui/projects/search'
import DropDown from '@/app/ui/projects/search-dropdown'
import Selected from '@/app/ui/projects/selected-items'


export default function Form({suppliers, team}: {suppliers: any[] | null, team: any[] | null}) {

  const initialState: StateProject = {message:null, errors: {}};
  const [state, formAction] = useActionState(createProject, initialState);
  const [selectedSuppliers, setSelectedSuppliers] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any[]>([]);
  console.log('selected suppliers', selectedSuppliers);
  console.log('selected team', selectedTeam);

  return (
    <form action={formAction}>
      <div className="flex items-stretch justify-center">
        <div className="w-full rounded-md bg-gray-50 p-4 md:p-6">
          {/* Project title */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Project Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder='Project title'
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Search placeholder='Search for the team members' searchParam='team' label='Team'/>
          <DropDown query={team} setSelection={setSelectedTeam} searchParam='team'/>
          <Selected selection={selectedTeam} setSelection={setSelectedTeam} inputName='team' />
          <Search placeholder='Search for the suppliers' searchParam='supplier' label='Suppliers'/>
          <DropDown query={suppliers} setSelection={setSelectedSuppliers} searchParam='supplier'/>
          <Selected selection={selectedSuppliers} setSelection={setSelectedSuppliers} inputName='supplier' /> 
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/projects"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
