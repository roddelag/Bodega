let popup = document.getElementById("popup");
let popupStatusImg = document.getElementById("popup-status-img");
let popupH1 = document.getElementById("popup-h1");
let popupDesc = document.getElementById("popup-desc");
let popupRouteImg = document.getElementById("popup-route-img");

var scanAllowed = true;

// Function to display the popup with the directions of where to go
function openPopup(orderStatus, orderDetails) {
    scanAllowed = false;

    // Adds the styling to the popup depending if the order is valid or not
    if(orderStatus == "VALID") {
        popupStatusImg.src = "./assets/icons/valid-order-icon.png";
        popupH1.innerHTML = "¡Código válido!";
        popupDesc.innerHTML = "Orden Número<br />" + orderDetails._id + "<br /><br />Detalles de tu pedido:<br />⦿ Cantidad (costales): " + orderDetails.cantidad + "<br />⦿ Peso (toneladas): " + orderDetails.peso + "<br /><br />" + "Sigue la ruta indicada para llegar a tu zona de carga asignada:";

        // Determine on which cargo zone the truck will be assigned
        fetch("http://127.0.0.1:3000/zone/waitingLists")
            .then(res => res.json())
            .then((res) => {
                zonesWaitList = [
                    res[0].waitingTrucks,
                    res[1].waitingTrucks,
                    res[2].waitingTrucks,
                    res[3].waitingTrucks
                ];
                // Sends the truck to the cargo zone a smaller waiting list
                let zoneAssigned = (zonesWaitList.indexOf(Math.min(...zonesWaitList))+1).toString();
                popupRouteImg.src = "./assets/cargo" + zoneAssigned + ".png";

                // Adds the zone number to the order's data
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:3000/pedido/assignZone", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({zoneNum: parseInt(zoneAssigned), orderID: orderDetails._id}));
                // Adds the ID of the order to the waiting list of its assigned zone
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:3000/zone/pushOrder", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({zoneNum: zoneAssigned, orderID: orderDetails._id}));
                
                // Sends the control signal to open the gates
                // This communicates with the listener server in Python that 
                // will serve as a bridge between Arduino and this Web App
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:5000/listener", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({allowAccess: true}));
            })

    } else {
        popupStatusImg.src = "./assets/icons/invalid-order-icon.png";
        popupH1.innerHTML = "¡Código inválido!";
        popupDesc.innerHTML = "Tu código no está asociado con ningún pedido realizado, por favor sigue adelante y libera el camino para los conductores que vienen atrás.<br /><br />En caso de que considere que se trata de un error, discuta el caso con el guardia más adelante.<br /><br/>¡Gracias!";
        popupRouteImg.src = "";
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

