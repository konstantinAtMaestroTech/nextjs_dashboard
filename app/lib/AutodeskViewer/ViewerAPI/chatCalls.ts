export function handleMentionClick(event: MouseEvent, viewer: any, views: any): void {
    const target = event.target as HTMLElement;
    if (target && target.id.includes('view_')) {

        console.log('clicked');
        const chunks = target.id.split('_');
        const id = chunks[chunks.length - 1];

        const selectedView = views.find(view => view.id === id);

        if (selectedView) {

            console.log(selectedView);
            const {state, measurements} = selectedView.data;
            let measureExtension = viewer.getExtension("Autodesk.Measure");
            let sectionExtension = viewer.getExtension("Autodesk.Section")
            // delete all previous extensions
            
            measureExtension.deleteMeasurements();
            sectionExtension.activate();
            sectionExtension.deactivate();

            viewer.restoreState(state);
            measureExtension.setMeasurements(measurements);

        } else {
            let measureExtension = viewer.getExtension("Autodesk.Measure");
            let sectionExtension = viewer.getExtension("Autodesk.Section");

            viewer.showAll()
            measureExtension.deleteMeasurements();
            sectionExtension.activate();
            sectionExtension.deactivate();

            viewer.setViewFromFile(viewer.model);
        }
    } else if (target && target.id.includes('selection_')) {

        console.log('clicked');
        const chunks = target.id.split('_');
        const selection_s = chunks[chunks.length - 1];

        const selection = JSON.parse(selection_s);
        console.log('Selection is ', selection);

        viewer.select(selection);
        viewer.fitToView(selection);
    }
}

