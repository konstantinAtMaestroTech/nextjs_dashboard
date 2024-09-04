export function handleMentionClick(event: MouseEvent, viewer: any, views: any): void {
    const target = event.target as HTMLElement;
    if (target && target.id.includes('view_')) {

        console.log('a view is clicked. The viewer is ', viewer);

        const chunks = target.id.split('_');
        const id = chunks[chunks.length - 1];

        const selectedView = views.find(view => view.id === id);

        if (selectedView) {

            console.log(selectedView);
            const {state, measurements} = selectedView.data;
            let measureExtension = viewer.getExtension("Autodesk.Measure");

            viewer.restoreState(state);
            measureExtension.setMeasurements(measurements);

        } else {
            console.log('Item not found');
        }

    } else if (target && target.id.includes('user-')) {
        console.log('User is clicked');
    }
}