import Form from '@/app/ui/machinery/create-form';
import Breadcrumbs from '@/app/ui/machinery/breadcrumbs';
import {fetchMachineryTypes, fetchSupplierByName} from '@/app/lib/db/data';
import {Suspense} from 'react';
import Search from '@/app/ui/machinery/search-machinery'
import DropDown from '@/app/ui/machinery/search-dropdown'


export default async function Page({
    searchParams,
}:{
    searchParams?: {
        supplier?: string;
        page?: string;
        selected?: string;
    };
}) {
    
    const machineryTypes = await fetchMachineryTypes();
    const search = searchParams?.supplier || null;
    const suppliers = await fetchSupplierByName(search);
    const selectedSupplier = searchParams?.selected || null;

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Machinery', href: '/dashboard/machinery'},
                {
                    label: 'Add Machine',
                    href: '/dashboard/machinery/create',
                    active: true,
                },
            ]}/>
            <Search placeholder='Search for the machine owner'/>
            <Suspense>
                <DropDown query={suppliers}/>
            </Suspense>
            <Form machineryTypes={machineryTypes} selectedSupplier={selectedSupplier}/> {/*ts complains but we will do the type gymnastics a little later*/}
        </main>
    )
}