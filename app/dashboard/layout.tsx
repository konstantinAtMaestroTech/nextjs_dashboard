import SideNav from "@/app/ui/dashboard/sidenav";

export const experimental_ppr = true;

export default function Layout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow pl-6 pr-6 pb-6 md:overflow-y-auto md:pl-12 md:pr-12 md:pb-12 md:pt-4">{children}</div>
        </div>
    )
}