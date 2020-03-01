
import React, { Component } from 'react'

import TextInput from "./form-fields/text-input.js"
import DateInput from "./form-fields/date-input.js"
import ImageUploader from "./form-fields/image-uploader"

import transformSchema from '../transforms/transform-schema.js'
import transformEntry from '../transforms/transform-entry.js'
import transformState from '../transforms/transform-state.js'
import { layer } from '@fortawesome/fontawesome-svg-core'

export default class WeedForm extends Component {
    constructor(props) {
        super(props);

        //Set default state. TODO: Offload the paths to another file mebbe
        this.state = !this.state ? this.blankEntry : this.state;

        // Set default State with schema and defaults from props. The transform converts data types to objects that hold a value.
        this.state = Object.assign({}, this.state, transformSchema(this.state.blankSchema));

        //Check for record saved locally so app can be refreshed and save state. TODO: List this to the app level once menu is added.
        if (this.props.id) {
            this.getEntry(this.props.id);
        }
    }
    blankEntry = {
        uploading: false, images: [], paths: {
            createImage: "http://localhost:5000/create/image",
            create: "http://localhost:5000/create/" + this.props.type,
            read: "http://localhost:5000/get/" + this.props.type,
            update: "http://localhost:5000/update/" + this.props.type,
            delete: "http://localhost:5000/delete/" + this.props.type
        },
        blankSchema: require("../../../../schemas/schemas.js")()[this.props.type]
    }
    removeImage = path => {

        // Remove an image given its path. This may not be a good permanent soluton, May need to assign everything a unique id for DOM.
        this.setState({
            images: this.state.images.filter(image => image.path !== path)
        })
    }

    updateEntry = e => {
        e.preventDefault();
        var self = this;
        // Transform current state into key/value object for update.
        let sendData = JSON.stringify(transformState(this.state));
        fetch(this.state.paths.update, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: sendData
        })
            .then(res => res.json())
            .then(res => {
                // Transform response back into state
                let newState = transformEntry(self.state, res);
                newState.id = self.state.id;
                newState.edit = true;
                self.setState(Object.assign({}, newState, this.state));
            });
    }

    deleteEntry = e => {

        // Delete an entry from DB. TODO: This doesn't work.
        let sendData = JSON.stringify({ "id": this.state.id });
        fetch(this.state.paths.delete, {
            method: 'Post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: sendData
        })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    // TODO: Add notifier
                    
                    this.setState({edit:false});
                    this.setState(Object.assign({}, this.state, transformSchema(this.state.blankSchema)));
                }
            });
    }

    getEntry = id => {
        var self = this;

        // Get entry based on id. Currently this can only be passedin via props. That might be right?
        let sendData = JSON.stringify({ "_id": id.toString() });
        fetch(this.state.paths.get, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: sendData
        })
            .then(res => res.json())
            .then(res => {
                let newState = transformEntry(self.state, res);
                newState.id = id;
                newState.edit = true;
                self.setState(Object.assign({}, newState, this.state));
            });
    }

    onImageUploaderChange = e => {

        // Grab files from field.
        const files = Array.from(e.target.files)

        // Set state to uploading. Hard to test in local because of speed.
        this.setState({ uploading: true })

        const formData = new FormData()

        // Add files to array inside of form object.
        files.forEach((file, i) => {
            formData.append("file", file)
        })

        // Upload images to default dir whie record is being edited. TODO: Make server side worker move images after record is added then upadte path. This might mean adding a download path to record.
        fetch(this.state.paths.createImage, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(images => {
                this.setState({
                    uploading: false,
                    images: this.state.images.concat(images)
                })
            })
    }
    // TODO: Add "add images" button and logic so that there is a way to do that.
    submit = e => {

        e.preventDefault();

        // Transform state into DB record format then insert.
        var sendData = transformState(this.state);
        var self = this;
        var req = fetch(this.state.paths.create, {
            "method": "post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            "body": JSON.stringify(sendData)
        });
        req.then(function (data) {
            return data.json();
        })
            .then(function (data) {
                // Set record id and shift to edit mode.
                self.setState({ id: data._id, edit: true });
            });
    }
    handleChange = e => {

        // Take form field change and add it to state.
        e.preventDefault();
        let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [e.target.name]: { value: newValue, type: this.state[e.target.name].type }
        });

    }
    changeDate(newValue, label) {

        // Process date field change
        this.setState({
            [label]: { value: newValue, type: this.state[label].type }
        });
    }


    render() {

        let formState = {}, self = this;

        // Map out form field instructions for Data types. TODO: Add validation.
        let typeMap = {
            Date: {
                el: (obj, key, id) => {
                    return pug`
                    DateInput(key=key,value=self.state[key].value,label=key,id=key,selected=self.state[key].value,onChange=(date) => self.changeDate(date,key))` },
                validator: {},
                containerClassName:"col-half"
            },
            Number: {
                el: (obj, key) => {
                    return pug`
                    TextInput(key=key,id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)` },
                validator: {},
                containerClassName:"col-half"
            },
            String: {
                el: (obj, key) => {
                    return pug`
                    TextInput(key=key,id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)`},
                validator: {},
                containerClassName:"col-half"
            },
            Images: {
                el: (obj, key) => {
                    return pug`
                    ImageUploader(key=key,uploading=self.state.uploading,onChange=self.onImageUploaderChange, images=self.state.images, removeImage=self.removeImage)`},
                validator: {},
                containerClassName:"col-full"
            }
        };
        Object.keys(this.state).map(key => {
            if (this.state[key]) {
                if (this.state[key].type != undefined) {
                    formState[key] = Object.assign({}, { formControl: typeMap[this.state[key].type] }, this.state[key])
                }
                else if (key == "images") {
                    formState[key] = Object.assign({}, { formControl: typeMap["Images"] }, this.state[key])
                }
            }

        });
        formState = Object.assign({}, this.state, formState);
        return pug`
    form(onSubmit=this.submit,method="post")
        .form-row(key="fr-1")
            - let counter = 0;
            for key in Object.keys(formState)
                if formState[key]
                    if formState[key].formControl
                        div(key='form-row-'+counter,className=formState[key].formControl.containerClassName)=formState[key].formControl.el(formState[key],key)
                        - counter++
        .form-row(key="fr-2")
            .col-full
                if this.state.edit == true
                    button(id='btn-update',onClick=this.updateEntry) Update Record
                    button(id='btn-delete',onClick=this.deleteEntry) Delete Record
                else
                    button(id='btn-submit',type="submit") Send Form
`
    }
}
module.exports = WeedForm;