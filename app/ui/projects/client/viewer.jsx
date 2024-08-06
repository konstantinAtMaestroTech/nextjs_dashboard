import Script from 'next/script';
import launchViewer from '@/app/lib/AutodeskViewer/ViewerLaunch';

// Declare Autodesk as a global variable

const viewerUrl = process.env.NEXT_PUBLIC_VIEWER_URL;

export default function Viewer({ urn }) {

    return (
        <div>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"></link>
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"/>
            <Script src="https://threejs.org/build/three.js"/>
            <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"/>
            <div id="viewer" className="absolute w-full h-full bg-gray-50">
                <iframe 
                    src={`${viewerUrl}/#${urn}`}
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none' }}
                ></iframe>
            </div>
        </div>
    )
}