'use client'

import {
    useRef, 
    useEffect, 
    useState,
    Dispatch,
    SetStateAction
} from 'react';
import { initViewer, loadModel, loadOneNode, loadModelSuperset } from '@/app/lib/AutodeskViewer/viewer';
import { ComponentData } from '@/app/lib/tender-package/actions';


interface Viewport {
    urn: string;
    setViewer: Dispatch<SetStateAction<any>>;
    selectedComponent?: ComponentData | undefined // this is a kwarg because i reuse the viewport. Not in all applications selectedComponent is passed
    superset?: any | undefined;
}

export default function Viewport({urn, setViewer, selectedComponent = undefined, superset=undefined}: Viewport) {

    const previewRef = useRef(null);
    const [notification, setNotification] = useState('');

    async function statusCheck(viewer:any, urn:string) {
        if (window.statusCheckTimout) {
            clearTimeout(window.statusCheckTimout);
            delete window.statusCheckTimout;
        }
        try {
            const resp = await fetch(`/api/models/${urn}/status`);
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const status = await resp.json();
            console.log('The model status is ', status);
            switch (status.status) {
                case 'n/a':
                    showNotification(`Model has not been translated.`);
                    break;
                case 'inprogress':
                    showNotification(`Model is being translated (${status.progress})...`);
                    window.statusCheckTimout = setTimeout(statusCheck, 5000, viewer, urn);
                    break;
                case 'failed':
                    showNotification(`Translation failed. <ul>${status.messages.map(msg => `<li>${JSON.stringify(msg)}</li>`).join('')}</ul>`);
                    break;
                default:
                    clearNotification();
                    // this resolves the issue with the overlayed elements selection
                    viewer.getExtension('Autodesk.BoxSelection').boxSelectionTool.useGeometricIntersection = true;
                    if (superset) {
                        loadModelSuperset(viewer, urn, superset)
                    } else if (selectedComponent) {
                        loadOneNode(viewer, urn, selectedComponent)
                    } else {
                        loadModel(viewer, urn);
                    }
                    break; 
            }
        } catch (err) {
            alert('Could not load model. See the console for more details.');
            console.error(err);
        }
    }

    const showNotification = (message: string) => {
        setNotification(message);
    };
    
    const clearNotification = () => {
    setNotification('');
    };

    useEffect(() => {
        // Step 3: Use the ref to pass the container to initViewer
        if (previewRef.current) {
          initViewer(previewRef.current).then(viewer => {
            setViewer(viewer)
            statusCheck(viewer, urn)
          });
        }
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
            <div id="preview" ref={previewRef} style={{ width: '100%', height: '100%' }} />
            <div
                id="overlay"
                style={{
                    display: notification ? 'flex' : 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                {notification && (
                    <div className="notification">
                        {notification}
                    </div>
                )}
            </div>
        </>
    )
}