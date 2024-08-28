import React, { useState } from 'react'
import '../styles/onlineHome.css'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from "../../../api/api";
import InternshipTable from '../stuffs/InternshipTable';
import axios from 'axios';

const InternshipHome = () => {
  const navigate = useNavigate()
  const [firstData,setFirstData] = useState(true)

  return (
    <div className='tableDefault'>
        <div className='titleBtn' >
        <div className="titlehm">
            <h4>Internship Home</h4>
        </div>
        {!firstData &&
        <div className='createDiv' >
            <button className='CreateBtn' onClick={()=>{navigate('/InternshipForm')}} >Create</button>
        </div>}
        </div>
        <div className='hometable' >
            <InternshipTable setFirstData={setFirstData}/>
        </div>
        {firstData && 
        <div className='upldBTN' >
            <div>
                <h4>Upload Internship Here</h4>
            </div>
            <div>
                <div className='card-add-icon' onClick={()=>{navigate('/InternshipForm')}} style={{cursor:'pointer'}}>
                        <AddBoxIcon className='add-icon' sx={{ fontSize: 32 }}/>
                </div>
            </div>
        </div> }
        
    </div>
  )
}

export default InternshipHome