const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("file-system");
const cors = require("cors");


const CONNECTION_URL = "mongodb://mongodb/local";

const CreateEntry = require("./controllers/create.js");

var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
let corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}
app.listen(5000, () => {

    app.post('/', cors(corsOptions), (request, response) => {
        response.send(request.body.thc);
        //readDB(response, request);

    })
    app.post('/create/entry', cors(corsOptions), (request, response) => {
        //response.sendStatus(200);
        response.send(request.body.thc);
        
       
    })
});

function readDB(res, req) {


    mongoose.connect(CONNECTION_URL, function (err) {

        if (err) throw err;


        var testUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name: {
                firstName: 'Test',
                lastName: 'User'
            },
            email: 'test@example.com',
        });
         
        testUser.save(function(err) {
            if (err) throw err;
             
            console.log('Test User successfully saved.');
        });

        res.send('Successfully connected')

    });
    /*
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {

        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("testcollection");

        collection.find({}).toArray((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.send(result);
        });


    });
    */
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