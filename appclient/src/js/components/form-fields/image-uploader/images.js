import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default class Images extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const props = this.props;
    return this.props.images.map((image, i) => { return pug`
    .fadeIn(key=i)
      .delete(key="inner-"+i,onClick=() => { props.removeImage(image.path) })
        FontAwesomeIcon(key="del-image-"+i,icon=faTimesCircle, size='2x')
      img(src='http://localhost:5000/'+image.path, alt='')
  ` })
  }
  
}