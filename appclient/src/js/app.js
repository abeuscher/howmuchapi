import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import WeedForm from "./components/form.js";
import Menu from "./components/menu.js";
import Manager from "./components/manager.js";

import TextInput from "./components/form-fields/text-input"
import DateInput from "./components/form-fields/date-input"
import ImageUploader from "./components/form-fields/image-uploader"

import transformSchema from './transforms/transform-schema'
import assignTypes from './transforms/assign-types'
import transformState from './transforms/transform-state'

import apiConnector from './components/api-connector'

import Schemas from '../../../schemas/schemas.js'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            settings: {
                mode: "create", // manager, edit, or create
                type: "flower", // dispensary or flower  
                currentid: null
            },
            msgbox: "",
            entries: [],
            currentRecord: {},
        }, this.getLocalStorage());
    }
    menuButtons = () => {
        return [{
            label: "Manage Entries",
            onClick: this.startManager,
            buttonType: "simple"
        }, {
            label: "New Entry",
            onClick: this.startCreate,
            buttonType: "simple"
        }, {
            label: "Change Type",
            onClick: this.changeType,
            buttonType: "type",
            options: ["flower", "dispensary"]
        }]
    }

    formFieldTypes = () => {
        return {
            Date: {
                el: (obj, key, id, currentRecord=this.state.currentRecord, changeDate=(date) => this.changeDate(date,key)) => {
                    return pug`DateInput(key=key,value=currentRecord[key].value,label=key,id=key,selected=currentRecord[key].value,onChange=changeDate)`
                },
                validator: {},
                containerClassName: "col-half"
            },
            Number: {
                el: (obj, key, currentRecord=this.state.currentRecord,handleChange=this.handleChange) => {
                    return pug`TextInput(key=key,id=key,placeholder=key,label=key,handleChange=handleChange,value=currentRecord[key].value)`
                },
                validator: {},
                containerClassName: "col-half"
            },
            String: {
                el: (obj, key, currentRecord=this.state.currentRecord,handleChange=this.handleChange) => {
                    return pug`TextInput(key=key,id=key,placeholder=key,label=key,handleChange=handleChange,value=currentRecord[key].value)`
                },
                validator: {},
                containerClassName: "col-half"
            },
            Images: {
                el: (obj, key, currentImages = this.state.currentRecord.images.value, onChange = this.onImageUploaderChange, removeImage = this.removeImage,uploading=this.state.uploading) => {
                    return pug`ImageUploader(key=key,onChange=onChange,images=currentImages,removeImage=removeImage,uploading=uploading)`
                },
                validator: {},
                containerClassName: "col-full"
            }
        }
    }

    createBlankEntry = () => {
        return assignTypes(Schemas()[this.state.settings.type], {}, this.formFieldTypes)
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        switch (this.state.settings.mode) {
            case "manager":
                return this.getEntries()
            case "edit":
                this.createBlankEntry()
                return this.editEntry(this.state.settings.currentid)
            case "create":
                return this.startCreate()
        }
        if (this.state.settings.mode == "manager") {
            this.getEntries()
        }
    }

    componentDidUpdate() {
        this.setLocalStorage();
    }   

    startManager = () => {
        this.setState({ settings: Object.assign({}, this.state.settings, { mode: "manager", currentid: null }), currentRecord: null }, this.getEntries());
    }

    startCreate = () => {
        this.setState({ settings: Object.assign({}, this.state.settings, { mode: "create", currentid: null }),
                        entries: [],
                        currentRecord:this.createBlankEntry() });
    }

    changeType = e => {
        switch(this.state.settings.mode) {
            case "create":
            case "edit":
                this.setState({ settings: Object.assign({}, this.state.settings, { type: e.target.getAttribute("data-value") })},this.startCreate);
                break;
            case "manager":
                this.setState({
                    settings: { type: e.target.getAttribute("data-value"), mode:"manager",currentid:null },
                }, this.getEntries);     
                break;           
        }
    }

    setLocalStorage = () => {
        if (this.state.settings.currentid) {
            window.sessionStorage.setItem("weedstate", JSON.stringify(this.state.settings));
        }  
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("weedstate") != undefined) {
            return { settings: JSON.parse(window.sessionStorage.getItem("weedstate")) };
        }
        return {};
    }

    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("weedstate");
        var f = window.sessionStorage.getItem("weedstate");
    }

    updateEntry = e => {
        e.preventDefault();

        // Transform current state into key/value object for update.
        let sendData = JSON.stringify(Object.assign({},transformState(this.state.currentRecord),{id:this.state.settings.currentid}));
        apiConnector("update", sendData, this.state.settings.type)
            .then(res => {
                if (res._id) {
                    this.writeError("Entry Updated");
                }
                else {
                    this.writeError("Error on Update");
                    console.log("Error response:", res);
                }
            });

    }

    createNewEntry = e => {
        e.preventDefault();

        // Transform state into DB record format then insert.
        var sendData = JSON.stringify(transformState(this.state.currentRecord))

        apiConnector("create", sendData, this.state.settings.type)
            .then(data => {
                // Set record id and shift to edit mode.
                this.setState({ 
                            settings: {
                                mode:"edit",
                                type:this.state.settings.type,
                                currentid: data._id
                            },
                            currentRecord: Object.assign({}, this.state.currentRecord, { id: data._id })       
                        })         
            });
    }

    editEntry = id => {

        apiConnector("read", JSON.stringify({ "id": id }), this.state.settings.type)
            .then(res => {
                if (!res.error) {
                    this.setState({
                        currentRecord: assignTypes(Schemas()[this.state.settings.type], res, this.formFieldTypes),
                        settings: Object.assign({}, this.state.settings, { currentid: id, mode: "edit" })
                    });
                }
                else {
                    this.setState({
                        currentRecord: Object.assign({}, this.state.currentRecord, transformSchema(this.state.blankSchema)),
                        settings: Object.assign({}, this.state.settings, { mode: "create" })
                    })
                }
            });
        this.setState({ settings: Object.assign({}, this.state.settings, { currentid: id, mode: "edit" }) });
    }

    chooseEntry = idx => {

        this.setState({
            settings:{
                mode:"edit",
                type:this.state.settings.type,
                currentid:this.state.entries[idx]._id
            },
            entries:[],
            currentRecord:assignTypes(Schemas()[this.state.settings.type], this.state.entries[idx], this.formFieldTypes)
        })
    }

    getEntries = () => {
        apiConnector("read", "{}", this.state.settings.type)
            .then(res => {
                this.setState({ entries: res })
            })
    }

    deleteEntry = e => {

        // Delete an entry from DB. TODO: This doesn't work.
        apiConnector("delete", JSON.stringify({ "id": this.state.settings.currentid }), this.state.settings.type)
            .then(res => {
                if (res.ok) {
                    this.writeError("Record Deleted")
                    this.startCreate();
                }
            });
    }

    onImageUploaderChange = e => {
        this.setState({
            uploading:true
        })
        apiConnector("createImage", e, this.state.settings.type)
            .then((images) => {
                this.setState({
                    uploading: false,
                    currentRecord: Object.assign({}, this.state.currentRecord, { images: Object.assign({},this.state.currentRecord.images, { value : this.state.currentRecord.images.value.concat(images)}) })
                })
            })
    }

    removeImage = path => {
        // Remove an image given its path. This may not be a good permanent soluton, May need to assign everything a unique id for DOM.
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { images: Object.assign({},this.state.currentRecord.images, { value : this.state.currentRecord.images.value.filter(image => image.path !== path)}) })
        })
    }

    handleChange = e => {

        // Take form field change and add it to state.
        e.preventDefault();
        let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { [e.target.name]: Object.assign({},this.state.currentRecord[e.target.name], { value: newValue }) })
        });

    }

    changeDate(newValue, label) {
        // Process date field change
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { [label]: Object.assign({}, this.state.currentRecord[label], { value: newValue }) })

        });
    }

    writeError = msg => {
        this.setState({ error: msg });
        setTimeout(() => { this.setState({ error: "" }) }, 5000);
    }

    render() {
        return pug`
        Menu(
            key="main-nav-bucket",
            buttons=this.menuButtons,
            selectedType=this.state.settings.type
            )
        if this.state.settings.mode=="create" || this.state.settings.mode=="edit"
            WeedForm(
                key='form-main',
                currentRecord=this.state.currentRecord,
                createEntry=this.createNewEntry,
                updateEntry=this.updateEntry,
                deleteEntry=this.deleteEntry,
                mode=this.state.settings.mode,
                msg=this.state.msgbox,
                type=this.state.settings.type,
                id=this.state.settings.currentid
                )
        if this.state.settings.mode=="manager"
            Manager(
                key='manager-main',
                type=this.state.settings.type,
                entries=this.state.entries,
                chooseEntry=this.chooseEntry
                )`
    }
}
ReactDOM.render(<App key="main-app" />, document.getElementById('weed-form'));