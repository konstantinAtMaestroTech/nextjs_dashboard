import Form from '@/app/ui/projects/create-form';
import Breadcrumbs from '@/app/ui/projects/breadcrumbs';
import {fetchSupplierByName, fetchUserByName} from '@/app/lib/db/data';

export default async function Page({
    searchParams,
}:{
    searchParams?: {
        supplier?: string;
        team?:string;
        page?: string;
    };
}) {
    
    const supplierSearch = searchParams?.supplier || null;
    const teamSearch = searchParams?.team || null;
    const suppliers = await fetchSupplierByName(supplierSearch);
    const team = await fetchUserByName(teamSearch);

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Projects', href: '/dashboard/projects'},
                {
                    label: 'Create Project',
                    href: '/dashboard/projects/create',
                    active: true,
                },
            ]}/>
            <Form suppliers={suppliers} team={team}/> {/*ts complains but we will do the type gymnastics a little later*/}
        </main>
    )
}