import React, { Component } from 'react'

export default class WeedForm extends Component {

    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            form(onSubmit=this.props.createEntry,method="post")
                .form-row(key="fr-1")
                    .col-full
                        h3 Type:
                            span=this.props.type
                            if this.props.id
                                span="ID:"+ this.props.id
                .form-row(key="fr-2")
                    - let counter = 0;
                    for key in Object.keys(this.props.currentRecord)
                        if this.props.currentRecord[key]
                            if this.props.currentRecord[key].formControl
                                div(key='form-row-'+counter,className=this.props.currentRecord[key].formControl.containerClassName)=this.props.currentRecord[key].formControl.el(this.props.currentRecord[key],key)
                                - counter++
                .form-row(key="fr-3")
                    .col-full
                        if this.props.mode == "edit"
                            button(id='btn-update',onClick=this.props.updateEntry) Update Record
                            button(id='btn-delete',onClick=this.props.deleteEntry) Delete Record
                        else
                            button(id='btn-submit',type="submit") Send Form
                    .col-full.alert-box
                        p=this.props.msg`
    }
}