import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import EditForm from "./components/form.js";
import PurchaseForm from "./components/purchase-form.js";
import Menu from "./components/menu.js";
import Manager from "./components/manager.js";

import TextInput from "./components/form-fields/text-input"
import RangeInput from "./components/form-fields/range-input"
import StateDropDown from "./components/form-fields/state-dropdown"
import FieldSelect from "./components/form-fields/field-select"
import CurrencyInput from "./components/form-fields/currency-input"
import WeightInput from "./components/form-fields/weight-input"
import DateInput from "./components/form-fields/date-input"
import WysiwygInput from "./components/form-fields/wysiwyg-input"
import ImageUploader from "./components/form-fields/image-uploader"

import assignTypes from './transforms/assign-types'
import transformState from './transforms/transform-state'

import apiConnector from './components/api-connector'

import Schemas from '../../../schemas/schemas.js'

/*

    App flow:
     - User starts on "Enter Purchase"
     - From there, if they are missing any of the other fields, they can assign names to stubs from within the form
     - Menu
      - On user intro, they have to choose what they like to call weed. Then it is used throughout navand text. Interesting idea.
      - "I CONSUMED", "I PURCHASED","STATS","REVIEWS"
        - Manager // Built
            - Welcome message // TODO
            - Manage entries of all types // Built. TOD: Controls
            - Edit Entry // Built. TODO: Rework controls to handle subfield names / data
            - Create New Entry of Type
            - Maybe a photo / upload manager
        - Data Playground
            - Ways to manipulate the data
        - Reviews
            - Add / Edit Reviews
            - Browse Reviews
        - Enter Purchase
            - I mean, it's a form. Plus poison. We'll add some poison.

*/




