import { fetchSuppliersByProjectId, fetchUsersByProjectId } from "@/app/lib/db/data"
import Link from 'next/link';

export async function OverviewWidget(props:any) {
    const {project} = props

    return (<>
        <table className="hidden min-w-full text-gray-900 md:table">
            <tbody className="bg-white">
                <tr
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>Client</p>
                        </div>
                    </td>
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>{project[0].client}</p>
                        </div>
                    </td>
                </tr>
                <tr
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>Address</p>
                        </div>
                    </td>
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>{project[0].address}</p>
                        </div>
                    </td>
                </tr>
                <tr
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>Created</p>
                        </div>
                    </td>
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <p>{project[0].created_at.toDateString()}</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </>)
}

export async function TeamWidget(props:any) {
    
    const {id} = props;
    const team = await fetchUsersByProjectId(id);

    return (
        <>
            {team?.map((user, index) => (
                <div key={index} className="flex bg-white p-2 justify-between items-center">
                    <div
                            className="w-8 h-8 bg-cover bg-center rounded-full border-2 border-gray-300 hover:border-gray-500"
                    />
                    <span className="block">{user.name}</span>
                </div>
            ))}
        </>
    )

}

export async function SupplierWidget(props:any) {
    const {id} = props;
    const suppliers = await fetchSuppliersByProjectId(id);
    
    return (
        <>
            {suppliers?.map((supplier, index) => (
                <Link
                href={`/dashboard/suppliers/${supplier.id}/info`}
                target="_blank"
                >
                <div key={index} className="flex bg-white p-2 justify-between items-center hover:bg-[#ff0d0d] hover:text-white">
                    <span className="block">{supplier.name}</span>
                    <span className="block">{supplier.supplier_status}</span>
                </div>
                </Link>
            ))}
        </>
    ) 
}