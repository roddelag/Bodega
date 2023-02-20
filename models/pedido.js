var mongoose = require('mongoose');

var Pedidoschema = mongoose.Schema({
email: { type: String, required: true },
precio: { type: Number, required: true },
peso: { type: Number, required: true },
pesoI: { type: Number, required: true },
pesoF: { type: Number, required: true },
});
module.exports = mongoose.model('Peido', Pedidoschema);
