const express = require('express');
const { KV } = require('./models');
const e = require('express');

const apiRouter = express.Router();

// Get all key-value pairs
apiRouter.get('/kv', async (req, res) => {
  try {
    const kvs = await KV.findAll();
    return res.json({ data:kvs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get a specific key-value pair
apiRouter.get('/kv/:key', async (req, res) => {
  try {
    const kv = await KV.findOne({ where: { key: req.params.key } });
    if (kv) {
      return res.json({ data: kv });
    } else {
      return res.status(404).json({ error: 'Key not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create or update a key-value pair
apiRouter.post('/kv', async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: 'Key and value are required' });
  }

  try {
    const existingKv = await KV.findOne({ where: { key } });
    if (existingKv) {
      return res.status(400).json({ error: 'Key already exists' });
    } else {
      const newKv = await KV.create({ key, value });
      return res.status(201).json({ data: newKv });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update a key-value pair
apiRouter.put('/kv/:key', async (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }

  try {
    const [updateCount] = await KV.update({ value }, { where: { key: req.params.key } });
    if (updateCount > 0) {
      const updatedKv = await KV.findOne({ where: { key: req.params.key } });
      if (updatedKv) {
        return res.json({ data: updatedKv });
      }
      else {
        return res.status(404).json({ error: 'Key not found after update' });
      }
    } else {
      const newKv = await KV.create({ key: req.params.key, value });
      return res.status(201).json({ data: newKv });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete a key-value pair
apiRouter.delete('/kv/:key', async (req, res) => {
  try {
    const deleteCount = await KV.destroy({ where: { key: req.params.key } });
    if (deleteCount > 0) {
      return res.json({ message: 'Key deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Key not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = apiRouter;
