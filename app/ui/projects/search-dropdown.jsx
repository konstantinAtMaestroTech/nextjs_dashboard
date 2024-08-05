import Select from '@/app/ui/projects/select-button'

export default function DropDown ({query, setSelection, searchParam}) {

  return (
    <div className="w-full rounded-md bg-gray-50 pt-0 pb-4 md:pb-6">
      <ul className="left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white">
        {query.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
          >
            {item.surname ? item.name + ' ' + item.surname : item.name}
            <Select name={item.name} setSelection={setSelection} searchParam={searchParam}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

