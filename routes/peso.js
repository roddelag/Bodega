const express = require("express")
const router = express.Router()



router.get("/", async (req, res) => {
    res.status(201).send("funciona");
})



router.post("/", async (req, res) => {
    res.status(201).send("funciona");
})
module.exports = router