import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import WeedForm from "./components/form.js";
import Menu from "./components/menu.js";
import Manager from "./components/manager.js";

import TextInput from "./components/form-fields/text-input"
import RangeInput from "./components/form-fields/range-input"
import StateDropDown from "./components/form-fields/state-dropdown"
import FieldSelect from "./components/form-fields/field-select"
import CurrencyInput from "./components/form-fields/currency-input"
import DateInput from "./components/form-fields/date-input"
import ImageUploader from "./components/form-fields/image-uploader"

import assignTypes from './transforms/assign-types'
import transformState from './transforms/transform-state'

import apiConnector from './components/api-connector'

import Schemas from '../../../schemas/schemas.js'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            settings: {
                mode: "manager", // manager, edit, or create
                type: "flower", // dispensary or flower  
                currentid: null // active record id
            },
            msgbox: "", // Alert Message at bottom of form. TODO: Make this an object with references to all form fields
            entries: [], // Entries when in manager mode
            selectEntries:{}, //Entries for select menus TODO: This does not feel right. Make it better.
            currentRecord: {}, // Current record when editing
        }, this.getLocalStorage()); // Merge object with current save state in local storage - just the settings portion of the state.
    }

    // Buttons for App Menu
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
            label: "Type",
            onClick: this.changeType,
            buttonType: "type",
            options: Object.keys(Schemas())
        }]
    }
    // Form field Elements. TODO: This is where to add validation.
    formFieldTypes = () => {
        return {
            _id: {
                el: (obj, key, parent, handleChange=this.handleChange, populate=this.populateFieldSelect, entries=this.state.selectEntries) => {
                    return pug`
                        FieldSelect(
                            key=key,
                            ref=obj[key].ref,
                            value=obj[key].value,
                            label=key.replace(/_/gi," "),
                            id=key,
                            handleChange=handleChange,
                            entries=entries,
                            parent=parent,
                            populate=populate
                            )`
                },
                validator: {},
                containerClassName: "col-half"                
            },
            Date: {
                el: (obj, key, parent, id, changeDate = (date) => this.changeDate(date, key)) => {
                    return pug`
                        DateInput(
                            key=key,
                            value=obj[key].value,
                            label=key.replace(/_/gi," "),
                            id=key,selected=obj[key].value,
                            onChange=changeDate,
                            parent=parent
                            )`
                },
                validator: {},
                containerClassName: "col-half"
            },
            Number: {
                el: (obj, key, parent, handleChange = this.handleChange, handleCurrencyChange=this.handleCurrencyChange) => {
                    if (obj[key].min >= 0) {
                        return pug`
                            RangeInput(
                                key=key,
                                min=obj[key].min,
                                max=obj[key].max,
                                step=obj[key].step || 1,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`
                    }
                    else if (key=="price") {
                        return pug`
                            CurrencyInput(
                                key=key,
                                min=obj[key].min,
                                max=obj[key].max,
                                step=obj[key].step || 1,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`                        
                    }
                    else {
                        return pug`
                            TextInput(
                                key=key,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`
                    }

                },
                validator: {},
                containerClassName: "col-half"
            },
            String: {
                el: (obj, key, parent, handleChange = this.handleChange) => {
                    if (obj[key].label == "AL") {
                        return pug`
                            StateDropDown(
                                key=key,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`
                    }
                    else {
                        return pug`
                            TextInput(
                                key=key,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`
                    }

                },
                validator: {},
                containerClassName: "col-half"
            },
            Images: {
                el: (obj, key, parent, currentImages = this.state.currentRecord.images.value, onChange = this.onImageUploaderChange, removeImage = this.removeImage, uploading = this.state.uploading) => {
                    return pug`
                        ImageUploader(
                            key=key,
                            id=key,
                            onChange=onChange,
                            images=currentImages,
                            removeImage=removeImage,
                            uploading=uploading,parent=parent
                            )`
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
        switch (this.state.settings.mode) {
            case "manager":
                return this.getEntries()
            case "edit":
                return this.editEntry(this.state.settings.currentid)
            case "create":
                return this.startCreate()
        }
    }

    componentDidUpdate() {
        this.setLocalStorage();
    }

    startManager = () => {
        this.setState({ settings: Object.assign({}, this.state.settings, { mode: "manager", currentid: null }), currentRecord: null }, this.getEntries);
    }

    startCreate = () => {
        this.setState({
            settings: Object.assign({}, this.state.settings, { mode: "create", currentid: null }),
            entries: [],
            currentRecord: this.createBlankEntry()
        });
    }

    changeType = e => {
        //The logic here is not great. When you switch type the current record is immediately removed with no warning. Need to add an error system or notifications to handle this kind of thing.
        switch (this.state.settings.mode) {
            case "create":
            case "edit":
                this.setState({ settings: Object.assign({}, this.state.settings, { type: e.target.getAttribute("data-value") }) }, this.startCreate);
                break;
            case "manager":
                this.setState({
                    settings: { type: e.target.getAttribute("data-value"), mode: "manager", currentid: null },
                }, this.getEntries);
                break;
        }
    }

    setLocalStorage = () => {
        // Only save state if there is currently a record being edited.
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
        let sendData = JSON.stringify(Object.assign({}, transformState(this.state.currentRecord), { id: this.state.settings.currentid }));
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
        console.log(JSON.parse(sendData))
        apiConnector("create", sendData, this.state.settings.type)
            .then(data => {

                // Set record id and shift to edit mode.
                this.setState({
                    settings: {
                        mode: "edit",
                        type: this.state.settings.type,
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
                    this.writeError("Record Not Found!")
                    this.wipeLocalStorage();
                    this.startCreate()
                }
            });
        this.setState({ settings: Object.assign({}, this.state.settings, { currentid: id, mode: "edit" }) });
    }

    chooseEntry = idx => {

        this.setState({
            settings: {
                mode: "edit",
                type: this.state.settings.type,
                currentid: this.state.entries[idx]._id
            },
            entries: [],
            currentRecord: assignTypes(Schemas()[this.state.settings.type], this.state.entries[idx], this.formFieldTypes)
        })
    }

    populateFieldSelect = key => {
        apiConnector("read", "{}", key)
            .then(res => {
                
                this.setState({ 
                    selectEntries: Object.assign(
                        {},
                        this.state.selectEntries,
                        {[key]:res}) })
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
            uploading: true
        })
        apiConnector("createImage", e, this.state.settings.type)
            .then((images) => {
                this.setState({
                    uploading: false,
                    currentRecord: Object.assign({}, this.state.currentRecord, { images: Object.assign({}, this.state.currentRecord.images, { value: this.state.currentRecord.images.value.concat(images) }) })
                })
            })
    }

    removeImage = path => {
        // Remove an image given its path. This may not be a good permanent soluton, May need to assign everything a unique id for DOM.
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { images: Object.assign({}, this.state.currentRecord.images, { value: this.state.currentRecord.images.value.filter(image => image.path !== path) }) })
        })
    }

    handleChange = e => {
        // Take form field change and add it to state.
        e.preventDefault();
        console.log(e.target);
        // TODO: This is a shitty solution. Make better.
        let newValue = "ERROR ON UPDATE"
         
        if (e.target.type === "select-one") {     
            newValue = e.target.options[e.target.selectedIndex].value;
        }
        else if (e.target.type === "checkbox") {
            newValue = e.target.checked
        }
        else {
            newValue = e.target.value
        }
        if (e.target.getAttribute("data-parent") != "false") {
            this.setState({
                currentRecord: Object.assign({}, this.state.currentRecord, { [e.target.getAttribute("data-parent")]: Object.assign({}, this.state.currentRecord[e.target.getAttribute("data-parent")], { [e.target.name]: Object.assign({}, this.state.currentRecord[e.target.getAttribute("data-parent")][e.target.name], { value: newValue }) }) })
            });
        }
        else {
            this.setState({
                currentRecord: Object.assign({}, this.state.currentRecord, { [e.target.name]: Object.assign({}, this.state.currentRecord[e.target.name], { value: newValue }) })
            });

        }
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
                msg=this.state.error,
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