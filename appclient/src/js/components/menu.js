import React, { Component } from 'react'

import Button from './button.js'

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
            nav
                for buttonObj,idx in this.props.buttons
                    Button(key='mbutt'+idx,label=buttonObj.label,onClick=buttonObj.onClick,cb=buttonObj.cb,classNAme=buttonObj.className)
        `
    }

}