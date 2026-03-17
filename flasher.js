import * as dapjs from 'https://cdn.jsdelivr.net/npm/dapjs@0.3.2/+esm';

// Wrap everything in an event listener to ensure the HTML is loaded first
document.addEventListener('DOMContentLoaded', () => {
    
    // Link to the HTML elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const connectBtn = document.getElementById('connectBtn');
    const flashBtn = document.getElementById('flashBtn');
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');

    let device;
    let fileBuffer;

    // 1. Handle File Upload (The "Pick" Button)
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fileBuffer = event.target.result;
                status.innerText = `File "${file.name}" loaded!`;
                status.style.color = "#007bff";
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // 2. Handle Connection
    connectBtn.addEventListener('click', async () => {
        try {
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
        }
    });

    // 3. Handle Flashing
    flashBtn.addEventListener('click', async () => {
        if (!fileBuffer) {
            status.innerText = "Please upload a .hex file first!";
            return;
        }

        const transport = new dapjs.WebUSB(device);
        const target = new dapjs.DAPLink(transport);

        target.on(dapjs.DAPLink.EVENT_PROGRESS, (progress) => {
            progressBar.style.display = "inline-block";
            progressBar.value = progress * 100;
            status.innerText = `Flashing... ${Math.round(progress * 100)}%`;
        });

        try {
            flashBtn.disabled = true;
            status.innerText = "Starting flash... keep micro:bit plugged in.";
            
            await target.connect();
            await target.flash(fileBuffer);
            await target.disconnect();

            status.innerText = "Flash Successful! 🎉";
            status.style.color = "#32CD32";
            progressBar.style.display = "none";
        } catch (err) {
            status.innerText = "Error: " + err.message;
            status.style.color = "red";
        } finally {
            flashBtn.disabled = false;
        }
    });
});
