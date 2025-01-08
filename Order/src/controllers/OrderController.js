const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');

const AddOrder = async (req, res) => {
    return res.status(201).send({ body: req.body });
};
module.exports = { AddOrder };
