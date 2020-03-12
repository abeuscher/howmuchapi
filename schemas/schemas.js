const mongoose = require('mongoose');

/*
    Adding a field to the schema will add it throughout the app. A restart of the client and server is required.
    IT may be that I can remove this weird outer dependency on Mongoose, but after several tries to fix it while entering schema -> server I have given up for now.

    Dependency:
        New data types MUST have:
            title: {
                type: String,
                dafault: "State Your Name"
            },
            created: {
                type: Date,
                default: Date.now
            }

*/

function AppSchemas() {
    return {
        "dispensary": {
            title: {
                type: String,
                dafault: "Dispensary Name"
            },
            street_address: {
                street: {
                    type: String,
                    default: "123 Main St."
                },
                city: {
                    type: String,
                    default: "Springfield"
                },
                state: {
                    type: String,
                    default: "AL"
                },
                google_maps_link: {
                    type: String,
                    default: "Map Link"
                }
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
        },
        "product": {
            title: {
                type: String,
                default: "Product Name"
            },
            productType:{
                type:String,
                default:"Flower"
            },
            strain:{
                ref:"strain",
                type: mongoose.Schema.Types.ObjectId
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "strain":{
            title: {
                type:String,
                default:"Strain Name"
            },
            strainType:{
                type:String,
                default:"hybrid"
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "distributor": {
            title: {
                type: String,
                default: "Manufacturer / Distributor Name"
            },
            business_type: {
                type: String,
                default: "choices:['farm','distributor']"
            },
            website: {
                type:String,
                default:"http://example.com/"
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "review": {
            title: {
                type: String,
                default: "Title"
            },
            purchase: {
                ref: "purchase",
                type: mongoose.Schema.Types.ObjectId
            },
            scores: {
                strength: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 5
                },
                taste: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 5
                },
                appearance: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 5
                }
            },
            notes: {
                strength: {
                    type: String,
                    default: "wysiwyg"
                },
                taste: {
                    type: String,
                    default: "wysiwyg"
                },
                appearance: {
                    type: String,
                    default: "wysiwyg"
                },
                overall: {
                    type: String,
                    default: "wysiwyg"
                }
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "purchase": {
            title: {
                type: String,
                default: "Title"
            },
            thc: {
                type: Number,
                default: 15.00,
                min: 0.01,
                max: 40.00,
                step: .01
            },
            distributor: {
                ref:"distributor",
                type: mongoose.Schema.Types.ObjectId
            },
            product: {
                ref: "product",
                type: mongoose.Schema.Types.ObjectId
            },
            dispensary: {
                ref: "dispensary",
                type: mongoose.Schema.Types.ObjectId
            },
            weight: {
                type: Number,
                default: 3.5,
                min: 1,
                max: 28.5,
                step: .1
            },
            price: {
                type: Number,
                default: 50.00
            },
            purchase_date: {
                type: Date
            },
            package_date: {
                type: Date
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
