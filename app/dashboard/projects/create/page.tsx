import Form from '@/app/ui/projects/create-form';
import Breadcrumbs from '@/app/ui/projects/breadcrumbs';
import {fetchSupplierByName} from '@/app/lib/db/data';
import DropDown from '@/app/ui/projects/search-dropdown'

export default async function Page({
    searchParams,
}:{
    searchParams?: {
        supplier?: string;
        page?: string;
    };
}) {
    
    const search = searchParams?.supplier || null;
    const suppliers = await fetchSupplierByName(search);
    console.log(suppliers);

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
            <Form suppliers={suppliers}/> {/*ts complains but we will do the type gymnastics a little later*/}
        </main>
    )
}