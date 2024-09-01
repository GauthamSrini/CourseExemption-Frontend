import React, { useState } from 'react'
import OnlineTable from '../stuffs/OnlineTable'
import '../styles/onlineHome.css'
import { useNavigate } from 'react-router-dom'
import CourseTable from '../CourseTable'

const OnlineHome = () => {
  const navigate = useNavigate()

  return (
    <div className='onlinehome'>
        <div className='titleBtn' >
        <div className="titlehm">
            <h4>Online Course</h4>
        </div>
        <div className='createDiv' >
            <button className='CreateBtn' onClick={()=>{navigate('/onlineCourseForm')}} >Create</button>
        </div>
        </div>
        <div className='hometable' >
            {/* <OnlineTable /> */}
            <CourseTable/>
        </div>
    </div>
  )
}

export default OnlineHome