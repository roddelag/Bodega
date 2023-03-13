var mongoose = require("mongoose");

var cargoZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    waiting: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("Queue", cargoZoneSchema);


