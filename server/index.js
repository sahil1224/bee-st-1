
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 7000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: String,
  author: String,
  genre: String,
  publication: Number,
  isbna:Number
});

const Item = mongoose.model('Item', itemSchema);

app.route('/items')
  .get(async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error.message);
      res.status(500).json({ error: 'Error fetching items.' });
    }
  })
  .post(async (req, res) => {
    const { name, author ,genre ,publication ,isbna } = req.body;
    if (!name || !author || !genre || !publication || !isbna) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const newItem = new Item({ name, author ,genre ,publication ,isbna });
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (error) {
      console.error('Error adding item:', error.message);
      res.status(500).json({ error: 'Error adding item.' });
    }
  });

app.route('/items/:id')
  .put(async (req, res) => {
    const { name, author ,genre ,publication ,isbna } = req.body;
    if (!name || !author || !genre || !publication || !isbna) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, author ,genre ,publication ,isbna }, { new: true });
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error.message);
      res.status(500).json({ error: 'Error updating item.' });
    }
  })
  .delete(async (req, res) => {
    try {
      await Item.findByIdAndDelete(req.params.id);
      res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
      console.error('Error deleting item:', error.message);
      res.status(500).json({ error: 'Error deleting item.' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
