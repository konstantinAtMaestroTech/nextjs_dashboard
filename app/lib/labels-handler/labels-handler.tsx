'use server'

import QRCode from 'qrcode';
import {PDFDocument, rgb} from 'pdf-lib';
import {createCanvas, loadImage} from 'canvas';
import { s3_get_public_asset } from '@/app/lib/aws-s3/actions';

interface labelGeneratorProps {
    zoneId: string;
    zoneName : string;
    viewId: string;
}

export async function labelGenerator({zoneId, zoneName, viewId}: labelGeneratorProps) : Promise<Uint8Array> {

    const url = `${process.env.NEXT_PUBLIC_URL}/assembly/${viewId}#${zoneId}`

    // Step 1: Generate QR Code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 1000,
    });

    // Step 2: Create a canvas to add graphical elements to QR code
    const canvas = createCanvas(4000, 2000);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white'; // Set the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with the background color

    // Draw the QR code on canvas
    const qrImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrImage, 0, 0, 2000, 2000);

    const textHeight = 150;

    ctx.fillStyle = 'black';
    ctx.font = `${150}px Arial`;

    const textWidth = ctx.measureText(zoneName).width;
    const x = (3 / 4) * canvas.width - textWidth / 2;
    const middleLineY = (1 / 2) * canvas.height;

    // Load the background image
    const maestroImage = await s3_get_public_asset('Logo_Extended.png')
    if (maestroImage instanceof Uint8Array) {
        const buffer_maestro_image = Buffer.from(maestroImage)
        const backgroundImage = await loadImage(buffer_maestro_image);

        // Calculate the height to preserve the aspect ratio
        const aspectRatio = backgroundImage.width / backgroundImage.height;
        const newWidth = canvas.width/3;
        const newHeight = newWidth / aspectRatio;

        // Draw the background image with preserved aspect ratio
        ctx.drawImage(backgroundImage, x, middleLineY - newHeight, newWidth, newHeight);
    }

    ctx.fillText(zoneName, x, middleLineY + 3*textHeight);

    const buffer = canvas.toBuffer();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([4000, 2000]);

    const qrImageEmbed = await pdfDoc.embedPng(buffer);

    page.drawImage(qrImageEmbed, {
        x: 0,
        y: 0,
        width: 4000,
        height: 2000,
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}