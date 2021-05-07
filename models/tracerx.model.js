const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tracerxModel = mongoose.model('Tracerx', new Schema({}, { strict: false }));

exports.tracerxModel = tracerxModel;
