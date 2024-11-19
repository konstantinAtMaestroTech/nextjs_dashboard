async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/adsk/auth/token');
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

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        window.Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
            const config = {
                extensions: [
                    'Autodesk.DocumentBrowser',
                    'Autodesk.BoxSelection',
                    'Autodesk.Viewing.MarkupsCore',
                    /* 'Autodesk.Viewing.MarkupsGui' */
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('dark-theme');
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {

            // setting up the Edit2D
            console.log('Autodesk.Edit2D extension loading...');
            viewer.loadExtension('Autodesk.Edit2D').then(edit2d => {
                edit2d.registerDefaultTools();

                const ctx = edit2d.defaultContext;
                ctx.layer;
                ctx.gizmoLayer;
                ctx.undoStack;
                ctx.selection;
                ctx.snapper;

               /*  ctx.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.BEFORE_ACTION, beforeAction);
                ctx.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.BEFORE_ACTION, afterAction);

                ctx.selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED, onSelectionChanged);
                ctx.selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_HOVER_CHANGED, onHoverChanged); */

                /* ctx.selection.selectOnly(myItem.shape);
                ctx.selection.setHoverID(shape.id); */

                resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
            }).catch(reject);
        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        window.Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}


export function loadModelSuperset(viewer, urn, superset=undefined) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {

            // the options work only when the passed dbIds is a leafNode i.e the node representing geometry itself

            viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()).then(async function (model) {
                await afterViewerEvents(
                    viewer,
                    [
                      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT
                    ]
                );

                if (superset) {
                    const {state, measurements} = superset.data;
                    let measureExtension = viewer.getExtension("Autodesk.Measure");
                    let sectionExtension = viewer.getExtension("Autodesk.Section")
                    // delete all previous extensions
                    
                    measureExtension.deleteMeasurements();
                    sectionExtension.activate();
                    sectionExtension.deactivate();

                    viewer.restoreState(state);
                    measureExtension.setMeasurements(measurements);
                }
            })
            
            resolve(viewer);

        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        window.Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}




// viewer partial loading https://aps.autodesk.com/blog/minimizing-viewer-workloads-loading-models-partially-selected-components-and-features-only

export function loadOneNode(viewer, urn, selectedComponent) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {

            // the options work only when the passed dbIds is a leafNode i.e the node representing geometry itself

            const options = {
                ids: selectedComponent.leaf_nodes
            };
            viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry(), options).then(async function (model) {
                await afterViewerEvents(
                    viewer,
                    [
                      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT
                    ]
                );

                viewer.fitToView(selectedComponent.leaf_nodes);
            })
            
            resolve(viewer);

        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        window.Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function afterViewerEvents(viewer, events) {
    let promises = [];
    events.forEach(function (event) {
        promises.push(new Promise(function (resolve, reject) {
            let handler = function () {
                viewer.removeEventListener(event, handler);
                console.log(`Removed event listener for ${event}`)
                resolve();
            }
            viewer.addEventListener(event, handler);
            console.log(`Added event listener for ${event}`)
        }));
    });

    return Promise.all(promises)
}