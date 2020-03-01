import React, { Component } from 'react'

export default class WeedMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            button(onClick=this.props.onClick,className=this.props.className=this.props.label,cb=this.props.cb)
        `
    }
}