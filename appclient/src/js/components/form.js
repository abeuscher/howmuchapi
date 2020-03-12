import React, { Component } from 'react'

export default class EditForm extends Component {

    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            form.app-form(onSubmit=this.props.createEntry,method="post",className=this.props.mode)
                .inner
                    .header-row(key="fr-1")
                        if this.props.id
                            p.mode Editing Record
                            p.id="Currently editing record ID "+ this.props.id
                        else
                            p.mode Create New Record
                        p Type:
                            span=this.props.type                            
                    .form-row(key="fr-2")
                        - let counter = 0;
                        for idx in Object.keys(this.props.currentRecord)
                            if this.props.currentRecord[idx]
                                if this.props.currentRecord[idx].formControl
                                    div(key='form-row-'+counter,className=this.props.currentRecord[idx].formControl.containerClassName)=this.props.currentRecord[idx].formControl.el(this.props.currentRecord,idx,false)
                                    - counter++
                                else if typeof this.props.currentRecord[idx]=="object"
                                    .field-group(key="field-group-"+counter)
                                        h2(key="field-group-"+counter+"-header")=idx.replace(/_/gi," ")
                                        for subfield in Object.keys(this.props.currentRecord[idx])
                                            if this.props.currentRecord[idx][subfield].formControl
                                                div(depth="field-group",parent=idx,key='form-row-'+counter,className=this.props.currentRecord[idx][subfield].formControl.containerClassName)=this.props.currentRecord[idx][subfield].formControl.el(this.props.currentRecord[idx],subfield,idx)
                                                - counter++
                    .form-row(key="fr-3")
                        .col-full(key='button-bucket')
                            if this.props.mode == "edit"
                                button(id='btn-update',onClick=this.props.updateEntry,key='btn-update') Update Record
                                button(id='btn-delete',onClick=this.props.deleteEntry,key='btn-delete') Delete Record
                            else
                                button(key='btn-submit', id='btn-submit',type="submit") Send Form
                        .col-full.alert-box(key='error-box')
                            p(key='msg-wrapper')=this.props.msg`
    }
}