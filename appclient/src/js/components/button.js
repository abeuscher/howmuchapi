import React, { Component } from 'react'

export default class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            button(onClick=this.props.onClick,className=this.props.className,cb=this.props.cb)=this.props.label
        `
    }
}