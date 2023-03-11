let popup = document.getElementById("popup");
let popupImg = document.getElementById("popup-img");
let popupH1 = document.getElementById("popup-h1");

var scanAllowed = true;

// Function to display the popup with the directions of where to go
function openPopup(orderStatus) {
    scanAllowed = false;

    // Adds the styling to the popup depending if the order is valid or not
    if(orderStatus == "VALID") {
        popupImg.src = "./assets/icons/valid-order-icon.png";
        popupH1.innerHTML = "¡Código valido!"
    } else {
        popupImg.src = "./assets/icons/invalid-order-icon.png";
        popupH1.innerHTML = "¡Código inválido!"
    }
    
    popup.classList.add("active-popup");
    setTimeout(closePopup, 5000);
}

// Function to hide the popup after a certain amount of time
function closePopup() {
    popup.classList.remove("active-popup");
    scanAllowed = true;
}

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
                if(scanAllowed) {
                    //  Verifies the ID of the order from the QR is valid
                    fetch('http://127.0.0.1:3000/pedido/' + decodedText)
                        .then(res => res.json())
                        .then((res) => {
                            if(res.success) {
                                openPopup("VALID");
                            } else {
                                openPopup("INVALID");
                            }
                        });
                }
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
