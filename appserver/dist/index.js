const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage }).array('file')

const CONNECTION_URL = "mongodb://mongodb/local";
const DataTypes = require("./data-types.js");


const app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}

mongoose.connect(CONNECTION_URL);

app.listen(5000, () => {
    const schemas = {};
    const models = {};
    Object.keys(DataTypes).map(key => {
        schemas[key] = new mongoose.Schema(DataTypes[key]);
        models[key] = () => { return mongoose.model(request.params.type, schemas[key]); };
    });

    app.use("/uploads", Express.static('uploads'));

    app.post('/get/:type', cors(corsOptions), async (request, response) => {

        try {
            var result = await Entry.findById(request.body._id).exec();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }


    });

    app.post('/update/:type', cors(corsOptions), async (request, response) => {



        try {
            let dbReq = await Entry.findById(request.body.id).exec();
            dbReq.set(request.body);
            let result = await dbReq.save();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }


    });

    app.post('/create/:type', (request, response) => {

        if (request.params.type == "image") {
            upload(request, response, function (err) {
                if (err instanceof multer.MulterError) {
                    return response.status(500).json(err)
                } else if (err) {
                    return response.status(500).json(err)
                }
                return response.status(200).send(request.files)
            });
        }
        else {
            let newData = new models[request.params.type];
            //response.send(request.body);
            newData.save(function (err, data) {
                if (err) {
                    response.send(err);
                }
                else {
                    response.json(data);
                }

            });
        }
    });
});