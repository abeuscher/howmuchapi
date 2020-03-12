import React, { Component } from 'react'

export default class CurrencyInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : this.props.value || 0.00,
            precision:2,
            decimalSeparator:'.',
            thousandSeparator:',',
            prefix:'',
            suffix:''
        }
    }
    componentDidMount() {
        this.state.value = this.mask(this.props.value).maskedValue || 0.00
        this.setState(this.state)
    }
    handleInput = e => {
        let val = this.mask(e.target.value);
        this.state.value=val.maskedValue;
        e.target.value=val.value
        this.setState(this.state)
        this.props.handleChange(e)
        
    }
    nullRecord = {
        value: 0,
        maskedValue: ''
    }
    mask = (value) => {

        if (value === null || value===undefined) {
              return this.nullRecord
         }
      
        value = String(value);
    
        if (value.length == 0) {
            return this.nullRecord
        }
    
        // extract digits. if no digits, fill in a zero.
        let digits = value.match(/\d/g) || ['0'];
        
        let numberIsNegative = false;

        // zero-pad a input
        while (digits.length <= this.state.precision) { digits.unshift('0'); }
    
        if (this.state.precision > 0) {
            // add the decimal separator
            digits.splice(digits.length - this.state.precision, 0, ".");
        }
    
        // clean up extraneous digits like leading zeros.
        digits = Number(digits.join('')).toFixed(this.state.precision).split('');
        var raw = Number(digits.join(''));
    
        var decimalpos = digits.length - this.state.precision - 1;  // -1 needed to position the decimal separator before the digits.
        if (this.state.precision > 0) {
            // set the final decimal separator
            digits[decimalpos] = this.state.decimalSeparator;
        } else {
            // when precision is 0, there is no decimal separator.
            decimalpos = digits.length;
        }
    
        // add in any thousand separators
        for (var x=decimalpos - 3; x > 0; x = x - 3) {
            digits.splice(x, 0, this.state.thousandSeparator);
        }
    
        // if we have a prefix or suffix, add them in.
        if (this.state.prefix.length > 0) { digits.unshift(this.state.prefix); }
        if (this.state.suffix.length > 0) { digits.push(this.state.suffix); }
    
        return {
            value: raw,
            maskedValue: digits.join('').trim()
        };
    }
    render() {
        return pug`
            .currency-input
                label(
                    for=this.props.id)=this.props.label
                input(
                    id=this.props.id,
                    name=this.props.id,
                    value=this.state.value,
                    type="text",
                    onChange=this.handleInput,
                    data-parent=this.props.parent
                    )`
    }
}