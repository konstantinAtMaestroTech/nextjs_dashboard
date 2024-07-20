'use client'

// there is no need for the top part of the page to be client rendered

import Image from 'next/image';
import Script from 'next/script';
import launchViewer from '@/app/lib/AutodeskViewer/ViewerLaunch';

// Declare Autodesk as a global variable
declare global {
    interface Window {
      Autodesk: any;
    }
}

export default function Page({params}:{params: {id: string}}) {
    return (
        <main>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"></link>
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"/>
            <Script src="https://threejs.org/build/three.js"/>
            <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" onLoad={()=>{
                var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFlc3Ryby10ZXN0LWJ1Y2tldC90ZXN0LnJ2dA';
                console.log(window.Autodesk);
                launchViewer('viewer', documentId); // we need to implement server actions somewhere around here not to expoe the autodesk api credentials to the client
            }}/>
            <div className="m-4 flex items-center justify-between">
                <Image 
                src='/Logo_Extended.png'
                width={200}
                height={152}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
                />
                <div className="flex flex-col justify-center rounded-lg">
                    <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                        <strong>Mondadori Campus</strong>
                    </p>
                    <p className="flex-1 md:text-right overflow-hidden text-ellipsis">
                        Floor 1
                    </p>
                </div>
            </div>
            <div id="viewer" className="absolute w-full h-full bg-gray-50">
            </div>
        </main>
    );
}