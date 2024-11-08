import ClientViews from '@/app/ui/projects/new-project-page/ClientViews';
import TenderPackages from '@/app/ui/projects/new-project-page/tender-packages/TenderPackages';
import AssemblyControl from '@/app/ui/projects/new-project-page/assembly-control/AssemblyControl'
import {Suspense} from 'react';
import ModeLoading from '@/app/ui/projects/new-project-page/Fallbacks/ModeLoading';
import { Session } from 'next-auth';

interface ModeViewport {
    id: string;
    currentMode: string;
    session: Session | null
}

export default async function ModeViewport({id, currentMode, session}: {id: string, currentMode: string, session: Session | null}) {

    // this thing here is just to have a single container for different modes and not to overload the
    // main page

    // the pages are deconstructed here not to carry around irrelevant information

    return (
        <>
            {currentMode === 'client' && 
            <Suspense fallback = {<ModeLoading />}>
                <ClientViews id={id}/>
            </Suspense>
            }
            {currentMode === 'tender' && 
            <Suspense fallback = {<ModeLoading />}>
                <TenderPackages id={id} session={session}/>    
            </Suspense>
            }
            {currentMode === 'assembly' && 
            <Suspense fallback = {<ModeLoading />}>
                <AssemblyControl id={id}/>    
            </Suspense>
            }
        </>
    )
}