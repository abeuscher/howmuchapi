import React, { Component } from 'react'

export default class EntryManager extends Component {

    constructor(props) {
        super(props)
    }



    render() {
        return pug`
            .manager
                .inner
                    h2 File Manager
                    if this.props.entries
                        each entry,idx in this.props.entries
                            .entry(key='entry'+idx)
                                a(onClick=(e) => { this.props.chooseEntry(idx) },href="#")
                                    if entry.images.length>0
                                        .thumb(style={"backgroundImage":"url('http://localhost:5000/"+entry.images[0].path+"')"})    
                                    h3=entry[Object.keys(entry)[2]]                                
`
    }

}