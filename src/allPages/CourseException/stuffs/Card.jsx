import React from 'react'
import '../styles/card.css'

const Card = (props) => {
  return (
    <div className="card">
    <div className='card-image-container'>
        <img src={props.image} alt={props.title} className="card-image" />
    </div>
    <div className='card-content'>
        <div className="card-header">
            <p className='card-title'>{props.title}</p>
        </div>
    </div>
    </div>
  )
}

export default Card