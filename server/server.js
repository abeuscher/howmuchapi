const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const fs = require("file-system");
const cors = require("cors");

const CONNECTION_URL = "mongodb://mongodb/test";
const DATABASE_NAME = "local";

var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;
var corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}
app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("testcollection");
        var cursor = collection.find();
        cursor.each(function (err, doc) {
            if (doc != null)
                console.log(doc.name);
        });
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
    /*
    app.get('/', cors(corsOptions), (request, response) => {

            sendFileContent(response, "index.html", "text/html");

      })
      */
    app.get('/', cors(corsOptions), (request, response) => {

        response.writeHead(200, { 'Content-Type': 'text/plain' });

        response.end('Hello World\n');

    })

});

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