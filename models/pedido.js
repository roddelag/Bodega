var mongoose = require('mongoose');

var Pedidoschema = mongoose.Schema({
    email: { type: String, required: true },
    cantidad: { type: String, required: true },
    precio: { type: Number, required: true },
    peso: { type: Number, required: true },
    stats: { type: String, default: "PENDING" }
});

module.exports = mongoose.model('Pedido', Pedidoschema);
