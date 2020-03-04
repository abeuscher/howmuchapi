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
          input#multi(type="file",onChange=this.props.onChange, multiple)`
  }
}