import Breadcrumbs from '@/app/ui/projects/breadcrumbs';
import {fetchProjectById, fetchUsersByProjectId, fetchSuppliersByProjectId, fetchViewsPages} from '@/app/lib/db/data';
import {notFound} from 'next/navigation';
import ClientViewForm from '@/app/ui/projects/project-page/create-client-view';
import TitleTab from '@/app/ui/projects/project-page/title-tab';
import SubtitleTab from '@/app/ui/projects/project-page/subtitle-tab';
import {SuppliersTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import ViewsTable from '@/app/ui/projects/project-page/client-views-table';
import Pagination from '@/app/ui/suppliers/pagination';

export default async function Page({params, searchParams}:{params: {id: string}, searchParams?: {page?: string; };}) {
    const id = params.id;

    const fetchProjectByIdPromise = fetchProjectById(id);
    const fetchUsersByProjectIdPromise = fetchUsersByProjectId(id);
    const fetchSuppliersByProjectIdPromise = fetchSuppliersByProjectId(id);

    const currentPage = Number(searchParams?.page) || 1;
    const totalViewsPages = await fetchViewsPages(id);

    const data = await Promise.all([
        fetchProjectByIdPromise,
        fetchUsersByProjectIdPromise,
        fetchSuppliersByProjectIdPromise
    ]);

    const [project, users, suppliers] = data

    if (!data) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Projects', href: '/dashboard/projects'},
                    {label: project[0].name, href: `/dashboard/projects/${id}`, active: true},
                ]}
            />
            <Suspense key={id + currentPage} fallback={<SuppliersTableSkeleton />}>
                <ViewsTable query={id} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalViewsPages} />
            </div>
            <TitleTab title={'Utilities'} />
            <SubtitleTab subtitle={'Create lient view'} />
            <ClientViewForm projectId={id}/>
        </main>
    );
}