require('dotenv').config()
const express = require("express")
const app = express()
app.use(express.json())
var mongoose = require('mongoose')
const path = require("path")

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to dataabase'))

// Since the number of cargo zones never changes, then
// we can just fill them by default
const cargoZone = require('./models/zone')
for(i = 0; i < 4; i++) {
    const zone = new cargoZone({name: "cargo"+(i+1)});
    zone.save()
        .then(savedZone => {
            console.log("Successfully created: " + zone);
        })
        .catch(error => {
            console.log("Error autofilling the cargo zones...")
        });
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const pesoRouter = require("./routes/peso")
const pedidoRouter = require("./routes/pedido")

app.use("/peso", pesoRouter)
app.use("/pedido", pedidoRouter)

app.get("/home", (req, res) => {
    res.render("index.html");
})

app.get("/access", (req, res) => {
    res.render("warehouseAccess.html");
})
app.get("/order", (req, res) => {
    res.render("make-order.html");
})

app.listen(3000, () => console.log('server started'))
