'use client'

import { ComponentData } from '@/app/lib/tender-package/actions';

export default function DownloadFile({component}: {component: ComponentData}) {

    const downloadFile = async (dbid: number) => {
        const response = await fetch('/api/s3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dbid }),
        });

        if (!response.ok) {
            console.error('Failed to download file');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dbid}.obj`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return (
        <>
            <button onClick={() => downloadFile(component.component_dbid)}>
                {component.component_dbid} | {component.name} | {component.leaf_nodes}
            </button>
        </>
    )

}