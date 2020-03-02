
import React, { Component } from 'react'

import TextInput from "./form-fields/text-input"
import DateInput from "./form-fields/date-input"
import ImageUploader from "./form-fields/image-uploader"

import transformSchema from '../transforms/transform-schema'
import transformEntry from '../transforms/transform-entry'
import transformState from '../transforms/transform-state'
import { layer } from '@fortawesome/fontawesome-svg-core'

export default class WeedForm extends Component {

    constructor(props) {
        super(props);

        //Set default state. TODO: Offload the paths to another file mebbe
        this.state = !this.state ? this.blankEntry : this.state;

        // Set default State with schema and defaults from props. The transform converts data types to objects that hold a value.
        this.state.currentRecord = Object.assign({}, this.state.currentRecord, transformSchema(this.state.blankSchema));

        //Check for record saved locally so app can be refreshed and save state. TODO: List this to the app level once menu is added.
        if (this.props.recordid) {
            this.getEntry(this.props.recordid);
        }

    }
    blankEntry = {
        uploading: false, error: "", 
        blankSchema: require("../../../../schemas/schemas.js")()[this.props.type],
        currentRecord: {}
    }

    removeImage = path => {
        // Remove an image given its path. This may not be a good permanent soluton, May need to assign everything a unique id for DOM.
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { images: this.state.currentRecord.images.filter(image => image.path !== path) })
        })
    }

    writeError = msg => {
        this.setState({ error: msg });
        setTimeout(() => { this.setState({ error: "" }) }, 5000);
    }

    updateEntry = e => {
        e.preventDefault();

        // Transform current state into key/value object for update.
        let sendData = JSON.stringify(transformState(this.state.currentRecord));
        this.props.api.update(sendData)
            .then(res => {
                let newState = transformEntry(this.state.currentRecord, res);
                this.setState({ currentRecord: Object.assign({}, newState, this.state.currentRecord) });
                this.writeError("Entry Updated");
            });

    }


    deleteEntry = e => {

        // Delete an entry from DB. TODO: This doesn't work.
        this.props.api.deleteRecord(this.state.currentRecord.id)
            .then(res => {
                if (res.ok) {
                    this.writeError("Record Deleted")
                    this.setState({
                        edit: false,
                        currentRecord: Object.assign({}, transformSchema(this.state.blankSchema))
                    });
                }
            });
    }

    getEntry = id => {

        // Get entry based on id. Currently this can only be passedin via props. That might be right?
        this.props.api.getById(id)
            .then(res => {
                if (!res.error) {
                    let newState = { currentRecord: transformEntry(this.state.currentRecord, res) };
                    newState.currentRecord.id = id;
                    newState.edit = true;
                    this.setState(Object.assign({}, this.state, newState));
                }
                else {
                    this.setState({ edit: false });
                    this.state.currentRecord = Object.assign({}, this.state.currentRecord, transformSchema(this.state.blankSchema));
                }

            });
    }

    createRecord = e => {

        e.preventDefault();

        // Transform state into DB record format then insert.
        var sendData = JSON.stringify(transformState(this.state.currentRecord))

        this.props.api.createRecord(sendData)
            .then(data => {
                // Set record id and shift to edit mode.
                this.setState({ edit: true, currentRecord: Object.assign({}, this.state.currentRecord, { id: data._id }) });
            });
    }

    onImageUploaderChange = e => {
        
        // Set state to uploading. Hard to test in local because of speed.
        this.setState({ uploading: true })

        this.props.api.createImage(e)
            .then(images => {
                this.setState({
                    uploading: false,
                    currentRecord: Object.assign({}, this.state.currentRecord, { images: this.state.currentRecord.images.concat(images) })
                })
            })
    }

    handleChange = e => {

        // Take form field change and add it to state.
        e.preventDefault();
        let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { [e.target.name]: { value: newValue, type: this.state.currentRecord[e.target.name].type } })
        });

    }
    changeDate(newValue, label) {

        // Process date field change
        this.setState({
            currentRecord: Object.assign({}, this.state.currentRecord, { [label]: { value: newValue, type: this.state.currentRecord[label].type } })

        });
    }


    render() {

        //console.log("Render state:", this.state);
        let formState = { currentRecord: { images: [] } }, self = this;

        // Map out form field instructions for Data types. TODO: Add validation.
        let typeMap = {
            Date: {
                el: (obj, key, id) => {
                    return pug`
                    DateInput(key=key,value=self.state.currentRecord[key].value,label=key,id=key,selected=self.state.currentRecord[key].value,onChange=(date) => self.changeDate(date,key))` },
                validator: {},
                containerClassName: "col-half"
            },
            Number: {
                el: (obj, key) => {
                    return pug`
                    TextInput(key=key,id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state.currentRecord[key].value)` },
                validator: {},
                containerClassName: "col-half"
            },
            String: {
                el: (obj, key) => {
                    return pug`
                    TextInput(key=key,id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state.currentRecord[key].value)`},
                validator: {},
                containerClassName: "col-half"
            },
            Images: {
                el: (obj, key) => {
                    return pug`
                    ImageUploader(key=key,uploading=self.state.uploading,onChange=self.onImageUploaderChange, images=self.state.currentRecord.images, removeImage=self.removeImage)`},
                validator: {},
                containerClassName: "col-full"
            }
        };
        Object.keys(this.state.currentRecord).map(key => {
            if (this.state.currentRecord[key]) {
                if (this.state.currentRecord[key].type != undefined) {
                    formState.currentRecord[key] = Object.assign({}, { formControl: typeMap[this.state.currentRecord[key].type] }, this.state.currentRecord[key])
                }
                else if (key == "images") {
                    formState.currentRecord[key] = Object.assign({}, { formControl: typeMap["Images"] }, this.state.currentRecord[key])
                }
            }

        });
        formState = Object.assign({}, this.state, formState);
        return pug`
    form(onSubmit=this.createRecord,method="post")
        .form-row(key="fr-1")
            - let counter = 0;
            for key in Object.keys(formState.currentRecord)
                if formState.currentRecord[key]
                    if formState.currentRecord[key].formControl
                        div(key='form-row-'+counter,className=formState.currentRecord[key].formControl.containerClassName)=formState.currentRecord[key].formControl.el(formState.currentRecord[key],key)
                        - counter++
        .form-row(key="fr-2")
            .col-full
                if this.state.edit == true && this.state.currentRecord.id
                    button(id='btn-update',onClick=this.updateEntry) Update Record
                    button(id='btn-delete',onClick=this.deleteEntry) Delete Record
                else
                    button(id='btn-submit',type="submit") Send Form
            .col-full.alert-box
                p=this.state.error
`
    }
}
module.exports = WeedForm;