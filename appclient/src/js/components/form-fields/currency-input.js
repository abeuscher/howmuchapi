import React, { Component } from 'react'

import ReactCurrencyInput from 'react-currency-input'

export default class CurrencyInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .currency-input(value=this.props.value,key=this.props.id)
                label(
                    for=this.props.id,
                    key='label-'+this.props.id)=this.props.label
                ReactCurrencyInput(
                    id=this.props.id,
                    key="currency-input-"+this.props.id,
                    name=this.props.id,
                    value=this.value,
                    onChange=e=>this.props.handleChange,
                    data-parent=this.props.parent
                    )`
    }
}