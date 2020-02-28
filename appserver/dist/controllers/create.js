const mongoose = require("mongoose");
const CONNECTION_URL = "mongodb://mongodb/local";
const Entry = require("../schemas/entry.js");
const Dispensary = require("../schemas/dispensary.js");

function CreateRecord(request,response) {
    
    /*
    mongoose.connect(CONNECTION_URL, function (err) {

        if (err) throw err;

        res.json(req.body);

    });
    */
}

module.exports = CreateRecord;