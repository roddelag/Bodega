const express = require("express")
const router = express.Router()
const cargoZone = require("../models/zone")

// POST endpoint to assign an order to a queue
router.post("/pushOrder", async (req, res) => {
    try {
        const zoneUpdate = await cargoZone.findOneAndUpdate(
            { name: "zone" + req.body.zoneNum }, // Finds by name
            { $push: { waiting: req.body.orderID } }, // Once found, add to queue
            { new: true }); // Options object to return the updated document
        // Verifies the find worked
        if(!zoneUpdate) {
            res.status(404).json({message: "Esa zona de carga no existe..."});
            return;
        }
        res.json(zoneUpdate);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// POST endpoint to remove an order to a queue
router.post("/popOrder", async (req, res) => {
    try {
        const zoneUpdate = await cargoZone.findOneAndUpdate(
            { name: "zone" + req.body.zoneNum }, // Finds by name
            { $pop: { waiting: -1 } }, // Once found, remove from queue
            { new: true }); // Options object to return the updated document
        // Verifies the find worked
        if(!zoneUpdate) {
            res.status(404).json({message: "Esa zona de carga no existe..."});
            return;
        }
        res.json({msg: "Orden completada.", zoneStatus: zoneUpdate});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// GET endpoint to get the number of waiting trucks on each cargo zone
router.get("/waitingLists", async (req,res) => {
    cargoZone.aggregate([{
        $project: {
            waitingTrucks: { $size: '$waiting' }
        }
    }])
    .exec((err, result) => {
        if (err) {
            res.status(500).json({message: err.message});
        } else {
            res.json(result);
        }
    });
});

// GET endpoint to retrieve a zone by name 
router.get("/:zoneNum", async (req, res) => {
    try {
        const zone = await cargoZone.findOne({name: "zone" + req.params.zoneNum});
        if (!zone) {
            res.status(404).json({message: "Esa zona de carga no existe..."});
            return;
        }
        res.json(zone);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
