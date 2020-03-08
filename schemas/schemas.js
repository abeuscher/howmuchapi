const mongoose = require('mongoose');

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
            scores: {
                layout: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
                },
                staff: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
                },
                pricing: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
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
        "flower": {
            strain: {
                type: String,
                default:"Name of Strain"
            },
            distributor: {
                type: String,
                default:"Distributor / Grower"
            },
            thc: {
                type: Number,
                default:15.00,
                min:0.01,
                max:40.00,
                step:.01
            },
            weight: {
                type: Number,
                default:3.5,
                min:1,
                max:28.5,
                step:.1
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
            scores: {
                strength: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
                },
                taste: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
                },
                appearance: {
                    type: Number,
                    min:1,
                    max:10,
                    default:5
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
        "purchase":{
            thc: {
                type: Number,
                default:15.00,
                min:0.01,
                max:40.00,
                step:.01
            },
            flower:{
                ref:"flower",
                type: mongoose.Schema.Types.ObjectId
            },
            dispensary:{
                ref:"dispensary",
                type: mongoose.Schema.Types.ObjectId
            },
            weight: {
                type: Number,
                default:3.5,
                min:1,
                max:28.5,
                step:.1
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
            created: {
                type: Date,
                default: Date.now
            }      
        }
    }
}

module.exports = AppSchemas;
