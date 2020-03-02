import React, { Component } from 'react'

export default class EntryManager extends Component {

    constructor(props) {
        super(props)
    }



    render() {
        return pug`
            .manager
                h2 File Manager
                if this.props.entries
                    each entry in this.props.entries
                        a(onClick=this.props.editEntry,data-id=entry._id,href="#")=entry._id
        `
    }

}