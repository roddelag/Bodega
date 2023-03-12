function generateQR() {
    // Connect to the API that generates the QR, giving it
    // the text to encode within it
    let finalURL =
            'https://chart.googleapis.com/chart?cht=qr&chl=' +
            document.getElementById("qr-txt").value +
            '&chs=160x160&chld=L|0'
    
    // Replace the src of the image with
    // the QR code image
    document.getElementById("qr-code").src = finalURL;
    
}
