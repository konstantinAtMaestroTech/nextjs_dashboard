/* global Autodesk, THREE */

export default async function launchViewer(div, urn) {

    async function getAccessToken(callback) {
        try {
            // just offset one server call away. I hate it. This is extremely stupid but let me do it this way now
            const resp = await fetch(`/api/auth/token`);
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const { access_token, expires_in } = await resp.json();
            callback(access_token, expires_in);
        } catch (err) {
            alert('Could not obtain access token. See the console for more details.');
            console.error(err);
        }
    }

    var htmlDiv = window.document.getElementById(div);

    await Autodesk.Viewing.Initializer({ env: 'AutodeskProduction2', api: 'streamingV2', getAccessToken }, function () {
        const config = {
            extensions: ['Autodesk.DocumentBrowser']
        };
        const viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config);
        viewer.start();
        viewer.setTheme('light-theme');
    });

    Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);

    async function onDocumentLoadSuccess(viewerDocument) {
        var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(viewerDocument, defaultModel, {}).then(console.log(viewer));
        return viewer;
    }

    function onDocumentLoadFailure() {
        console.error('Failed fetching Forge manifest');
    };
}