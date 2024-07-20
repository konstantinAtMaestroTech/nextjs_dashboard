import Pagination from '@/app/ui/suppliers/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/suppliers/table';
import {lusitana} from '@/app/ui/font';
import {SuppliersTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import { CreateSupplier} from '@/app/ui/suppliers/buttons';
import {fetchSuppliersPages} from '@/app/lib/db/data'

export default async function Page ({
    searchParams,
}:{
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchSuppliersPages(query);

    return (
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
                <h1 className={`${lusitana.className} text-2xl`}>Suppliers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Suppliers, machinery, addresses..."/>
                <CreateSupplier />
            </div>
            <Suspense key={query + currentPage} fallback={<SuppliersTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}