
import React, { Component } from 'react'

import TextInput from "./text-input.js"
import DateInput from "./date-input.js"
import ImageUploader from "./image-uploader"

import Spinner from './image-uploader/spinner'
import Images from './image-uploader/images'
import Buttons from './image-uploader/buttons'

const blankEntry = require("../../../../data-types.js")().productEntry;
var apiPaths = {
    createImage:"http://localhost:5000/create/image",
    createEntry:"http://localhost:5000/create/entry"
};

delete blankEntry.created;
export default class WeedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {uploading:false};
        //Grab schema from data types and remove values. Not sure if this is the right approach but it;s the right direction.
        this.state = parseSchema(blankEntry);
        function parseSchema(obj) {
            let output = {};
            Object.keys(obj).map(function (key) {
                if (typeof obj[key] === 'object') {
                    output[key] = key == "images" ? [] : parseSchema(obj[key]);
                }
                else if (typeof obj[key] === 'function') {
                    output[key] = {
                        value: "",
                        type: obj[key].name
                    }
                }
            });
            return output;
        }

    }
    removeImage = path => {
        this.setState({
            images: this.state.images.filter(image => image.path !== path)
        })
    }
    onUploaderChange = e => {
        const files = Array.from(e.target.files)

        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            formData.append("file", file)
        })

        fetch(apiPaths.createImage, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(images => {
                this.setState({
                    uploading: false,
                    images : images
                })
            })
    }
    submit = e => {
        e.preventDefault();
        var sendData = {};
        function normalizeForm(obj) {

        }
        Object.keys(this.state).map((key,idx) => { sendData[key] = this.state[key].type!=undefined ? this.state[key].value : this.state[key]  })
        console.log(sendData);
        var req = fetch(apiPaths.createEntry, {
            "method": "post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            "body": JSON.stringify(sendData)
        });
        req.then(function (data) {
            return data.text();
        })
            .then(function (data) {
                console.log(data);
            });
    }
    handleChange = e => {

        e.preventDefault();
        let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [e.target.name] : { value: newValue,type:this.state[e.target.name].type}
        });

    }
    changeDate(newValue, label) {
        this.setState({
            [label]: { value: newValue, type: this.state[label].type }
        });
    }
    render() {
        const { uploading, images } = this.state
        const uploaderContent = () => {
          switch(true) {
            case uploading:
              return <Spinner />
            case images.length > 0:
              return <Images images={this.state.images} removeImage={this.removeImage} />
            default:
              return <Buttons onChange={this.onUploaderChange} />
          }
        }
        return pug`
    form(onSubmit=this.submit,method="post")
        .form-row
            ImageUploader(onChange=this.props.onUploaderChange, images = this.state.images, removeImage = this.props.removeImage,content=uploaderContent())
        .form-row
            .col-half
                TextInput(id="weight",placeholder="weight (grams)",label="Weight",handleChange=this.handleChange,value=this.state.weight.value)
            .col-half
                TextInput(id="price",placeholder="$0.00",label="Price",handleChange=this.handleChange,value=this.state.price.value)
        .form-row
            .col-half
                DateInput(value=this.state.purchase_date.value,label="Purchase Date",id="purchase_date",selected=this.state.purchase_date.value,onChange=(date) => this.changeDate(date,"purchase_date"))
            .col-half
                DateInput(value=this.state.package_date.value,label="Package Date",id="package_date",selected=this.state.package_date.value,onChange=(date) => this.changeDate(date,"package_date"))
        .form-row
            .col-full
                TextInput(id="thc",placeholder="thc%",label="THC %",handleChange=this.handleChange,value=this.state.thc.value)
        .form-row
            .col-full
                button(type="submit") Send Form
`
    }
}
module.exports = WeedForm;