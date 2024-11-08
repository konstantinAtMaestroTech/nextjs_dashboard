import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {

    useEffect(() => {

        let measureExtension = props.viewer.getExtension("Autodesk.Measure");
        let sectionExtension = props.viewer.getExtension("Autodesk.Section");

        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);

        const onNewScanResult = (decodedText, decodedResult) => {

            const hash = new URL(decodedText).hash.substring(1);
            const selectedView = props.views.find(view => view.id === hash)
            console.log('decoded text is', decodedText);

            if (selectedView) {
                const {state} = selectedView.data
                console.log('selectedView is', selectedView);

                measureExtension.deleteMeasurements();
                sectionExtension.activate();
                sectionExtension.deactivate();

                props.viewer.restoreState(state);
                props.setSelectedView(selectedView);
                props.setActiveMenu(undefined);
            }

            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        }

        // when component mounts
    
        html5QrcodeScanner.render(onNewScanResult, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {       
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);


    return (
        <div id={qrcodeRegionId} className="bg-white w-[450px]"/>
    );
};

export default Html5QrcodePlugin;