class App extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            settings: {
                mode: "create", // manager, edit, or create
                type: "purchase", // dispensary or flower  
                currentid: null // active record id
            },
            msgbox: "", // Alert Message at bottom of form. TODO: Make this an object with references to all form fields
            entries: [], // Entries when in manager mode
            selectEntries: {}, //Entries for select menus TODO: This does not feel right. Make it better.
            currentRecord: {}, // Current record when editing
        }, this.getLocalStorage()); // Merge object with current save state in local storage - just the settings portion of the state.
    }

    // Buttons for App Menu
    menuButtons = layoutName => {
        var configs = {
            "default": [{
                label: "Manage Entries",
                onClick: this.startManager,
                buttonType: "simple"
            }, {
                label: "New Entry",
                onClick: this.startNewPurchase,
                buttonType: "simple"
            }],
            "manager": [{
                label: "Manage Entries",
                onClick: this.startManager,
                buttonType: "simple"
            }, {
                label: "New Entry",
                onClick: this.startCreate,
                buttonType: "simple"
            }, {
                label: "Record Type",
                onClick: this.changeType,
                buttonType: "type",
                options: Object.keys(Schemas())
            }]
        }

        return configs[layoutName]

    }
    // Form field Elements. TODO: This is where to add validation.
    formFieldTypes = () => {
        return {
            _id: {
                el: (obj, key, parent, handleChange = this.handleChange, populate = this.populateFieldSelect, entries = this.state.selectEntries, addNewSubfield = this.addNewSubfield, editSubRecord = this.editSubRecord) => {
                    return pug`
                        FieldSelect(
                            key=key,
                            ref=obj[key].ref,
                            value=obj[key].value,
                            textValue=obj[key].textValue,
                            label=key.replace(/_/gi," "),
                            id=key,
                            handleChange=handleChange,
                            addNewSubfield=addNewSubfield,
                            newRecord=obj[key].newRecord,
                            editSubRecord=editSubRecord,
                            entries=entries,
                            parent=parent,
                            populate=populate
                            )`
                },
                validator: {},
                containerClassName: "col-full"
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
                containerClassName: "col-full"
            },
            Number: {
                el: (obj, key, parent, handleChange = this.handleChange) => {
                    if (key == "weight") {
                        return pug`
                            WeightInput(
                                key=key,
                                id=key,
                                label=key.replace(/_/gi," "),
                                handleChange=handleChange,
                                value=obj[key].value,
                                parent=parent
                                )`
                    }
                    else if (key == "price") {
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
                    else if (obj[key].min >= 0) {
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
                containerClassName: "col-full"
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
                    else if (obj[key].label == "wysiwyg") {
                        return pug`
                            WysiwygInput(
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
                containerClassName: "col-full"
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
    editSubRecord = (e, id, key, parent) => {
        e.preventDefault();
        console.log(id, key, parent)
    }
    addNewSubfield = (e, key, parent) => {
        e.preventDefault();
        if (this.state.currentRecord[key].newRecord == true) {
            this.state.currentRecord[key].newRecord = false;
            this.state.currentRecord[key].value = this.state.currentRecord[key].oldValue || ""
        }
        else {
            this.state.currentRecord[key].newRecord = true
            this.state.currentRecord[key].oldValue = this.state.currentRecord[key].value || ""
            this.state.currentRecord[key].value = ""
        }
        this.setState(this.state)
    }
    createBlankEntry = () => {
        return assignTypes(Schemas()[this.state.settings.type], {}, this.formFieldTypes)
    }
    startNewPurchase = () => {
        this.setState({
            settings: Object.assign({}, this.state.settings, { type: "purchase" })
        });
        this.startCreate();
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
        console.log("start manager")
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

        const updateRecord = data => {
            let sendData = JSON.stringify(Object.assign({}, data, { id: this.state.settings.currentid }));

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

        // Transform current state into key/value object for update.
        let newData = transformState(this.state.currentRecord)
        if (newData.extraRecords.length > 0) {
            this.processNewSubfields(newData, updateRecord)
        }
        else {
            console.log(newData)
            updateRecord(newData.mainRecord)
        }
    }

    createNewEntry = e => {
        e.preventDefault();
        const createRecord = data => {
            // Transform state into DB record format then insert.
            var sendData = JSON.stringify(data)

            apiConnector("create", sendData, this.state.settings.type)
                .then(res => {
                    // Set record id and shift to edit mode.
                    if (res._id) {
                        this.setState({
                            settings: {
                                mode: "edit",
                                type: this.state.settings.type,
                                currentid: res._id
                            }
                        })
                    }
                    else {
                        console.log("ERROR ON CREATE", data)
                    }
                });
        }
        let newData = transformState(this.state.currentRecord)
        if (newData.extraRecords.length > 0) {
            this.processNewSubfields(newData, createRecord)
        }
        else {
            createRecord(newData.mainRecord)
        }
    }

    processNewSubfields = (processRecord, cb) => {
        processRecord.extraRecords.forEach((data, idx) => {
            apiConnector("create", JSON.stringify(data.record), data.type)
                .then(res => {
                    if (res._id) {
                        this.populateFieldSelect(data.key)
                        processRecord.mainRecord[data.key] = { ref: data.type, _id: res._id }
                        this.setState({
                            currentRecord: Object.assign({}, this.state.currentRecord, { [data.key]: Object.assign({}, this.state.currentRecord[data.key], { newRecord: false, value: res._id }) })
                        })
                        if (idx == processRecord.extraRecords.length - 1) {
                            cb(processRecord.mainRecord);
                        }
                    }
                    else {
                        this.writeError("ERROR ON SUBFIELD ENTRY: ", data)
                    }

                })

        })
    }

    editEntry = id => {

        apiConnector("read", JSON.stringify({ "id": id }), this.state.settings.type)
            .then(res => {
                if (!res.error) {
                    delete res.id
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
        if (this.state.entries[idx]) {
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
        else {
            this.writeError("Failed to find entry.")
        }

    }

    populateFieldSelect = key => {
        apiConnector("read", "{}", key)
            .then(res => {
                if (res.length) {
                    this.setState({
                        selectEntries: Object.assign(
                            {},
                            this.state.selectEntries,
                            { [key]: res })
                    })
                }
                else {
                    this.state.currentRecord[key].newRecord = true
                    this.setState(this.state)
                }
                if (this.state.currentRecord[key]) {
                    var t = res.filter(data=>{return data._id==this.state.currentRecord[key].value});
                    this.state.currentRecord[key].textValue= t.length < 1 ? "[select a "+key+"]" : res.filter(data=>{return data._id==this.state.currentRecord[key].value})[0].title
                    this.setState(this.state)
                }
                
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

        let newValue = "ERROR ON UPDATE"
        let name = "NAME NOT DEFINED"
        e.preventDefault()

        if (e.target.type === "select-one") {

            // Catch the "create new record" item in the field select drop down. Probably a better place to trigger this in future.
            if (e.target.options[e.target.selectedIndex].value == "create-new") {
                this.addNewSubfield(e, e.target.id, e.target.getAttribute("data-parent"))
                return;
            }
            else {
                newValue = e.target.options[e.target.selectedIndex].value;
                name = e.target.name
                if (e.target.getAttribute("data-parent") != "false") {
                    this.state.currentRecord[e.target.getAttribute("data-parent")][name].textValue = e.target.options[e.target.selectedIndex].innerHTML
                }
                else {
                    this.state.currentRecord[name].textValue = e.target.options[e.target.selectedIndex].innerHTML
                }
            }

        }
        else if (e.target.type === "checkbox") {
            newValue = e.target.checked
            name = e.target.name
        }
        else {
            newValue = e.target.value
            name = e.target.name
        }

        if (e.target.getAttribute("data-parent") != "false") {
            this.state.currentRecord[e.target.getAttribute("data-parent")][name].value = newValue
        }
        else {
            this.state.currentRecord[name].value = newValue
        }
        this.setState(this.state);
    }

    changeDate = (newValue, label) => {
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
        if this.state.settings.mode=="create" || this.state.settings.mode=="edit"
            Menu(
                key="main-nav-bucket",
                buttons=this.menuButtons("default")
                selectedType=this.state.settings.type
                )
            if this.state.settings.type=="purchase"
                PurchaseForm(
                    currentRecord=this.state.currentRecord,
                    handleChange=this.handleChange,
                    createEntry=this.createNewEntry,
                    updateEntry=this.updateEntry,
                    deleteEntry = this.deleteEntry,
                    mode = this.state.settings.mode,
                    msg = this.state.error,
                    populate = this.populateFieldSelect,
                    entries = this.state.selectEntries, 
                    addNewSubfield = this.addNewSubfield, 
                    editSubRecord = this.editSubRecord
                )
            else
                EditForm(
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
            Menu(
                key="main-nav-bucket",
                buttons=this.menuButtons("manager"),
                selectedType=this.state.settings.type
                )
            Manager(
                key='manager-main',
                type=this.state.settings.type,
                entries=this.state.entries,
                chooseEntry=this.chooseEntry
                )`
    }
}
ReactDOM.render(<App key="main-app" />, document.getElementById('weed-form'));