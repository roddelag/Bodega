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
        if(orderDetails.stats != "DELIVERED") {
            // Calculates the final weight
            fetch("http://127.0.0.1:3000/peso/outro/" + orderDetails._id, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                })
                .then(res => res.json())
                .then((res) => {
                    if(res.weightValidation == "APPROVED") {
                        // Remove the truck from the waiting queue of its cargo zone
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "http://127.0.0.1:3000/zone/popOrder", true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({zoneNum: parseInt(orderDetails.stats[orderDetails.stats.length - 1])}));
                        // Updates the status of the order to mark it as resolved
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "http://127.0.0.1:3000/pedido/setStatus", true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({orderStats: "DELIVERED", orderID: orderDetails._id}));
                        // Display the corresponding popup
                        popupStatusImg.src = "./assets/icons/valid-order-icon.png";
                        popupH1.innerHTML = "¡Carga Exitosa!";
                        popupDesc.innerHTML = "Tu orden ha sido resuelta:<br />" + orderDetails._id + "<br /><br />Gracias por confiar en nuestro servicio, lo esperamos de nuevo.<br /><br />-ORDEN COMPLETA-";

                        // Sends the control signal to open the gates
                        openEntrance("OPEN");
                    } else {
                        // Display the corresponding popup
                        popupStatusImg.src = "./assets/icons/warning-order-icon.png";
                        popupH1.innerHTML = "¡Diferencia de carga!";
                        let cargoMsg = res.weightVariation > 0 ? "más" : "menos";
                        popupDesc.innerHTML = "La báscula ha detectado que llevas " + cargoMsg + " carga de la que deberías, de acuerdo con tu orden.<br />" + orderDetails._id + "<br /><br />⦿ Llevas una diferencia de aproximadamente: " + res.weightVariation + " kg.<br /><br />" + "Vuelve a tu zona de carga asignada e informa de la situación.";
                    }
                })
                .catch(error => {
                    console.error("Error ocurred when updating weights: ", error);
                });
        } else {
            popupStatusImg.src = "./assets/icons/invalid-order-icon.png";
            popupH1.innerHTML = "¡Código inválido!";
            popupDesc.innerHTML = "Tu código está asociado con una orden que <u><b>YA FUE ENTREGADA</b></u>.<br /><br />Verifique nuevamente, o en caso de que considere que se trata de un error, discuta el caso con el guardia más adelante para despejar la entrada.<br /><br/>¡Gracias!";
        } 
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

// Function to communicate with the listener server in Python that 
// will serve as a bridge between Arduino and this Web App
function openEntrance(code) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/listener", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({eventCode: code}));
}



