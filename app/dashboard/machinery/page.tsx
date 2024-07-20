import Pagination from '@/app/ui/suppliers/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/machinery/table';
import {lusitana} from '@/app/ui/font';
import {SuppliersTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import { CreateMachine} from '@/app/ui/machinery/buttons';
import {fetchMachinesPages} from '@/app/lib/db/data'

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
    const totalPages = await fetchMachinesPages(query);

    return (
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
                <h1 className={`${lusitana.className} text-2xl`}>Machinery</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search machine models and types"/>
                <CreateMachine />
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