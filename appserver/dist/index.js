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
})
const upload = multer({ storage: storage }).array('file')

const CONNECTION_URL = "mongodb://mongodb/local";



var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

mongoose.connect(CONNECTION_URL);

const Entry = require("./schemas/entry.js");

let corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}

app.listen(5000, () => {
    app.use("/uploads",Express.static('uploads'));
    app.post('/create/entry', cors(corsOptions), (request, response) => {

            var newData = new Entry(request.body);
            //response.send(request.body);
            newData.save(function (err, data) {
                if (err) {
                    response.send(err);
                }
                else {
                    response.json(data);
                }

            });
    });
    app.post('/get/entry', cors(corsOptions), async (request, response) => {
        //response.write(request.body._id);
        //response.end();

            try {
                var result = await Entry.findById(request.body._id).exec();
                response.send(result);
            } catch (error) {
                response.status(500).send(error);
            }

        
    });
    app.post('/update/entry', cors(corsOptions), async (request, response) => {
        //response.write(request.body;
        //response.end();

        try {
            var entry = await Entry.findById(request.body.id).exec();
            entry.set(request.body);
            var result = await entry.save();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }

        
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