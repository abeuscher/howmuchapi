import React, { Component } from 'react'


const apiUrl = "http://localhost:5000/create/image";

export default class ImageUploader extends Component {
  
  render() {


    return pug`
        .image-uploader
          .buttons=this.props.content
`
  }
}
module.exports = ImageUploader;