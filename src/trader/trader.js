const env = require("../env")
const tradeService = require("./tradeService")
const express = require("express")
const { notifyJakeSignal } = require("../notifiers/discord")
const { JAKE_SIGNAL_CHANNEL_ID } = require("../notifiers/discord")

const app = express()
app.use(express.json());
app.get("/", (req, res) => res.send(""))
app.post('/signal', (req,res) => {
    const {type,ticker,exchange,price} = req.body;
    notifyJakeSignal(type,exchange,ticker,price);
    res.status(200).send();
})
app.listen(env.TRADER_PORT, () => console.log("NBT auto trader running.".grey))


tradeService.init();
