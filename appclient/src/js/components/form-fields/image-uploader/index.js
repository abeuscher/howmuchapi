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
            case uploading:
                return <Spinner />
            case images.length > 0:
                return <Images images={this.props.images} removeImage={this.props.removeImage} />
            default:
                return <Buttons onChange={this.props.onChange} />
        }
    }

    return pug`
        .image-uploader
          .buttons=uploaderContent()
`
  }
}
module.exports = ImageUploader;