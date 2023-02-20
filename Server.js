const express = require("express")
const app = express()



const pesoRouter = require("./routes/peso")

app.use("/peso", pesoRouter)






app.listen(3000, ()=> console.log('server started'))
