import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import mongoose from 'mongoose'

import apiConnector from './components/api-connector'

import appSchemas from '../../../schemas/schemas.js'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            settings: {
                mode: "manager", // manager, edit, or create
                type: "flower", // dispensary or flower  
                currentid: null // active record id
            },
            data: {
                entries: [], // Entries when in manager mode
                currentRecord: {}, // Current record when editing
                schemas:{}
            },
            msgbox: "", // Alert Message at bottom of form. TODO: Make this an object with references to all form fields
        }
        let s = appSchemas()
        Object.keys(s).map(key => {
            this.state.data.schemas[key] = new mongoose.Schema(s[key]);
            console.log(this.state.data.schemas[key].toJSON())
        });
        console.log(this.state.data.schemas)

    }
    render() {
        return pug`
            p Hello World`
    }
}
ReactDOM.render(<App />, document.getElementById('weed-form'));