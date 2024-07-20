'use client'

import {
  UserGroupIcon,
  BriefcaseIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Projects', href: '/dashboard/projects', icon: BriefcaseIcon },
  {
    name: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: UserGroupIcon
  },
  {
    name: 'Machinery',
    href: '/dashboard/machinery',
    icon: WrenchScrewdriverIcon
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-[#646e6e] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-[#ff0d0d] text-black': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
