import Form from '@/app/ui/suppliers/edit-form';
import Breadcrumbs from '@/app/ui/suppliers/breadcrumbs';
import {fetchSuppliersById} from '@/app/lib/db/data';
import {notFound} from 'next/navigation';

export default async function Page({params}:{params: {id: string}}) {
    const id = params.id;
    const supplier =await fetchSuppliersById(id);
    if (!supplier) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Suppliers', href: '/dashboard/suppliers'},
                    {label: 'Edit Supplier', href: `/dashboard/suppliers/${id}/edit`, active: true},
                ]}
            />
            <Form supplier={supplier}/>
        </main>
    );
}