
var React = require('react');
var ReactDOM = require('react-dom');

const WeedForm = require("./components/form.js");


ReactDOM.render(<WeedForm/>, document.getElementById('weed-form'));

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