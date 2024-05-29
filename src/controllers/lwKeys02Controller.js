// src/controllers/lnsPostdata03Controller.js

const Lwkeys02 = require('../models/lwkeys02');

exports.getAllLwKeys = async (req, res) => {
  try {
    const data = await Lwkeys02.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*exports.createLnsPostdata03 = async (req, res) => {
  try {
    const newData = await LnsPostdata03.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/

// Other CRUD operations similarly implemented
