import Html5QrcodePlugin from '@/app/ui/html5qrcodeplugin';
import {Dispatch, SetStateAction} from 'react';
import { View } from '@/app/ui/assembly-control/utilities';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ScannerProps {
    activeMenu: string | undefined;
    setActiveMenu: Dispatch<SetStateAction<string | undefined>>;
    viewer: any;
    setSelectedView: Dispatch<SetStateAction<View | undefined>>;
    views: View[];
}

export default function Scanner({activeMenu, viewer, views, setSelectedView, setActiveMenu}: ScannerProps) {

    return (
        <>
            {activeMenu === 'scanner' &&
                <>
                    <div className="fixed flex inset-0 items-center justify-center bg-black bg-opacity-50 z-[1002]">
                        <div className="flex-col">
                            <div className="flex justify-end">
                                <button onClick={() => setActiveMenu(undefined)} className="p-2">
                                    <XMarkIcon className="w-5 hover:text-gray-500" />
                                </button>
                            </div>
                            <Html5QrcodePlugin
                                fps={10}
                                qrbox={500}
                                disableFlip={false}
                                viewer={viewer}
                                setSelectedView={setSelectedView}
                                views={views}
                                setActiveMenu={setActiveMenu}
                            />
                        </div>
                    </div>
                </> 
            }
        </>
    );
}