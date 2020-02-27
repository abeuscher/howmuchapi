import React, { Component } from 'react'
import Spinner from './spinner'
import Images from './images'
import Buttons from './buttons'

const apiUrl = "http://localhost:5000/create/image";

export default class ImageUploader extends Component {
  
  state = {
    uploading: false,
    images: []
  }

  onChange = e => {
    const files = Array.from(e.target.files)
    
    this.setState({ uploading: true })

    const formData = new FormData()

    files.forEach((file, i) => {
        console.log(file,i);
        formData.append("file", file)
    })
    
    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(images => {
        console.log(images);
      this.setState({ 
        uploading: false,
        images
      })
    })
  }

  removeImage = path => {
    this.setState({
      images: this.state.images.filter(image => image.path !== path)
    })
  }
  
  render() {
    const { uploading, images } = this.state

    const content = () => {
      switch(true) {
        case uploading:
          return <Spinner />
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />
        default:
          return <Buttons onChange={this.onChange} />
      }
    }

    return (
        <div>
          <div className='buttons'>
            {content()}
          </div>
        </div>
      )
  }
}
module.exports = ImageUploader;