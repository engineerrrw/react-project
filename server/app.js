// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');
//post api by getting ticker symbol and date in body and then getting required details from polygon api with the help of axios get call
app.post('/api/fetchStockData', async(req, res) => {
    const { symbol, date } = req.body;
    try{
        const response = await axios.get(`https://api.polygon.io/v1/open-close/${symbol}/${date}?apiKey=pGBWaIZfy2kbM3FjpAB5uKHEcbw_1E8j`);
        const op = {'open':response.data.open,'close':response.data.close,'high':response.data.high,'low':response.data.low,'volume':response.data.volume}
        res.json(op)
    }
    //here various error have handled like 404(page not found) and 500(internl server error)
    //server error(500) comes when a field missed in request(missed to dd in frontend) or internet is not connected
    //stock not found comes when input ticker symbol is not matching with polygon data store
    catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Stock not found for the given date.' });
        } else {
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    }
    // res.sendStatus(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));