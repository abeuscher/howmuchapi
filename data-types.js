function HowMuchDataTypes() {
    return {
        "dispensary": {
            images: [{
                fieldname: String,
                originalname: String,
                encoding: String,
                mimetype: String,
                destination: String,
                filename: String,
                path: String,
                size: Number
            }],
            "street": String,
            "city": String,
            "state": String,
            "country": String,
            "google_maps_link": String,
            created: {
                type: Date,
                default: Date.now
            }
        },
        "flower": {
            images: [{
                fieldname: String,
                originalname: String,
                encoding: String,
                mimetype: String,
                destination: String,
                filename: String,
                path: String,
                size: Number
            }],
            strain: String,
            distributor: String,
            thc: Number,
            weight: Number,
            price: Number,
            purchase_date: Date,
            package_date: Date,
            simple_score: Number,
            strength: Number,
            taste: Number,
            appearance: Number,
            created: {
                type: Date,
                default: Date.now
            }
        }
    }
}

module.exports = HowMuchDataTypes;