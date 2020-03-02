import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons'

export default class Buttons extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return pug`
      .buttons.fadein
        .button
          label(htmlFor="multi") Add Images
            FontAwesomeIcon(key="add-image",icon=faImages, color='#6d84b4', size='5x')
          input#multi(type="file",onChange=this.props.onChange, multiple)`
  }
}