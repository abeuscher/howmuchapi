import React, { Component } from 'react'

export default class ButtonRadio extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .radio-chooser
                p=this.props.label
                for opt,idx in this.props.options
                    .radio-option(key='radio-'+idx)
                        - var radioID = "radio-"+idx;
                        input(type="radio",id=radioID,name=this.props.label.replace(" ","-"),onChange=this.props.onClick,data-value=opt,checked=opt==this.props.selectedOpt)
                        label(for=radioID)=opt
`
    }
}
module.exports = ButtonRadio;