import React from 'react'
import './button.css'

function Button(props) {
    return (
        <div>
            <button className='custum-button'
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.label}
            </button>
        </div>
    )
}

export default Button
