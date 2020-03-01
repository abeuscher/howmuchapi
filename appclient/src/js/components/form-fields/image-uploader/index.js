import React, { Component } from 'react'

import Spinner from './spinner'
import Images from './images'
import Buttons from './buttons'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { uploading, images } = this.props
    const uploaderContent = () => {
        switch (true) {
            case images.length > 0:
                return <Images images={this.props.images} removeImage={this.props.removeImage} />
            default:
                return <Spinner />
        }
    }

    return pug`
        .image-uploader(key=this.props.id)
          .image-gallery=uploaderContent()
          Buttons(onChange=this.props.onChange)
`
  }
}
module.exports = ImageUploader;