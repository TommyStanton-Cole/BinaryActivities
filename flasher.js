import * as dapjs from 'https://cdn.jsdelivr.net/npm/dapjs@0.3.2/+esm';

console.log("flashuBit: JS Module Loaded Successfully");

const fileInput = document.getElementById('fileInput');
const connectBtn = document.getElementById('connectBtn');
const flashBtn = document.getElementById('flashBtn');
const status = document.getElementById('status');
const progressBar = document.getElementById('progressBar');

let device;
let fileBuffer;

// Handle the file selection once the menu opens
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            fileBuffer = event.target.result;
            status.innerText = `File "${file.name}" loaded!`;
            status.style.color = "#007bff";
            console.log("flashuBit: File buffer ready");
        };
        reader.readAsArrayBuffer(file);
    }
});

// Handle Connection
connectBtn.addEventListener('click', async () => {
    try {
        status.innerText = "Searching for micro:bit...";
        device = await navigator.usb.requestDevice({
            filters: [{ vendorId: 0x0d28, productId: 0x0204 }]
        });
        
        status.innerText = `Connected: ${device.productName}`;
        status.style.color = "#32CD32";
        connectBtn.style.display = "none";
        flashBtn.style.display = "inline-block";
    } catch (err) {
        status.innerText = "Connection failed. Use Chrome/Edge.";
        status.style.color = "red";
        console.error(err);
    }
});

// Handle Flashing
flashBtn.addEventListener('click', async () => {
    if (!fileBuffer) return;

    const transport = new dapjs.WebUSB(device);
    const target = new dapjs.DAPLink(transport);

    target.on(dapjs.DAPLink.EVENT_PROGRESS, (p) => {
        progressBar.style.display = "inline-block";
        progressBar.value = p * 100;
        status.innerText = `Flashing: ${Math.round(p * 100)}%`;
    });

    try {
        flashBtn.disabled = true;
        await target.connect();
        await target.flash(fileBuffer);
        await target.disconnect();

        status.innerText = "Flash Successful! 🎉";
        progressBar.style.display = "none";
    } catch (err) {
        status.innerText = "Error: " + err.message;
        console.error(err);
    } finally {
        flashBtn.disabled = false;
    }
});
