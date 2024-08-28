import React from 'react';
import './Card.css';
import AddBoxIcon from '@mui/icons-material/AddBox';

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
                <div className='discription-and-add-icon'>
                    <div className="card-body">
                        <p>{props.description}</p>
                    </div>
                    <div className='card-add-icon'>
                        <AddBoxIcon className='add-icon' sx={{ fontSize: 32 }}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
