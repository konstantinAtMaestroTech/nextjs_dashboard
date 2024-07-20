/* global Autodesk, THREE */
import Client from '@/app/lib/AutodeskViewer/Auth.js'

export default async function launchViewer(div, urn) {

    var viewer;

    var getToken = {accessToken: Client.getAccessToken()};

    getToken.accessToken.then((token) => {
        console.log('token', token)
        var options = {
            'env': "AutodeskProduction2",
            'accessToken': token.access_token
        };

        Autodesk.Viewing.Initializer(options, function() {
            var htmlDiv = document.getElementById(div);
            viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);

            var startedCode = viewer.start();
            if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
            }
            console.log('Initialization complete, loading a model next...');
        });

        Autodesk.Viewing.Document.load(urn, onDocumentLoadSuccess, onDocumentLoadFailure);

        async function onDocumentLoadSuccess(viewerDocument) {
            var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(viewerDocument, defaultModel, {}).then(console.log(viewer));
            return viewer;
        }

        function onDocumentLoadFailure() {
            console.error('Failed fetching Forge manifest');
        };
    })

}