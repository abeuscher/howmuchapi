import React, { Component } from 'react'

import Images from './images'
import Buttons from './buttons'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return pug`
      .image-uploader(data-parent=this.props.parent,key=this.props.id)
        Images(images=this.props.images, removeImage=this.props.removeImage,key=this.props.id+"-images")
        Buttons(onChange=this.props.onChange,key=this.props.id+"-buttons")`
  }
}
module.exports = ImageUploader;