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



router.post("/:id", async (req, res) => {
    try{
      const { pesoI, pesoF } = req.body;
      const pedido = await Pedido.findById(req.params.id);
      if (!pedido) {
        res.status(404).json({message: "Pedido no encontrado"});
        return;
      }
      const pesoActual = pedido.peso;
      const pesoCalculado = pesoF - pesoI;
      const errorMarginPositive = pesoActual * 0.15; 
      const errorMarginNegative = -1 * pesoActual * 0.15; 
      const pesoDiferencia = pesoActual - pesoCalculado;
      if (pesoDiferencia >= errorMarginNegative && pesoDiferencia <= errorMarginPositive) { 
        res.status(200).json({message: "Los pesos coinciden"});
      } else {
        res.status(400).json({message: "Los pesos no coinciden"});
      }
    } catch(error) {
      res.status(500).json({message: error.message});
    }
  });
  

module.exports = router