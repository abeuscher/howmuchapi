var mongoose = require('mongoose');
var dType = require("../data-types.js")().flower;

var entrySchema = new mongoose.Schema(dType);
 
var Entry = mongoose.model('Entry', entrySchema);
 
module.exports = Entry;