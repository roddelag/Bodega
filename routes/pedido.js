const express = require("express")
const router = express.Router()
const Pedido = require('../models/pedido')


router.post("/", async (req, res) => {
    const newPedido = new Pedido({
        email: req.body.email,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        peso: req.body.peso
    })
    try {
        const savedPedido = await newPedido.save();
        res.status(201).json({message: "Pedido creado", pedidoId: savedPedido._id});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})


// GET endpoint to retrieve a Pedido by ID
router.get("/:id", async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            res.status(404).json({message: "Pedido no encontrado"});
            return;
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;