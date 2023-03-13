const express = require("express")
const router = express.Router()
const cargoZone = require("../models/zone")

// POST endpoint to assign an order to a queue
router.post("/pushOrder", async (req, res) => {
    try {
        const zoneUpdate = await cargoZone.findOneAndUpdate(
          { name: "zone" + req.body.zoneNum }, // criteria to find the queue
          { $push: { waiting: req.body.orderID } }, // add the new item to the end of the 'items' array
          { new: true } // options object to return the updated document
        );
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
          { name: "zone" + req.body.zoneNum }, // criteria to find the queue
          { $pop: { waiting: -1 } }, // add the new item to the end of the 'items' array
          { new: true } // options object to return the updated document
        );
        if(!zoneUpdate) {
            res.status(404).json({message: "Esa zona de carga no existe..."});
            return;
        }
        res.json({msg: "Orden completada.", zoneStatus: zoneUpdate});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
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
