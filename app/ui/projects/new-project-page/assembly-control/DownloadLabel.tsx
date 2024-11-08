'use client'

import {ArrowDownTrayIcon} from '@heroicons/react/24/outline';

export default function DownloadLabel({clientViewId, supersetId}: {clientViewId: string, supersetId: string}) {

    const downloadFile = async (clientViewId: string, supersetId: string) => {
        const response = await fetch('/api/s3/labels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientViewId, supersetId }),
        });

        if (!response.ok) {
            console.error('Failed to download file');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${supersetId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return (
        <>
            <button onClick={() => downloadFile(clientViewId, supersetId)}>
                <ArrowDownTrayIcon className="w-5" />
            </button>
        </>
    )

}