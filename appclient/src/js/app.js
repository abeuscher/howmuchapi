import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import WeedForm from "./components/form.js";
import Menu from "./components/menu.js";
import Manager from "./components/manager.js";

const navButtons = [{
    label:"Manage Collections",
    
}];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode:"create", // manager, edit, or create
            type:"dispensary", // dispensary or flower
        };
        this.state.menuButtons = [{
            label:"Manage Entries",
            onClick:this.startManager,
        },{
            label:"Edit Entry",
            onClick:()=>{ return "clicked Edit"; },
        },{
            label:"New Entry",
            onClick:this.startNewEntry,
        },{
            label:"Change Type",
            onClick:this.changeType,
        }]
        
    }
    startManager = () => {
        this.setState({mode:"manager"});
    }
    startNewEntry = () => {
        this.setState({mode:"create"});
    }
    setLocalStorage = () => {
        window.sessionStorage.setItem("weedstate");
    }
    changeType = () => {
        this.setState({type:this.state.type=="dispensary"?"flower":"dispensary"});
        console.log(this.state.type)
    }
    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("weedstate");
        var f = window.sessionStorage.getItem("weedstate");
    }
    getLocalStorage = () => {
        if (window.sessionStorage.getItem("weedstate") != undefined) {
            this.getEntry(JSON.parse(window.sessionStorage.getItem("weedstate")).id);
            return true;
        }
        return false;
    }

    getEntries = () => {
        
        return fetch("http://localhost:5000", {
            method:"post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: {range:"all"}
        })
        .then(res=>{res.json() })
        .then(res=>{
            return res;
        })
    }
    render() {
        const { mode, type } = this.state;
        console.log(mode,type)
        const appContent = () => {
            
            switch (mode) {
                case "create":
                    return pug `WeedForm(type=type)`
                case "manager":
                    return pug `Manager(type=type)`
                default:
                    return pug `WeedForm(type=type)`
            }
        }

        return pug`
        Menu(buttons=this.state.menuButtons)
        .app-content=appContent()
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