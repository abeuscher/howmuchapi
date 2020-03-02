import React, { Component } from 'react'

export default class EntryManager extends Component {

    constructor(props) {
        super(props)
    }



    render() {
        return pug`
            .manager
                .entries(content=this.props.entries)
        `
    }

}