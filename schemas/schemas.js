function AppSchemas() {
    return {
        "dispensary": {
            title: String,
            street: String,
            city: String,
            state: String,
            country: String,
            google_maps_link: String,
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
            created: {
                type: Date,
                default: Date.now
            }
        },
        "flower": {
            strain: String,
            distributor: String,
            thc: Number,
            weight: Number,
            price: Number,
            purchase_date: Date,
            package_date: Date,
            overall_score: Number,
            strength: Number,
            taste: Number,
            appearance: Number,
            scores:{
                strength: Number,
                taste: Number,
                appearance: Number
            },
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
            created: {
                type: Date,
                default: Date.now
            }
        }
    }
}

module.exports = AppSchemas;
