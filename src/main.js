import express from 'express';
import mongoose from 'mongoose';

import Shop from './models/shop.js';

const app = express();
const port = 3000;

const uristring = "mongodb://localhost/GildedRose";

const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
  mongoose
    .connect(uristring, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Db connected"))
    .catch(() => {
      console.log("Error with the connection to the db");
    });
}

startServer().then(() => {
  Shop.updateQuality().then(() => {
    console.log(new Date(), 'Items updated')
  });
})
