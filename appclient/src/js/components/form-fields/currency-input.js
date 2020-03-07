import React, { Component } from 'react'

export default class CurrencyInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .currency-input(value=this.props.value,key=this.props.id)
                input(
                    key="integer-"+this.props.id,
                    type="text",
                    value=parseInt(this.props.value),
                    name="integer-field",
                    onChange=this.props.handleChange)
                input(
                    type="text",
                    value=this.props.value-parseInt(this.props.value),
                    name="decimal-field",
                    onChange=this.props.handleChange
                    )`
    }
}