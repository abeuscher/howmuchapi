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
        this.props.buttons  = [];
    }

    render() {
        return pug`
            nav
                for buttonObj in this.state
                    Button(this.props=buttonObj)
        `
    }

}