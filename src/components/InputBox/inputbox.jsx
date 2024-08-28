import React from 'react'
import './inputbox.css'
function InputBox(props) {
    return (
        <div>
            <input
                // className='inputbox'
                className={props.className}
                type={props.type}
                value={props.value}
                name={props.name}
                onChange={props.onchange}
                placeholder={props.placeholder}
                onKeyDown={props.onKeyDown}
                min={props.min}
                max={props.max}
                disabled={props.disabled}
            />
        </div>
    )
}

export default InputBox
