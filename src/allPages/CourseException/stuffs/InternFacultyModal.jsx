import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Modal from '@mui/material/Modal';
import { apiBaseUrl } from "../../../api/api";
import  apiLoginHost  from "../../login/LoginApi"
import '../styles/Facultymodal.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Margin } from '@mui/icons-material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%', // Adjusted width for larger screens
    maxWidth: '430px', // Maximum width for smaller screens
    maxHeight: '80%',
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
    p: 4,
    borderRadius:'10px',
    overflowY: 'auto',
  };

  const style1 = {
    position: 'absolute',
    top: '5%',
    left: '50%',
    bottom:'90%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
    borderRadius:'10px',
    p: 4,
  };

  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
    borderRadius:'10px',
    p: 4,
  }

  const style3 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%', // Adjusted width for larger screens
    maxWidth: '360px', // Maximum width for smaller screens
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
    borderRadius:'10px',
    p: 4,
  };


const InternFacultyModal = ({rowData, open, handleClose, fetchUserData}) => {
    const navigate = useNavigate();
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [userId,setUserId] = useState(null)
    const [remarkResponse,setRemarkResponse] = useState(false)
    const [remark, setRemark] = useState("");
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [remarkResponseMsg,setRemarkResponseMsg] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const [certificatePath,setCertificatePath] = useState("");
    const [reportPath,setReportPath] = useState("")
    const [isTracker,setIsTracker] = useState(false)
    const [confirmModal,setConfirmModal] = useState(false);
    const [mentorCode,setmentorCode] = useState("22IT137");
    const [selectedOption, setSelectedOption] = useState("");

    const handleLogout = async () => {
      try {
        await axios.post(`${apiBaseUrl}/logout`, { withCredentials: true });
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('resources');
        
        // Redirect to login page
        navigate('/');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiLoginHost}/api/user-data`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setUserId(data.user_id)
          } else {
            console.error('Failed to fetch user data')
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      fetchUserData();
      if(rowData.certificate_path === null || rowData.certificate_path === undefined)
      setIsTracker(true);
      setReportPath(rowData.report_path)
      setSelectedOption(rowData.type) 
    }, []);

      const handleApprove = () => {
        axios.post(`${apiBaseUrl}/api/ce/in/ToApproveInternship`, { id: rowData.id, student: rowData.register_number , user_id: userId, tracker:isTracker }, { withCredentials: true })
          .then(response => {
            console.log('Student approved successfully');
            setResponseMessage('Student approved successfully');
            setIsSuccess(true);
            setResponseModalOpen(true);
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              console.error("Unauthorized, logging out:", error);
              handleLogout(); // Call logout function
            }
            else { 
            console.error('Error approving student:', error.message);
            setResponseMessage('Error approving student: ' + error.message);
            setIsSuccess(false);
            setResponseModalOpen(true);
            }
          });
      };

    const handleConfirmation = () => {
      setConfirmModal(true);
    }

    const handleReject = () => {
        setRemarkModalOpen(true);
      };
    
    const handleRemarkClose = () => {
        setRemarkModalOpen(false);
      };
    
      const handleResponseModalClose = () => {
        setResponseModalOpen(false);
        setConfirmModal(false);
        handleClose();
        fetchUserData(selectedOption); 
      };

      const setRemarkResponseClose = () => {
        setRemarkResponse(false)
        setRemarkModalOpen(false);
        handleClose();
        fetchUserData(selectedOption);
      }
    
    const handleRemarkChange = (event) => {
        setRemark(event.target.value);
      };

      const handleRemarkSubmit = () => {
        axios.post(`${apiBaseUrl}/api/ce/in/ToRejectInternship`, {remark, id: rowData.id ,user_id:userId}, { withCredentials: true })
          .then(response => {
            console.log('Remark submitted successfully');
            setRemarkResponseMsg("Remark Submitted SuccessFully")
            setIsSuccess(true);
            setRemarkResponse(true)
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              console.error("Unauthorized, logging out:", error);
              handleLogout(); // Call logout function
            }
            else { 
            console.error('Error submitting remark:', error.message);
            setRemarkResponseMsg("Failed to Update Remarks")
            setIsSuccess(false);
            setRemarkResponse(true)
            }
          });
      };

      const handleView = (path) => {
        const pdfURL = `${apiBaseUrl}/api/ce/in/InternApply/pdfs/${path}`;
        window.open(pdfURL, '_blank');
      };
    
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          {/* <div className='cross'><div className='symbol' >X</div></div> */}
          <div>
          <div className='modal' >
          <div className="CourseTit">Course Details</div>
          <hr/>
            <div className='field' >
                <div className='fldClm' >Student</div>
                <div className='fldData'>{rowData.student_name}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Register Number</div>
                <div className='fldData'>{rowData.register_number}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Department</div>
                <div className='fldData'>{rowData.branch}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Year</div>
                <div className='fldData'>{rowData.year===1?"1st Year":rowData.year===2?"2nd year":rowData.year===3?"3rd Year":"4th Year "}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Company</div>
                <div className='fldData'>{rowData.company_name + " " + rowData.company_address}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Academic Year</div>
                <div className='fldData'>{rowData.academic_year}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Semester</div>
                <div className='fldData'>{rowData.semester}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>Duration</div>
                <div className='fldData'>{rowData.duration + " " + "Days"}</div>
          </div>
          <div className='field'>
                <div className='fldClm'>Mode</div>
                <div className='fldData'>{rowData.mode}</div>
          </div>
            <div className='field'>
                <div className='fldClm'>Start Date</div>
                <div className='fldData'>{rowData.start_date}</div>
            </div>
            <div className='field'>
                <div className='fldClm'>End Date</div>
                <div className='fldData'>{rowData.end_date}</div>
            </div>
            {rowData.stipend === "Yes" ?
            <div className='field'>
                <div className='fldClm'>Stipend</div>
                <div className='fldData'>{rowData.amount}</div>
            </div>:null}
            { !isTracker && 
            <div>
            <div className='field'>
                <div className='fldClm'>Report</div>
                <div className='pdficon' onClick={()=>handleView(rowData.report_path)} ><InsertDriveFileIcon/><div>View</div></div>
            </div>
            <div className='field'>
                <div className='fldClm'>Certificate</div>
                <div className='pdficon' onClick={()=>handleView(rowData.certificate_path)} ><InsertDriveFileIcon/><div>View</div></div>
            </div>
            </div>
            }
            {rowData.elective && <div className='field'>
                <div className='fldClm'>Elective</div>
                <div className='fldData'>{rowData.elective}</div>
            </div>}
            <div className='fieldbtn'>
                <div><button className='btnApprove'  onClick={handleConfirmation}>Approve</button></div>
                <div><button className='btnRemove' onClick={handleReject}>Reject</button></div>
            </div>
          </div>
          </div>
        </Box>
      </Modal>
      {/* Remark Modal */}
      <Modal
        open={remarkModalOpen}
        onClose={handleRemarkClose}
      >
        <Box sx={style3}>
          <div>
            <div className='rm' >Remarks</div>
            <textarea
              id="remark-modal-description"
              value={remark}
              className='remarkArea'
              onChange={handleRemarkChange}
              rows={3}
              cols={38}
              placeholder="Enter your remark here..."
            ></textarea>
            {remark===""?<button className='CourseBtn' disabled={true} >Submit Remark</button>:<button className='btnApprove' onClick={handleRemarkSubmit}>Submit Remark</button>}
          </div>
        </Box>
      </Modal>
      {/* Response Modal */}
      <Modal
        open={responseModalOpen}
        onClose={handleResponseModalClose}
        style={{ zIndex: 6000 }}
      >
        <Box sx={style1} className='success'>
          <div>
            {responseMessage}
          </div>
          <div className='tick'>
            {isSuccess?<CheckCircleIcon/>:<AnnouncementIcon/>}
          </div>
        </Box>
      </Modal>
      {/* Remark submit modal */}
      <Modal
        open={remarkResponse}
        onClose={setRemarkResponseClose}
        style={{ zIndex: 6000 }}
      >
        <Box sx={style1} className='success'>
        <div>
            {remarkResponseMsg}
        </div>
        <div className='tick'>
            {isSuccess?<CheckCircleIcon/>:<AnnouncementIcon/>}
        </div>
        </Box>
      </Modal>
      {/*Confirmation Modal */}
      <Modal
      open={confirmModal}
      onClose={()=>setConfirmModal(false)}
      >
        <Box sx={style2}>
          <div>
          <div>
            Are you Sure want to approve?
          </div>
          <div style={{display:"flex",gap:"20px",marginTop:"10px"}}>
            <div><button  className='conformBtnApprove'  onClick={handleApprove} >Yes</button></div>
            <div><button className='conformBtnRemove' onClick={()=> setConfirmModal(false)} >No</button></div>
          </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default InternFacultyModal
