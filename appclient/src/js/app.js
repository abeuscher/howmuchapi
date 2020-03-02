import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import WeedForm from "./components/form.js";
import Menu from "./components/menu.js";
import Manager from "./components/manager.js";
import api from './components/api-connector'

const apiPaths = type => {
    return {
        createImage: "http://localhost:5000/create/image",
        create: "http://localhost:5000/create/" + type,
        read: "http://localhost:5000/get/" + type,
        update: "http://localhost:5000/update/" + type,
        delete: "http://localhost:5000/delete/" + type
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        
        this.state = Object.assign({},{
            settings: {
                mode: "create", // manager, edit, or create
                type: "dispensary", // dispensary or flower  
                currentId: null,
            },
            menuButtons: [{
                label: "Manage Entries",
                onClick: this.startManager,
                buttonType: "simple"
            }, {
                label: "New Entry",
                onClick: this.startNewEntry,
                buttonType: "simple"
            }, {
                label: "Change Type",
                onClick: this.changeType,
                buttonType: "type",
                options: ["dispensary", "flower"]
            }]
        },this.getLocalStorage());
        this.state.api = new api(apiPaths(this.state.settings.type));
    }

    changeMode = e => {

    }

    startManager = () => {
        this.setState({ settings: Object.assign({}, this.state.settings, { mode: "manager",currentId:null }) });
        this.getEntries();
    }

    startNewEntry = () => {
        this.setState({ settings: Object.assign({}, this.state.settings, { mode: "create" }) });
    }

    changeType = e => {
        let newType = e.target.getAttribute("data-value")
        this.setState({
            settings: Object.assign({}, this.state.settings, { type: newType }),
            api: new api(apiPaths(newType))
        });
    }

    setLocalStorage = () => {
        window.sessionStorage.setItem("weedstate",JSON.stringify(this.state.settings));
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("weedstate") != undefined) {
            return {settings:JSON.parse(window.sessionStorage.getItem("weedstate"))};
        }
        return {};
    }

    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("weedstate");
        var f = window.sessionStorage.getItem("weedstate");
    }

    editEntry = e => {
        e.preventDefault();
        this.setState({ settings: Object.assign({}, this.state.settings, { currentId: e.target.getAttribute("data-id"), mode: "create" }) });
    }

    getEntries = () => {

        this.state.api.getAll()
            .then(res => {
                this.setState({ entries: res })
            })
    }
    componentDidUpdate() {
        this.setLocalStorage();
    }
    render() {
        return pug`
        Menu(buttons=this.state.menuButtons,selectedType=this.state.settings.type)
        .app-content
            if this.state.settings.mode=="create"
                WeedForm(type=this.state.settings.type,api=this.state.api,recordid=this.state.settings.currentId)
            if this.state.settings.mode=="manager"
                Manager(type=this.state.settings.type,api=this.state.api,entries=this.state.entries,editEntry=this.editEntry)
        `
    }
}
ReactDOM.render(<App />, document.getElementById('weed-form'));

window.addEventListener("load", function () {

});
/*
CRUD App
 - Delete Not Working

Manager / App Controls
 - UI to allow user to browse and search records

Dispensary Form / Other Drill Down Forms
 - Figure out some way to inject extra info into Data Types for presentation layer where needed





*/