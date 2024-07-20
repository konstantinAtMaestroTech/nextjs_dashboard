import { UpdateSupplier, DeleteSupplier, InfoSupplier } from '@/app/ui/suppliers/buttons';
import { fetchFilteredMachinery } from '@/app/lib/db/data';
import Link from 'next/Link';

export default async function MachinesTable({
  query,
  currentPage,
}){
  const machines = await fetchFilteredMachinery(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {machines?.map((machine) => (
              <div
                key={machine.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="mb-2 flex items-center">
                      <p>{machine.model}</p>
                    </div>
                    <p className="text-sm text-gray-500">{machine.prodeucer_website}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{machine.type}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateSupplier id={machine.id} />
                    <DeleteSupplier id={machine.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Machine model
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Producer website
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {machines?.map((machine) => (
                <tr
                  key={machine.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{machine.model}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={machine.producer_website} passHref={true} className="text-gray-500 hover:text-gray-700 underline">
                      <p>{machine.producer_website}</p>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {machine.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSupplier id={machine.id} />
                      <DeleteSupplier id={machine.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
