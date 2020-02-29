import React, { Component } from 'react'

import TextInput from "./text-input.js"
import DateInput from "./date-input.js"
import ImageUploader from "./image-uploader"

module.exports = {
    Date: {
        el: (obj,key, ) => { return pug`
            .col-half
                DateInput(value=self.state[key].value,label=key,id=key,selected=self.state[key].value,onChange=(date) => self.changeDate(date,key))` },
        validator: {}
    },
    Number:{
        el: (obj,key) => { return pug`
            .col-half
                TextInput(id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)` },
        validator: {}
    },
    String:{
        el: (obj,key) => { return pug`
            .col-half
                TextInput(id=key,placeholder=key,label=key,handleChange=self.handleChange,value=self.state[key].value)`},
        validator: {}
    },
    Images:{
        el:(obj,key) => { return pug`
            .col-full
                ImageUploader(uploading=self.state.uploading,onChange=self.onImageUploaderChange, images=self.state.images, removeImage=self.removeImage)`},
        validator: {}
    }
}