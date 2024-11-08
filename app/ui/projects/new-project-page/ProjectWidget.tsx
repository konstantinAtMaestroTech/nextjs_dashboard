import WidgetSelector from "@/app/ui/projects/new-project-page/WidgetSelector";
import WidgetViewport from '@/app/ui/projects/new-project-page/WidgetViewport';

export default async function ProjectWidget(props: any) {

    console.log('props from the projectWidget', props);
    const {project, currentWidget} = props

    return (
        <>
            <div className="flex items-center justify-center text-sm p-2 bg-gray-50">
                <span>{project[0].name.toUpperCase()}</span>
            </div>
            <WidgetSelector />
            <WidgetViewport project={project} currentWidget={currentWidget} />
        </>
    )
}