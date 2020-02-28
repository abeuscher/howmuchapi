const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("file-system");
const cors = require("cors");
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage }).array('file')

const CONNECTION_URL = "mongodb://mongodb/local";

const Entry = require("./schemas/entry.js");

var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
let corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}

app.listen(5000, () => {
    app.use("/uploads",Express.static('uploads'));
    app.post('/create/entry', cors(corsOptions), (request, response) => {
        mongoose.connect(CONNECTION_URL, function (err) {
            var newData = new Entry(request.body);
            //response.send(request.body);
            newData.save(function (err, data) {
                if (err) {
                    response.send(err);
                }
                else {
                    response.send("Saved." + data);
                }

            });
        });
    });
    app.post('/create/image', (req, res) => {

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            return res.status(200).send(req.files)

        })
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

        testUser.save(function (err) {
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