// This method will trigger user permissions
Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
        var cameraId = devices[0].id;

        // Once a camera has been identified then the scanning starts
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            cameraId, 
            {
                fps: 10,
                qrbox: { 
                    width: 250, 
                    height: 250 
                }
            },
            (decodedText, decodedResult) => {
                //  Verifies the ID of the order exctracted from the QR is valid
                fetch('http://127.0.0.1:3000/pedido/' + decodedText)
                    .then(res => res.json())
                    .then((res) => {
                        if(res.success) {
                            console.log("SIUUUU");
                        }
                    });
            },
            (errorMessage) => {
                console.log("Error reading QR code...");
            })
        .catch((err) => {
            console.log("Error starting QR scanner...");
        });
    }
}).catch(err => {
    console.log("Error finding a camera to be used...");
});
