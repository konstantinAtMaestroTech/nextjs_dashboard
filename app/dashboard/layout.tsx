import SideNav from "@/app/ui/dashboard/sidenav";

export const experimental_ppr = true;

export default function Layout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex flex-col h-screen md:flex-row">
            <div className="w-full flex-none md:w-40">
                <SideNav />
            </div>
            <div className="flex w-full h-screen pl-2 pr-2 pb-6 md:pl-2 md:pr-2 md:pb-12 md:pt-4">{children}</div>
        </div>
    )
}