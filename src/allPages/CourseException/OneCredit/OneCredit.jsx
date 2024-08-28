import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { apiBaseUrl } from "../../../api/api";


const OneCredit = () => {
  const [courseName,setCourseName] = useState([]);
  const [error,setError] = useState(null);
  const [student,setStudent] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/ce/oc/completedCourses?student_id=${student}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setCourseName(jsonData); // Update state with fetched data
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []); 

  const namelist = courseName.map(name => ({
    value:name.course_code,
    label:name.course_name
  }))

  const handleSelectChange = (selectedOptions) => {
    setSelectedCourses(selectedOptions); // Update selected courses state
  };
  
  const isOptionDisabled = (option) => {
    return selectedCourses.length >= 3 && !selectedCourses.find(course => course.value === option.value);
  };

  return (
    <div>
       <div className='titdefault' ><h4>Apply for Exception</h4></div>
       <div className='Default' >
            <div className='dfinside'>
              <div className="quesField">
                <div className="inp">Select Courses</div>
                <div>
                  <Select
                    className='textField'
                    isMulti
                    options={namelist}
                    isSearchable    
                    placeholder=""
                    onChange={handleSelectChange}
                    isOptionDisabled={isOptionDisabled} // Disable options when max selections reached
                  ></Select>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"row-reverse",gap:"20px"}}>
                <div></div>
              <button className="expCancelBtn">Cancel</button>
              <button className="expCreateBtn">Create</button>
              
              </div>
      </div>
      </div>
    </div>
  )
}

export default OneCredit