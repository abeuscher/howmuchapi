var mongoose = require('mongoose');
var dType = require("../data-types.js")().dispensary;

dType._id =  mongoose.Schema.Types.ObjectId

var dispensarySchema = new mongoose.Schema(dType);

var Dispensary = mongoose.model('Dispensary', dispensarySchema);

module.exports = Dispensary;