import Breadcrumbs from "@/app/ui/breadcrumbs";
import {fetchProjectById} from '@/app/lib/db/data';
import {Suspense} from 'react';
import ModeSelector from '@/app/ui/projects/new-project-page/ModeSelector';
import ModeViewport from "@/app/ui/projects/new-project-page/ModeViewport";
import ProjectWidget from "@/app/ui/projects/new-project-page/ProjectWidget";
import ProjectActivity from "@/app/ui/projects/new-project-page/ProjectActivity";
import ChatLoading from '@/app/ui/projects/new-project-page/Fallbacks/ChatLoading';
import {auth} from '@/auth';

// use of search params lead to the server calls on each action. I ma not sure wheteher this strategy
// is better than client side rendering. I would expect next js to cache the data but i am not sure 
// whether it is happening in reality

export default async function Page ({params, searchParams}:{params: {id: string}, searchParams?: {clpg?:string, mode?: string, wmode?: string}}) {

    const id = params.id;
    const currentMode = searchParams?.mode || 'client';
    const currentWidget = searchParams?.wmode || 'overview'
    const project = await fetchProjectById(id);
    const session = await auth();

    return (
        <div className="flex w-full">
            <div className="flex flex-col flex-grow min-h-0">
                <Breadcrumbs 
                    breadcrumbs = {[
                        {label: 'Project', href: '/dashboard/projects'},
                        {label: project[0].name, href: `/dashboard/projects/${id}`, active: true}
                    ]}
                />
                <div className="flex flex-col flex-grow min-h-0">
                    <ModeSelector />
                    <ModeViewport id={id} currentMode={currentMode} session={session}/>
                </div>
            </div>
            <div className="flex flex-grow gap-2">
                <div className="flex flex-col flex-1 gap-2 w-1/3">
                    <ProjectWidget project={project} currentWidget={currentWidget}/>
                    <Suspense fallback={<ChatLoading />}>
                        <ProjectActivity id={id} session={session}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}