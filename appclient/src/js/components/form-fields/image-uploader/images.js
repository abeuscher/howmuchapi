import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default class Images extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return pug`
      .image-gallery
        each image,i in this.props.images
          .image-bucket(key="image-frame"+i)
            .delete(key="inner-"+i,onClick=() => { this.props.removeImage(image.path) })
              FontAwesomeIcon(key="del-image-"+i,icon=faTimesCircle, size='2x')
            .thumb(style={"backgroundImage":"url(http://localhost:5000/" + image.path + ")"})`
  }
} 