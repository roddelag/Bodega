require('dotenv').config()
const express = require("express")
const app = express()
app.use(express.json())
var mongoose = require('mongoose')

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('connected to dataabase'))


const pesoRouter = require("./routes/peso")
const pedidoRouter = require("./routes/pedido")

app.use("/peso", pesoRouter)
app.use("/pedido", pedidoRouter)






app.listen(3000, ()=> console.log('server started'))
