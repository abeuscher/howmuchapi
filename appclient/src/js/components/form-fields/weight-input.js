import React, { Component } from 'react'

const weights = [{
    metric:0.5,
    imperial:".02 oz",
},{
    metric:1,
    imperial:".04 oz",
},{
    metric:3.5,
    imperial:"1/8 oz",
},{
    metric:7,
    imperial:"1/4 oz",
},{
    metric:14,
    imperial:"1/2 oz",
},{
    metric:28.5,
    imperial:"1 oz",
},{
    metric:28.5,
    imperial:"1 oz",
}]

export default class WeightInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
        - let step = this.props.step
        label(for=this.props.id,key='label-'+this.props.id)=this.props.label
        select(
            key=this.props.id,
            id=this.props.id,
            name=this.props.id,
            placeholder=this.props.placeholder,
            value=this.props.value,
            onChange=this.props.handleChange,
            data-parent=this.props.parent
            )
            option(key=this.props.id+"-default-option",value="") choose weight
            for weight,idx in weights
                option(key=this.props.id+"-option-"+idx,value=weight.metric)=weight.metric + "g (" + weight.imperial + ")"
            `
    }
}