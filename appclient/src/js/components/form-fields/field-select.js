import React, { Component } from 'react'

export default class StateDropDown extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.populate(this.props.id)
    }

    render() {
    return pug`
        label(for=this.props.id,key='label-'+this.props.id)=this.props.label
        select(
            id=this.props.id,
            key=this.props.id,
            name=this.props.id,
            value=this.props.value,
            data-parent=this.props.parent,
            onChange=this.props.handleChange)
            if this.props.entries[this.props.id]
                option(value="") choose
                for entry in this.props.entries[this.props.id]
                    option(value=entry._id)=entry[Object.keys(entry)[2]] 
            else
                - console.log(this.props.entries)
                option(key=this.props.id+"-option-0",value=0)="loading..."
`
    }
}