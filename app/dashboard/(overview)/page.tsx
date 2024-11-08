import { lusitana } from '@/app/ui/font';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton, CardSkeleton } from '@/app/ui/skeletons';
import {auth} from "@/auth";

export default async function Page()  {

    const session = await auth()
    if (!session) return null;
    console.log(session);

    return (
        <main className="flex flex-col flex-1">
            <div className={`mb-2 flex h-20 items-end justify-end rounded-md bg-[#ff0d0d] p-4 md:h-40 text-white`}>
            <p className="text-[36px]">Welcome back, {session.user?.name?.split(" ")[0]}</p>
            </div>
            <h1 className={`mb-4 text-xl mb:text-2xl`}>
                Dashboard
            </h1>
        </main>
    );
}
