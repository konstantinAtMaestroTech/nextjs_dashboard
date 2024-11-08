import {Suspense} from 'react';
import WidgetLoading from '@/app/ui/projects/new-project-page/Fallbacks/WidgetLoading';
import {OverviewWidget, TeamWidget, ClientWidget, SupplierWidget} from '@/app/ui/projects/new-project-page/Widgets'

export default async function WidgetViewport (props: any) {

    const {project, currentWidget} = props;

    return (
        <>
            {currentWidget === 'overview' &&
                <Suspense fallback={<WidgetLoading />}>
                    <OverviewWidget project={project} />
                </Suspense>
            }
            {currentWidget === 'team' &&
                <Suspense fallback={<WidgetLoading />}>
                    <TeamWidget id={project[0].id} />
                </Suspense>
            }
            {currentWidget === 'supplier' && 
                <Suspense fallback={<WidgetLoading />}>
                    <SupplierWidget id={project[0].id} />
                </Suspense>
            }
        </>
    )
}