
import React, { Component } from 'react'

import TextInput from "./form-fields/text-input.js"
import DateInput from "./form-fields/date-input.js"
import ImageUploader from "./form-fields/image-uploader"

import transformSchema from '../transforms/transform-schema.js'
import transformEntry from '../transforms/transform-entry.js'
import transformState from '../transforms/transform-state.js'

export default class WeedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false, images: [], paths: {
                createImage: "http://localhost:5000/create/image",
                create: "http://localhost:5000/create/" + this.props.type,
                read: "http://localhost:5000/get/" + this.props.type,
                update: "http://localhost:5000/update/" + this.props.type,
                delete: "http://localhost:5000/delete/" + this.props.type
            },
            blankEntry: require("../../../../data-types.js")()[this.props.type]
        };
        delete this.state.blankEntry.created;
        this.state = Object.assign({}, this.state, transformSchema(this.state.blankEntry));
        if (this.props.id) {
            this.getEntry(this.props.id);
        }
    }
    getLocalState = () => {
        if (window.localStorage.getItem("weedstate")) {
            this.state = Object.assign({}, this.state, JSON.parse(window.localStorage.getItem("weedstate")));
        }
    }

    removeImage = path => {
        this.setState({
            images: this.state.images.filter(image => image.path !== path)
        })
    }

    updateEntry = e => {
        e.preventDefault();
        var self = this;
        let sendData = transformState(this.state);
        fetch(this.state.paths.update, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(sendData)
        })
            .then(res => res.json())
            .then(res => {
                let newState = transformEntry(self.state, res);
                newState.id = self.state.id;
                newState.edit = true;
                self.setState(newState);
            });
    }

    deleteEntry = e => {
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
                console.log(res);
            });
    }

    getEntry = id => {
        var self = this;
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
        const files = Array.from(e.target.files)

        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            console.log(file);
            formData.append("file", file)
        })

        fetch(this.state.paths.createImage, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(images => {
                console.log(images);
                this.setState({
                    uploading: false,
                    images: images
                })
            })
    }

    submit = e => {
        e.preventDefault();
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
                self.setState({ id: data._id, edit: true });
            });
    }
    handleChange = e => {

        e.preventDefault();
        let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [e.target.name]: { value: newValue, type: this.state[e.target.name].type }
        });

    }
    changeDate(newValue, label) {
        this.setState({
            [label]: { value: newValue, type: this.state[label].type }
        });
    }


    render() {
        window.localStorage.setItem("weedstate", JSON.stringify(this.state));

        let formState = {}, self = this;
        let typeMap = {
            Date: {
                el: (obj, key) => {
                    return pug`
                    .col-half
                        DateInput(value=self.state[key].value,label=key,id=key,selected=self.state[key].value,onChange=(date) => self.changeDate(date,key))` },
                validator: {}
            },
            Number: {
                el: (obj, key) => {
                    return pug`
                    .col-half
                        TextInput(id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)` },
                validator: {}
            },
            String: {
                el: (obj, key) => {
                    return pug`
                    .col-half
                        TextInput(id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)`},
                validator: {}
            },
            Images: {
                el: (obj, key) => {
                    return pug`
                    .col-full
                        ImageUploader(uploading=self.state.uploading,onChange=self.onImageUploaderChange, images=self.state.images, removeImage=self.removeImage)`},
                validator: {}
            }
        }
        Object.keys(this.state).map(key => {
            if (this.state[key].type != undefined) {
                formState[key] = Object.assign({}, { formControl: typeMap[this.state[key].type] }, this.state[key])
            }
            else if (key == "images") {
                formState[key] = Object.assign({}, { formControl: typeMap["Images"] }, this.state[key])
            }
        });
        formState = Object.assign({}, this.state, formState);
        return pug`
    form(onSubmit=this.submit,method="post")
        .form-row
            for key in Object.keys(formState)
                if formState[key]
                    if formState[key].formControl
                        =formState[key].formControl.el(formState[key],key)
        .form-row
            .col-full
                if this.state.edit
                    button(onClick=this.updateEntry) Update Record
                    button(onClick=this.deleteEntry) Delete Record
                else
                    button(type="submit") Send Form
`
    }
}
module.exports = WeedForm;