const express = require("express")
const router = express.Router()
const Pedido = require('../models/pedido')



router.get("/:id", async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            res.status(404).json({message: "Pedido no encontrado"});
            return;
        }
        res.json({peso: pedido.peso});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})



router.post("/outro/:id", async (req, res) => {
    try {
        const pedidoDetails = await Pedido.findById(req.params.id);
        if (!pedidoDetails) {
            res.status(404).json({message: "Pedido no encontrado"});
            return;
        }
        let initialTruckWeight = pedidoDetails.pesoInit;
        // Based on the quantity ordered and assumming each sack of corn
        // weights around 50kg, generates the expected additional weight
        let expectedCargoWeight = 50 * pedidoDetails.cantidad;
        // Creates a dummy wrong cargo to simulate the case were the is a
        // reasonable difference between the expected and actual weight
        let wrongCargoWeight = Math.floor(Math.random() * 100) + 1;
        wrongCargoWeight *= Math.round(Math.round()) ? 1 : -1;
        wrongCargoWeight = expectedCargoWeight + wrongCargoWeight;
        // Randomly choose (simulate) if the truck was loaded with the
        // right amount of corn or not
        let addedCargoWeight = Math.round(Math.round()) ? expectedCargoWeight : wrongCargoWeight ;
        let finalTruckWeight = initialTruckWeight + addedCargoWeight;

        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id, 
            { pesoEnd: finalTruckWeight }, 
            { new: true }); 
        // Verifies the find worked
        if(!pedido) {
            res.status(404).json({message: "Pedido no encontrado"});
            return;
        }

        // Calculates if the weight difference is acceptable
        const errorMargin = expectedCargoWeight * 0.04; 
        const upperLimit = expectedCargoWeight + errorMargin;
        const lowerLimit = expectedCargoWeight - errorMargin;
        const weightDiff = expectedCargoWeight - addedCargoWeight;

        if (addedCargoWeight >= lowerLimit && addedCargoWeight <= upperLimit) {
            res.status(200).json({weightValidation: "APPROVED"});
        } else {
            res.status(400).json({weightValidation: "FAILED", weightVariation: weightDiff});
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// POST endpoint to send the data of the entrance weight
router.post("/intro/:id", async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            // Assign a random weight to the truck (15,000 - 20,000 kg).
            { pesoInit: Math.floor(Math.random() * (20001 - 15000) + 15000) },
            { new: true });
        // Verifies the find worked
        if(!pedido) {
            res.status(404).json({message: "Pedido no encontrado"});
            return;
        }
        res.json(pedido);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});
  

module.exports = router



