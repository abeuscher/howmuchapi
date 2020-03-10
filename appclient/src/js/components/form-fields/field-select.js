import React, { Component } from 'react'

import TextInput from './text-input'

export default class FieldSelect extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.populate(this.props.id)
    }

    render() {
    return pug`
        label(for=this.props.id,key='label-'+this.props.id)=this.props.label
        if !this.props.newRecord
            select(
                id=this.props.id,
                key=this.props.id,
                name=this.props.id,
                value=this.props.value,
                data-parent=this.props.parent,
                onChange=this.props.handleChange)
                if this.props.entries[this.props.id]
                    option(key=this.props.id+"-option-99",value="") choose
                    for entry,idx in this.props.entries[this.props.id]
                        option(key=this.props.id+"-option-"+idx,value=entry._id)=entry["title"] 
                else
                    option(key=this.props.id+"-option-0",value=0)="loading..."
            button.addNew(id=this.props.id+"-add-one-button",onClick=(e)=>{this.props.addNewSubfield(e,this.props.id,this.props.parent)}) Add New           
        else
            TextInput(
                id=this.props.id,
                handleChange=this.props.handleChange,
                value=this.props.value,
                name=this.props.id,
                parent=this.props.parent)
            button.addNew(id=this.props.id+"-dont-add-one-button",onClick=(e)=>{this.props.addNewSubfield(e,this.props.id,this.props.parent)}) Pick from list
        
`
    }
}