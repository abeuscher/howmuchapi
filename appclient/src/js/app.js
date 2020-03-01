import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import WeedForm from "./components/form.js";
import Menu from "./components/menu.js";

const navButtons = [{
    label:"Manage Collections",
    
}];

class App extends Component {
    render() {
        return pug`
        WeedForm(type="dispensary")
        `
    }
}
ReactDOM.render(<App/>, document.getElementById('weed-form'));

window.addEventListener("load", function() {

});
/*
CRUD App
 - Delete Not Working

Manager / App Controls
 - UI to allow user to browse and search records

Dispensary Form / Other Drill Down Forms
 - Build Form Engine that works off of schema
 - Figure out some way to inject extra info into Data Types for presentation layer where needed





*/