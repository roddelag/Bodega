function generateQR() {
    // Connect to the API that generates the QR, giving it
    // the text to encode within it
    var downloadQr = document.querySelector('#qr-code');
    var amount = document.querySelector('#qr-txt');
    var email = document.querySelector('#email');

    let finalURL =
        'https://chart.googleapis.com/chart?cht=qr&chl=' +
        document.getElementById("qr-txt").value +
        '&chs=160x160&chld=L|0'

    // Replace the src of the image with
    // the QR code image
    document.getElementById("qr-code").src = finalURL;
    downloadQr.setAttribute('href', finalURL);
    downloadQr.style.display = 'inline-block';

    fetch('http://127.0.0.1:3000/pedido', {
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "cantidad": amount.value,
            "precio": amount.value * 300
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(results => results.json())
        .then(function (data) {
            console.log(data)
        });

}

/*
fetch('http://127.0.0.1:3000/pedido', {
                    method: 'POST',
                    body: JSON.stringify({
                        "email": 'prueba@hotmail.com',
                        "cantidad": amount.value,
                        "precio": 10,
                        "peso": 5
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
                    .then(results => results.json())
                    .then(function (data) {
                        console.log(data)
                    });
*/