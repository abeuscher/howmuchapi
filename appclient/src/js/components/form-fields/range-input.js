import React, { Component } from 'react'

export default class RangeInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
        - let step = this.props.step
        label(for=this.props.id,key='label-'+this.props.id)=this.props.label    
            .span.val=this.props.value || this.props.min
        input(
            type='range',
            key=this.props.id,
            id=this.props.id,
            min=this.props.min,
            max=this.props.max,
            step=step,
            name=this.props.id,
            placeholder=this.props.placeholder,
            value=this.props.value || this.props.min,
            onChange=this.props.handleChange,
            data-parent=this.props.parent
            )`
    }
}