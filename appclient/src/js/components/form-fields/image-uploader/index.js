import React, { Component } from 'react'

import Spinner from './spinner'
import Images from './images'
import Buttons from './buttons'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return pug`
        .image-uploader(key=this.props.id)
          Images(images=this.props.images, removeImage=this.props.removeImage)
          Buttons(onChange=this.props.onChange)
`
  }
}
module.exports = ImageUploader;