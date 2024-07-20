
import {fetchSupplierByName} from '@/app/lib/db/data';
import SelectSupplier from '@/app/ui/machinery/select-supplier-button'

export default async function DropDown ({query}) {

  return (
    <div className="w-full rounded-md bg-gray-50 pt-0 pr-4 pb-4 pl-4 md:pr-6 md:pb-6 md:pl-6">
      <ul className="left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white">
        {query.map((supplier, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
          >
            {supplier.name}
            <SelectSupplier supplierName={supplier.name} />
          </li>
        ))}
      </ul>
    </div>
  )
}

