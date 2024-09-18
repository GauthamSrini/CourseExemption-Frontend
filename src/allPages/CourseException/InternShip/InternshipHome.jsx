import React, { useState } from 'react'
import '../styles/onlineHome.css'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from "../../../api/api";
import InternshipTable from '../stuffs/InternshipTable';
import axios from 'axios';

const InternshipHome = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(1);

  // Function to navigate to the InternshipForm and pass the id
  const handleCreateClick = () => {
    navigate('/InternshipForm', { state: { id } }); // Pass id as state
  };

  return (
    <div className='tableDefault'>
        <div className='titleBtn' >
        <div className="titlehm">
            <h4>Internship Home</h4>
        </div>
        <div className='createDiv' >
            <button className='CreateBtn' onClick={handleCreateClick} >Create Tracker</button>
        </div>
        </div>
        <div className='hometable' >
            <InternshipTable />
        </div>
    </div>
  )
}

export default InternshipHome