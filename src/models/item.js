import mongoose from 'mongoose';
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  sellIn: Number, // days left before selling the item
  quality: Number
});

const Item = mongoose.model('Item', itemSchema);

export default Item;