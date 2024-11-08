'use client'

import Script from 'next/script';
import { useState, Dispatch, SetStateAction } from 'react';
import Viewport from '@/app/ui/tender-packages/Viewport';

interface Viewer {
    urn: string;
    setViewer: Dispatch<SetStateAction<any>>;
    selectedView?: any | undefined;
}

export default function Viewer({urn, setViewer, selectedView = undefined}: Viewer) {
    
    const [isAutodeskLoaded, setAutodeskIsLoaded] = useState(false);

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
                width: '100%',
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1
            }}> {/* some trickery but works. 104.5 is the height of the header of the page */}
                {isAutodeskLoaded ? (
                    <Viewport urn={urn} setViewer={setViewer} superset={selectedView}/>
                ) : (
                    null
                )}
            </div>
        </div>
        </>
    )

}