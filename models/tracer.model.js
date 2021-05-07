const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tracerModel = mongoose.model('Tracer', new Schema({}, { strict: false }));

exports.tracerModel = tracerModel;
