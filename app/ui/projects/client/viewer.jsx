'use client'

import Script from 'next/script';
import {useState} from 'react';
import Viewport from '@/app/ui/projects/client/viewport'

export default function Viewer(props) {

    const [isAutodeskLoaded, setAutodeskIsLoaded] = useState(false)

    return (
        <>
        <Script 
            src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
            onLoad={() => {
            console.log('Autodesk is loaded, ',Autodesk)
            window.Autodesk = Autodesk
            setAutodeskIsLoaded(true)
            }}
        ></Script>
        <div>
            <div id="viewer" className="absolute" style={{ 
                height: 'calc(100vh - 104.5px)', 
                top: '104.5px',
                width: '75%',
                right: 0
            }}> {/* some trickery but works. 104.5 is the height of the header of the page */}
                {isAutodeskLoaded ? <Viewport urn={props.urn} setViewer={props.setViewer}></Viewport> : null}
            </div>
        </div>
        </>
    )
}