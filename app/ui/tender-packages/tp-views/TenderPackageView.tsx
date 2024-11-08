'use client'

import {useState} from 'react';
import { TPViewData } from '@/app/lib/db/data';
import Viewer from '@/app/ui/tender-packages/tp-views/Viewer'
import ComponentsList from '@/app/ui/tender-packages/tp-views/ComponentsList';
import { ComponentData } from '@/app/lib/tender-package/actions';

interface TenderPackageView {
    tp_view: TPViewData[],
    urn: string
}

export default function TenderPackageView({tp_view, urn}: TenderPackageView): JSX.Element {

    const components: ComponentData[] = JSON.parse(tp_view[0].components)

    const [selectedComponent, setSelectedComponent] = useState<ComponentData>(components[0]); // we can start from the first item or from the general model
    const [viewer, setViewer] = useState(null); // 

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 104.5px)', width: '100%' }}>
            <Viewer urn={urn} setViewer={setViewer} selectedComponent={selectedComponent}/>
            <ComponentsList components={components} selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
        </div>
    )

}