import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default props => 
  props.images.map((image, i) =>
    <div key={i} className='fadein'>
      <div 
        onClick={() => props.removeImage(image.path)} 
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='2x' />
      </div>
      <img src={'http://localhost:5000/'+image.path} alt='' />
    </div>
  )