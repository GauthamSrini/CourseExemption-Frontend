import React, { useState , useEffect } from 'react'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdf from '../../assets/courseExceptionPdf/Online.pdf'
import axios from 'axios';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Select from 'react-select'
import "../styles/nptel.css"
import TextField from '@mui/material/TextField';


const Nptel = () => {
    // Use States to Store all the values of input boxes to validate
    const [selectedWeek, setSelectedWeek] = useState('');
    const [course,setCourse] = useState('')
    const [selectedSem,setSelectedSem] = useState('')
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [examDate,setExamDate] = useState(null);
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [opinion,setOpinion] = useState(null);
    const [selectedCredits,setSelectedCredits] = useState(null)
    const [openings,setOpenings] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [users, setUsers] = useState([])
    // Function to fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        // If request is successful, set the users state with the fetched data
        setUsers(response.data);
      } catch (error) { 
        // If an error occurs, log the error
        console.error('Error fetching users:', error);
      }
    };
    //Loading the PDF from the utils folder
    useEffect(() => {
      const loadPdf = async () => {
        const response = await fetch(pdf);
        const pdfBlob = await response.blob();
        setSelectedFile(pdfBlob);
      };
      loadPdf();
      fetchUsers();
    }, []);

    //function to trigger the pdf download
    const modifyPdf = async () => {
      if (!selectedFile) {
        alert('Failed to load PDF');
        return;
      }
      const existingPdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const timesNewRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
  
      firstPage.drawText("B.TECH IT", { x: 190, y: 440, size: 12, font: timesNewRomanFont });
      firstPage.drawText(course, { x: 190, y: 414, size: 12, font: timesNewRomanFont });
      firstPage.drawText("14/02/2024", { x: 720, y: 455, size: 12, font: timesNewRomanFont });
      firstPage.drawText("7376222IT137", { x: 35, y: 280, size: 12, font: timesNewRomanFont });
      firstPage.drawText("Gautham S", { x: 125, y: 280, size: 12, font: timesNewRomanFont });
      firstPage.drawText("Frontend Developer", { x: 300, y: 280, size: 12, font: timesNewRomanFont });
  
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified_pdf.pdf';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Function to handle week selection
    const handleWeek = (selectedOption) => {
      setSelectedWeek(selectedOption.value);
    };
    // Function to handle Course Selection 
    const handleCourse = (course) => {
      if (course) {
        const selectedCourse = course.value;
        if (selectedCourse === "Others") {
          // Show input field for custom course
          const customCourse = window.prompt("Enter custom course:");
          if (customCourse) {
            setCourse(customCourse);
          }
        } else {
          setCourse(selectedCourse);
        }
      } else {
        // Handle case where selectedOption is null (e.g., clearing selection)
        setCourse('');
      }
    };
    

  // function to handle semester Selection
  const handleSem = (selectedOption) => {
    setSelectedSem(selectedOption.value);
  };

  // Function to handle Start Date
  const handleStartDateChange = (date) => {
    if (endDate && date && date > endDate) {
        // If start date is after end date, show error message
        alert("Start date cannot be after the end date. Please select a valid start date.");
        setStartDate(null); // Reset start date
      }
    else{
    setStartDate(date);
    if (endDate && date) {
      const diffTime = Math.abs(endDate - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfDays(diffDays);
    }
    if (date && typeof date === 'object' && date.$isDayjsObject) {
        const nativeDate = date.toDate();
        console.log("Selected Start Date:", formatDate(nativeDate));
    }
    }
  };

  // Function to handle End Date
  const handleEndDateChange = (date) => {
    if (startDate && date && date < startDate) {
      // If end date is before start date, show error message
      alert("End date cannot be before the start date. Please select a valid end date.");
      setEndDate(null); // Reset end date
    } else {
      // If end date is valid, update the state and calculate the number of days
      setEndDate(date);
      if (startDate && date) {
        const diffTime = Math.abs(date - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNumberOfDays(diffDays);
      }
      if (date && typeof date === 'object' && date.$isDayjsObject) {
        // Extract the native Date object from the Day.js object
        const nativeDate = date.toDate();
        console.log("Selected End Date:", formatDate(nativeDate));
      }      
    }
  };

  const handleExamDate = (date) => {
    setExamDate(date)
    if (date && typeof date === 'object' && date.$isDayjsObject) {
      // Extract the native Date object from the Day.js object
      const nativeDate = date.toDate();
      console.log("Selected Exam Date:", formatDate(nativeDate));
    }  
  }

  // Function to format the date as dd/mm/yyyy
  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  // Function to handle selected opinion for Course Exception
  const handleOpinion = (selectedOption) => {
    setOpinion(selectedOption.value);

    if (selectedOption.value === "1") {
      setOpenings(true);
    } else {
      setOpenings(false);
    }
  };

  // Function to handle Credits
  const handleCredits = (selectedOption) => {
    setSelectedCredits(selectedOption.value);
  };

  // Function for exception validation
  const handleValidation = () => {
    console.log("function called");
    if(course === "NPTEL" && selectedCredits >= 3 && selectedSem >= 4 && selectedWeek === "12" ){
      return true;
    }
    else{
      return false;
    }
  }

  // Function for setting loaded PDF
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const selectOptions = users.map(user => ({
    value: user.user_name,
    label: user.user_name,
  }));

  const rollnumber = users.map(user=>({
    value : user.user_id,
    label : user.user_id,
  }))
  
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <div className="nptelTitle">
            <h4>Online Course</h4>
          </div>
          <div className="nptelTextFields">
            <div>
              <div className="quesField">
                <div className="inp">Student</div>
                <div>
                  <Select
                    className="textField"
                    options={selectOptions}
                    isSearchable
                    isClearable
                    placeholder=""
                  ></Select>
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Register Number</div>
                <div>
                  <Select
                    className="textField"
                    options={rollnumber}
                    isClearable
                    isSearchable
                    placeholder=""
                  ></Select>
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Year Of Study</div>
                <div>
                  <TextField
                    size="small"
                    className="textField"
                    id="outlined-basic"
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Special Lab</div>
                <div>
                  <TextField
                    size="small"
                    className="textField"
                    id="outlined-basic"
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Course Type</div>
                <div>
                  <Select
                    value={{ value: course, label: course }}
                    onChange={handleCourse}
                    placeholder=""
                    isSearchable
                    className="textField"
                    options={[
                      { value: "NPTEL", label: "NPTEL" },
                      { value: "COURSERA", label: "Coursera" },
                      { value: "UDEMY", label: "Udemy" },
                      { value: "Others", label: "Others" },
                    ]}
                  />
                  {/* {course && <div> Course : {course} </div>} */}
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Name Of the Course</div>
                <div>
                  <TextField
                    size="small"
                    className="textField"
                    id="outlined-basic"
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Duration in Weeks</div>
                <div>
                  <Select
                    value={{
                      value: selectedWeek,
                      label: selectedWeek ? `${selectedWeek} Weeks` : "",
                    }}
                    onChange={handleWeek}
                    className="textField"
                    options={[
                      { value: "4", label: "4 Weeks" },
                      { value: "8", label: "8 Weeks" },
                      { value: "12", label: "12 Weeks" },
                    ]}
                    isSearchable={false}
                    placeholder="Select weeks..."
                  />
                  {/* {selectedWeek && <div> Weeks : {selectedWeek} </div>} */}
                </div>
              </div>
              <div className="quesField">
                <div className="inp">No.of.Credits</div>
                <div>
                  <Select
                    value={{
                      value: selectedCredits,
                      label: selectedCredits ? `${selectedCredits}` : "",
                    }}
                    onChange={handleCredits}
                    className="textField"
                    options={[
                      { value: "", label: "" },
                      { value: 1, label: "1" },
                      { value: 2, label: "2" },
                      { value: 3, label: "3" },
                      { value: 4, label: "4" },
                    ]}
                    isSearchable={false}
                    placeholder=""
                  />
                  {/* {selectedCredits && <div> Credits : {selectedCredits} </div>} */}
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Semester</div>
                <div>
                  <Select
                    value={{
                      value: selectedSem,
                      label: selectedSem ? `Semester ${selectedSem}` : "",
                    }}
                    onChange={handleSem}
                    className="textField"
                    options={[
                      { value: "", label: "" },
                      { value: 1, label: "I" },
                      { value: 2, label: "II" },
                      { value: 3, label: "III" },
                      { value: 4, label: "IV" },
                      { value: 5, label: "V" },
                      { value: 6, label: "VI" },
                      { value: 7, label: "VII" },
                      { value: 8, label: "VIII" },
                    ]}
                    isSearchable={false}
                    placeholder=""
                  />
                  {/* {selectedSem && <div> Semester : {selectedSem} </div>} */}
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Start Date</div>
                <div>
                  <DatePicker
                    className="textField"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">End Date</div>
                <div>
                  <DatePicker
                    className="textField"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                  {/* {startDate && endDate && (
                    <p>Number of days between selected dates: {numberOfDays}</p>
                  )} */}
                </div>
              </div>
              {handleValidation() ? (
                <div className="quesField">
                  <div className="inp">Do You Want Course Exception</div>
                  <div>
                    <Select
                      value={{
                        value: opinion,
                        label:
                          opinion === "1" ? "Yes" : opinion === "0" ? "No" : "",
                      }}
                      onChange={handleOpinion}
                      className="textField"
                      options={[
                        { value: "", label: "" },
                        { value: "1", label: "Yes" },
                        { value: "0", label: "No" },
                      ]}
                      placeholder=""
                    />
                  </div>
                </div>
              ) : null}
              {openings && handleValidation() ? (
                <div className="exp">
                  <div className="exception">Apply For Course Exception</div>
                  <div className="quesField">
                    <div className="inp">Exam Date</div>
                    <div>
                      <DatePicker
                        className="textField"
                        value={examDate}
                        onChange={handleExamDate}
                      />
                    </div>
                  </div>
                  <div className="quesField">
                    <div className="inp">Marks in Certificate</div>
                    <div>
                      <TextField
                        size="small"
                        className="textField"
                        id="outlined-basic"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className="quesField">
                    <div className="inp">Certificate URL</div>
                    <div>
                      <TextField
                        size="small"
                        className="textField"
                        id="outlined-basic"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className="quesDoc">
                    <div>Upload Certificate </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="pdf-upload" className="pdf-upload-button">
                        Upload PDF
                        <input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </label>
                      <div style={{ margin: "5px" }}>
                        {" "}
                        {selectedFile && (
                          <p>Selected file: {selectedFile.name}</p>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="quesField">
                    <div className="inp">IQAC Verification</div>
                    <div>
                      <TextField
                        disabled
                        size="small"
                        className="textField"
                        id="outlined-disabled"
                        label="Initiated"
                        defaultValue="Initiated"
                      />
                    </div>
                  </div>
                  <div className="EXPsubmits">
                    <button className="expCancelBtn">Cancel</button>
                    <button className="expCreateBtn" onClick={modifyPdf}>
                      Create
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rp">
                  <div className="Rewards">Apply For Reward Points</div>
                  <div className="quesField">
                    <div className="inp">Certificate URL</div>
                    <div>
                      <TextField
                        size="small"
                        className="textField"
                        id="outlined-basic"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className={handleValidation() ? "quesDoc" : "quesDocRp"}>
                    <div>Upload Certificate </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="pdf-upload" className="pdf-upload-button">
                        Upload PDF
                        <input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </label>
                      <div style={{ margin: "5px" , marginRight:"50px" }}>
                        {" "}
                        {selectedFile && (
                          <p>Selected file: {selectedFile.name}</p>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="quesField">
                    <div className="inp">IQAC Verification</div>
                    <div>
                      <TextField
                        disabled
                        size="small"
                        className="textField"
                        id="outlined-disabled"
                        defaultValue="Initiated"
                      />
                    </div>
                  </div>
                  <div className="RPsubmits">
                    <button className="expCancelBtn">Cancel</button>
                    <button className="expCreateBtn">Create</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Nptel