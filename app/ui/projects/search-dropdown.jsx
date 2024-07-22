import SelectSupplier from '@/app/ui/projects/select-supplier-button'

export default function DropDown ({query, setSelectedSuppliers}) {

  return (
    <div className="w-full rounded-md bg-gray-50 pt-0 pb-4 md:pb-6">
      <ul className="left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white">
        {query.map((supplier, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
          >
            {supplier.name}
            <SelectSupplier supplierName={supplier.name} setSelectedSuppliers={setSelectedSuppliers}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

