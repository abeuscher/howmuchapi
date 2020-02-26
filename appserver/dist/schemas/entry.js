var mongoose = require('mongoose');
var dType = require("../data-types.js")().productEntry;

dType._id =  mongoose.Schema.Types.ObjectId

var entrySchema = new mongoose.Schema(dType);
 
var Entry = mongoose.model('Entry', entrySchema);
 
module.exports = Entry;