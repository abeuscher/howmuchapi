const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const fs = require("file-system");
const cors = require("cors");

const CONNECTION_URL = "mongodb://mongodb/";
const DATABASE_NAME = "local";

var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}
app.listen(5000, () => {

    app.get('/', cors(corsOptions), (request, response) => {

        readDB(response, request);

    })

});

function readDB(res, req) {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {

        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("testcollection");

        collection.find({}).toArray((error, result) => {
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result);
        });


    });
}

function sendFileContent(response, fileName, contentType) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write(data);
        }
        response.end();
    });
}