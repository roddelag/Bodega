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

const cargoZone = mongoose.model("Queue", cargoZoneSchema);
module.exports = cargoZone;

// If you don't have already cargo zones defined, this will
// automatically create them, since they're always the same
cargoZone.countDocuments({}, (err, count) => {
    if (err) {
        console.log(err);
    } else {
        if (count === 0) {
            for(i = 0; i < 4; i++) {
                const zone = new cargoZone({name: "zone"+(i+1)});
                zone.save()
                    .then(savedZone => {
                        console.log("Successfully created: " + zone);
                    })
                    .catch(error => {
                        console.log("Error autofilling the cargo zones...")
                    });
            }
        } else {
            console.log("No need to create new cargo zones.");
        }
    }
});

