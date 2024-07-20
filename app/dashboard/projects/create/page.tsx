import Form from '@/app/ui/projects/create-form';
import Breadcrumbs from '@/app/ui/projects/breadcrumbs';
import {fetchSupplierByName} from '@/app/lib/db/data';

export default async function Page({
    searchParams,
}:{
    searchParams?: {
        supplier?: string;
        page?: string;
        selected?: string[];
    };
}) {
    
    const search = searchParams?.supplier || null;
    const suppliers = await fetchSupplierByName(search);
    const selectedSuppliers = searchParams?.selected || null;

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Projects', href: '/dashboard/proejects'},
                {
                    label: 'Create Project',
                    href: '/dashboard/projects/create',
                    active: true,
                },
            ]}/>
            <Form suppliers={suppliers} selectedSupplier={selectedSuppliers}/> {/*ts complains but we will do the type gymnastics a little later*/}
        </main>
    )
}