import React, { Component } from 'react'

export default class ButtonRadio extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            p=this.props.label
            for opt,idx in this.props.options
                - var radioID = "radio-"+idx;
                label(for=radioID)=opt
                input(type="radio",id=radioID,name=this.props.label.replace(" ","-"),onChange=this.props.onClick,data-value=opt,checked=opt==this.props.selectedOpt)
        `
    }
}
module.exports = ButtonRadio;