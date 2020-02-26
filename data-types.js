function HowMuchDataTypes() {
    return {
        "dispensary": {
            images: [{
                path: String,
                caption: String
            }],
            address: {
                "street": String,
                "city": String,
                "state": String,
                "country": String,
                "google_maps_link": String
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "productEntry": {
            images: [{
                path: String,
                caption: String
            }],
            thc: Number,
            weight: Number,
            price: Number,
            purchase_date: Date,
            package_date: Date,
            simple_score: Number,
            full_scores: {
                "strength": Number,
                "taste": Number,
                "appearance": Number,
            },
            created: {
                type: Date,
                default: Date.now
            }
        }
    }
}

module.exports = HowMuchDataTypes;
