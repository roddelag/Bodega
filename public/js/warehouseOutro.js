let popup = document.getElementById("popup");
let popupStatusImg = document.getElementById("popup-status-img");
let popupH1 = document.getElementById("popup-h1");
let popupDesc = document.getElementById("popup-desc");

var scanAllowed = true;

// Function to display the popup with the directions of where to go
function openPopup(orderStatus, orderDetails) {
    scanAllowed = false;

    // Adds the styling to the popup depending if the order is valid or not
    if(orderStatus == "VALID") {
        popupStatusImg.src = "./assets/icons/valid-order-icon.png";
        popupH1.innerHTML = "¡Código válido!";
        popupDesc.innerHTML = "Orden Número<br />" + orderDetails._id + "<br /><br />Detalles de tu pedido:<br />⦿ Cantidad (costales): " + orderDetails.cantidad + "<br />⦿ Peso (toneladas): " + orderDetails.peso + "<br /><br />" + "-CARGA EXITOSA-";

        // Remove the truck from the waiting queue of its cargo zone
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:3000/zone/popOrder", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({zoneNum: orderDetails.zone}));

    } else {
        popupStatusImg.src = "./assets/icons/invalid-order-icon.png";
        popupH1.innerHTML = "¡Código inválido!";
        popupDesc.innerHTML = "Tu código pareciera no estar asociado a ningún pedido activo.<br /><br />Validar con el personal de la planta su situación; mientras tanto, favor de despejar la salida.<br /><br/>¡Gracias!";
    }
    
    popup.classList.add("active-popup");
    setTimeout(closePopup, 10000);
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
                            if(res._id != undefined) {
                                openPopup("VALID", res);
                            } else {
                                openPopup("INVALID", res);
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

