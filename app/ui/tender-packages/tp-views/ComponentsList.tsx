'use client'


import React, {useState, Dispatch, SetStateAction} from 'react';
import DownloadFile from "@/app/ui/tender-packages/tp-views/DownloadFile";
import { ComponentData } from '@/app/lib/tender-package/actions';

interface ComponentsList {
    components: ComponentData[],
    selectedComponent: ComponentData;
    setSelectedComponent: Dispatch<SetStateAction<ComponentData>>;
}

export default function ComponentsList({components, selectedComponent, setSelectedComponent}: ComponentsList) {

    if (components) {

        return (
            <div id="viewer" className="absolute" style={{ 
                height: 'calc(100vh - 104.5px)', 
                top: 0,
                width: '20%',
                bottom: 0,
                right: 0,
                zIndex: 1
            }}> {/* some trickery but works. 104.5 is the height of the header of the page */}
                {components.map((component) => (
                    <React.Fragment key={component.component_dbid}>
                        <DownloadFile component={component}/>
                    </React.Fragment>
                ))}
            </div>
    
        )

    }

}