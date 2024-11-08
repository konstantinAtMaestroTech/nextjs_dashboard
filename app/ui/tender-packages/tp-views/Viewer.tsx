'use client'

import Script from 'next/script';
import { useState, Dispatch, SetStateAction, useEffect} from 'react';
import Viewport from '@/app/ui/tender-packages/Viewport';
import { ComponentData } from '@/app/lib/tender-package/actions';

// this is almost identical copy of the viewer module that i implement acroos the app. OS it might be 
// refactored 

interface Viewer {
    urn: string;
    selectedComponent: ComponentData;
    setViewer: Dispatch<SetStateAction<any>>
}

export default function Viewer({urn, selectedComponent, setViewer}: Viewer) {
    
    const [isAutodeskLoaded, setAutodeskIsLoaded] = useState(false);

    useEffect(() => {console.log('the selected geometry is ', selectedComponent)}, [selectedComponent])

    return (
        <>
        <Script 
            src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
            onLoad={() => {
            window.Autodesk = Autodesk
            setAutodeskIsLoaded(true)
            }}
        ></Script>
        <div>
            <div id="viewer" className="absolute" style={{ 
                height: 'calc(100vh - 104.5px)', 
                top: 0,
                width: '80%',
                bottom: 0,
                left: 0,
                zIndex: 1
            }}> {/* some trickery but works. 104.5 is the height of the header of the page */}
                {isAutodeskLoaded ? (
                    <Viewport urn={urn} setViewer={setViewer} selectedComponent={selectedComponent}/>
                ) : (
                    null
                )}
            </div>
        </div>
        </>
    )

}