import Link from 'next/link';
import {
  LinkIcon,
  PhoneIcon,
  AtSymbolIcon,
  UserCircleIcon,
  PencilSquareIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';


export default function Form({
    supplier,
  }: {
    supplier: any;
  }) {
  return (
    <div>
        <div className="flex items-stretch justify-center">
            <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">
            {/* Supplier Name */}
            <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Corporate Name
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.name}</span>
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Supplier email */}
            <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                E-mail
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="email"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.email}</span>
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Supplier phone */}
            <div className="mb-4">
                <label htmlFor="phone_main" className="mb-2 block text-sm font-medium">
                Phone
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.phone}</span>
                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Supplier address */}
            <div className="mb-4">
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                Address
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="address"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.name}</span>
                    <HomeModernIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Supplier url */}
            <div className="mb-4">
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                URL
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="url"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.url}</span>
                    <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>
            </div>
            <div className="w-1/2 rounded-md bg-gray-50 p-4 md:p-6">
            {/* Contact Name */}
            <div className="mb-4">
                <label htmlFor="contact" className="mb-2 block text-sm font-medium">
                Contact Name
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.contact}</span>
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Contact Number */}
            <div className="mb-4">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Contact Number
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <span
                    id="name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.contact_number}</span>
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
                <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                    Notes
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                    <div
                    id="notes"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    >{supplier.notes}</div>
                    <PencilSquareIcon className="pointer-events-none absolute left-3 top-0 h-[18px] w-[18px] translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
            <Link
            href="/dashboard/suppliers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
            Cancel
            </Link>
        </div>
    </div>
  );
}
