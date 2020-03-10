import React, { Component } from 'react'

import Button from './button.js'
import ButtonRadio from './button-radio.js'

export default class WeedMenu extends Component {
/*
    button = {
        label:"Example",
        className:"",
        onClick:()=>{ return "clicked Example"; },
        cb:null
    }

*/
    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            nav(key='nav')
                for buttonObj,idx in this.props.buttons
                    if buttonObj.buttonType=="simple"
                        Button(key='mbutt'+idx,label=buttonObj.label,onClick=buttonObj.onClick,cb=buttonObj.cb,className=buttonObj.className)
                    else if buttonObj.buttonType=="type" && buttonObj.options!=undefined
                        ButtonRadio(key='mbutt'+idx,label=buttonObj.label,onClick=buttonObj.onClick,cb=buttonObj.cb,className=buttonObj.className,options=buttonObj.options,selectedOpt=this.props.selectedType)
                    
        `
    }

}