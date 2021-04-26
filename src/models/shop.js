import mongoose from 'mongoose';
import Item from './item.js';

const { Schema } = mongoose;

const shopSchema = new Schema({
  items: { type: Schema.Types.ObjectId, ref: 'Item' }
});

const Shop = mongoose.model('Shop', shopSchema);

/* 
  - Once the sell by date has passed, Quality degrades twice as fast ----- OK
  - The Quality of an item is never negative ----- OK
  - "Aged Brie" actually increases in Quality the older it gets ----- OK
  - The Quality of an item is never more than 50 ----- OK
  - "Sulfuras", being a legendary item, never has to be sold or decreases in Quality ----- OK
  - "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches; ----- OK
  - Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but ----- OK
  - Quality drops to 0 after the concert ----- OK
  - "Conjured" items degrade in Quality twice as fast as normal items
  - an item can never have its Quality increase above 50, however "Sulfuras" is a
    legendary item and as such its Quality is 80 and it never alters. ----- OK
*/

const legendaryItem = 'Sulfuras, Hand of Ragnaros';
const agedBrie = 'Aged Brie';
const backstagePasse = 'Backstage passes to a TAFKAL80ETC concert';

const isLegenday = (item) => {
  return item.name === legendaryItem;
}

const isAgedBrie = (item) => {
  return item.name === agedBrie;
}

const isBackstagePasse = (item) => {
  return item.name === backstagePasse;
}

const isConjured = (item) => {
  return item.name.includes('Conjured');
}

const qualityUpdateForBackstagePasses = (item) => {
  const { sellIn, quality } = item;
  if (sellIn < 0) return -quality;
  if (sellIn <= 5) return 3;
  if (sellIn <= 10) return 2;
  return 1;
}

const qualityUpdateForNormalItem = (item) => {
  const { sellIn, quality } = item;
  if (quality > 1 && sellIn < 0) return -2;
  if (quality > 0) return -1;
  return 0;
}

const qualityUpdateForAllItems = (item) => {
  if (isAgedBrie(item)) return 2;
  if (isBackstagePasse(item)) return qualityUpdateForBackstagePasses(item);
  if (isConjured) return qualityUpdateForNormalItem(item) * 2;
  return qualityUpdateForNormalItem(item);
}

const qualityCheck = (item) => {
  const { quality } = item;
  if (isLegenday(item)) return 80;
  if (quality < 0) return 0;
  if (quality > 50) return 50;
}

const updateSellIn = (item) => {
  const { sellIn } = item;
  return isLegenday(item) ? 0 : sellIn - 1;
}

Shop.updateQuality = async function () {
  const allItems = await Item.find();
  return Promise.all(
    allItems.map((item) => {
      const { _id } = item;
      item.sellIn = updateSellIn(item);
      item.quality += qualityUpdateForAllItems(item);
      if (isLegenday(item) || item.quality > 50 || item.quality < 0) item.quality = qualityCheck(item);
      return Item.updateOne({ _id }, { $set: { quality: item.quality, sellIn: item.sellIn } });
    })
  )
}

export default Shop;
