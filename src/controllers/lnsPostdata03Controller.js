// src/controllers/lnsPostdata03Controller.js

const LnsPostdata03 = require('../models/lnsPostdata03');
const Lwkeys02 = require('../models/lwkeys02');

exports.getAllLnsPostdata03 = async (req, res) => {
  try {
    const data = await LnsPostdata03.findAll({
      include: Lwkeys02
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

