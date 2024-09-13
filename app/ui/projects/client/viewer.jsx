'use client'

import Script from 'next/script';
import {useState} from 'react';
import Viewport from '@/app/ui/projects/client/viewport'
import { SessionProvider } from 'next-auth/react';

export default function Viewer(props) {

    const [isAutodeskLoaded, setAutodeskIsLoaded] = useState(false)
    const {urn, setViewer, activeMenu, setActiveMenu} = props

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
                top: 0,
                width: '100%',
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1
            }}> {/* some trickery but works. 104.5 is the height of the header of the page */}
                {isAutodeskLoaded ? (
                    <SessionProvider>
                        <Viewport urn={urn} setViewer={setViewer} activeMenu={activeMenu} setActiveMenu={setActiveMenu}></Viewport>
                    </SessionProvider>) : null}
            </div>
        </div>
        </>
    )
}