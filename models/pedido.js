var mongoose = require('mongoose');

var Pedidoschema = mongoose.Schema({
    email: { type: String, required: true },
    cantidad: { type: String, required: true },
    precio: { type: Number, required: true },
    pesoInit: { type: Number, default: 0 },
    pesoEnd: { type: Number, default: 0 },
    stats: { type: String, default: "PENDING" }
});

module.exports = mongoose.model('Pedido', Pedidoschema);
