import mongoose from 'mongoose';

import Item from './models/item.js';
import Shop from './models/shop.js';


const uristring = "mongodb://localhost/GildedRose";

const fillItems = () => {
  console.log(new Date(), "Inserting docs");
  /* Sulfuras, Hand of Ragnaros */
  const item1 = Item.create({
    name: 'Sulfuras, Hand of Ragnaros',
    sellIn: 0,
    quality: 0,
  });
  const item2 = Item.create({
    name: 'Sulfuras, Hand of Ragnaros',
    sellIn: 12,
    quality: 9,
  });
  const item3 = Item.create({
    name: 'Sulfuras, Hand of Ragnaros',
    sellIn: 17,
    quality: 140,
  });
  /* Aged Brie */
  const item4 = Item.create({
    name: 'Aged Brie',
    sellIn: 0,
    quality: 0,
  });
  const item5 = Item.create({
    name: 'Aged Brie',
    sellIn: 12,
    quality: 9,
  });
  const item6 = Item.create({
    name: 'Aged Brie',
    sellIn: 17,
    quality: 140,
  });
  /* Backstage Passes */
  const item7 = Item.create({
    name: 'Backstage passes to a TAFKAL80ETC concert',
    sellIn: 0,
    quality: 10,
  });
  const item8 = Item.create({
    name: 'Backstage passes to a TAFKAL80ETC concert',
    sellIn: 4,
    quality: 10,
  });
  const item9 = Item.create({
    name: 'Backstage passes to a TAFKAL80ETC concert',
    sellIn: 7,
    quality: 10,
  });
  const item10 = Item.create({
    name: 'Backstage passes to a TAFKAL80ETC concert',
    sellIn: 11,
    quality: 10,
  });
  /* Conjured Stuff */
  const item11 = Item.create({
    name: 'Conjured Health Potion',
    sellIn: 0,
    quality: 10,
  });
  const item12 = Item.create({
    name: 'Conjured Health Potion',
    sellIn: 2,
    quality: 10,
  });
  return Promise.all([item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12]);
};

const fillShop = async () => {
  const items = await Item.find();
  return items.map(i => Shop.create({ _id: i._id }))
}

mongoose
  .connect(uristring, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(new Date(), "Db connected");

    const deleteItems = Item.deleteMany();
    const deleteShopItems = Shop.deleteMany();

    console.log(new Date(), "Deleting Docs");
    Promise.all([deleteItems, deleteShopItems])
      .then(() => {
        console.log(new Date(), "Docs deleted");
      })
      .then(() => {
        fillItems().then(() => {
          fillShop()
        })
      })
      .then(() => console.log(new Date(), "Docs added"));
  })
  .catch(() => {
    console.log("Error with the connection to the db");
  });
