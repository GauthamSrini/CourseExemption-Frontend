import React, { useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FacultyModal from '../stuffs/FacultyModal';
import '../styles/courseApproval.css';
import { apiBaseUrl } from "../../../api/api";
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Modal from "@mui/material/Modal";
import  apiLoginHost  from "../../login/LoginApi"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import InternBasicModal from '../stuffs/InternBasicModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%', // Adjusted width for larger screens
  maxWidth: '450px', // Maximum width for smaller screens
  maxHeight: '85%',
  bgcolor: 'background.paper',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
  p: 4,
  borderRadius:'10px',
  overflowY: 'auto',
};

const style1 = {
  position: "absolute",
  top: "5%",
  left: "50%",
  bottom: "90%",
  transform: "translate(-50%, -50%)",
  width: 280,
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  borderRadius: "10px",
  p: 4,
};


const RejectedStudents = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("1");
    const [data, setData] = useState([]);
    const [name,setName] = useState("")
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [issuccess, setIsSuccess] = useState(null);
    const [department,setDepartment] = useState(null)
    const [userId,setUserId] = useState(null)
    const [approvalMembers,setApprovalMembers] = useState([])
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [revokingStatus,setRevokingStatus] = useState(null);
    const [notifyOpen,setNotifyOpen] = useState(null);
    // const [mentorCode,setmentorCode] = useState("22IT137");
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCourseExemptionClick = () => {
    handleOptionSelect("1")
    setAnchorEl(null);
  }

  const handleRewardsClick = () => {
    handleOptionSelect("0")
    setAnchorEl(null);
  }
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    fetchUserData(option);
  };

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

  
  const fetchUserData = async (selectedOption) => {
    try {
      const response = await axios.get(`${apiLoginHost}/api/user-data`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const data = response.data;
        setName(data.name);
        setDepartment(data.departmentId);
        setUserId(data.user_id);
        
        let approvalStatus;
        let url;
        let rejected_by;
        switch (data.user_id) {
          case 5:
            approvalStatus = -1;
            rejected_by = 1
            url = `${apiBaseUrl}/api/ce/in/RejectedInternship?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}&department=${data.departmentId}`;
            break;
          case 7:
            approvalStatus = -1;
            rejected_by = 2
            url = `${apiBaseUrl}/api/ce/in/RejectedInternship?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}`;
            break;
          case 8:
            approvalStatus = -1;
            rejected_by = 3
            url = `${apiBaseUrl}/api/ce/in/RejectedInternship?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}`;
            break;
          case 4:
            approvalStatus = -1;
            rejected_by = 4
            url = `${apiBaseUrl}/api/ce/in/RejectedInternship?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}`;
            break;
          default:
            console.error('Unknown user id');
            return;
        }
        // Fetch faculty approvals
        const approvalResponse = await axios.get(url, { withCredentials: true });
        if (approvalResponse.status === 200) {
          const approvalData = approvalResponse.data;
          setData(approvalData)
          console.log('Faculty Approved Data: ', approvalData);
        } else {
          console.error('Failed to fetch faculty approvals');
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
      console.error('Error fetching user data:', error);
      }
    }
  };
      
      useEffect(() => {
        fetchUserData(selectedOption);
        fetchApprovalMembers()
      }, []);

        const fetchApprovalMembers = async () => {
          try {
            const response1 = await fetch(`${apiBaseUrl}/api/ce/in/InternApprovalMembers`, { withCredentials: true });
            if(!response1.ok){
              throw new Error('Failed to fetch approval Members');
            }
            const jsonData1 = await response1.json();
            const members = jsonData1.map(item => item.member);
            members.push("Approved");
            setApprovalMembers(members)
          } catch (error) {
            if (error.response && error.response.status === 401) {
              console.error("Unauthorized, logging out:", error);
              handleLogout(); // Call logout function
            }
            else { 
            setError(error.message);
            }
          }
        };

        const handleCloseModal = () => {
          setResponseModalOpen(false)
          fetchUserData(selectedOption)
        }

        const columns = [
          { field: 'student_name', headerName: 'Student', headerClassName: 'super-app-theme--header', width:130 },
          { field: 'register_number', headerName: 'Register Number', headerClassName: 'super-app-theme--header', width:130 },
          { field: 'branch', headerName: 'Department', headerClassName: 'super-app-theme--header' },
          { field: 'year', headerName: 'Year Of Study', headerClassName: 'super-app-theme--header' ,
          renderCell: (params) => (
            <Box>
              {
                params.value === 1 ? "1st Year" : params.value === 2 ? "2nd Year" : params.value === 3 ? "3rd Year" : "4th year"
              }
            </Box>
          ),
        },
        {
          field: 'company_name',
          headerName: 'Industry Details',
          headerClassName: 'super-app-theme--header',
          renderCell: (params) => (
            <Box >
              {params.value + '-' + params.row.company_address}
            </Box>
          ),
          width:200
        },
          { field: 'academic_year', headerName: 'Academic Year', headerClassName: 'super-app-theme--header', width:150 },
          { field: 'semester', headerName: 'Semester', headerClassName: 'super-app-theme--header', width:90 },
          { field: 'duration', headerName: 'Duration', headerClassName: 'super-app-theme--header', width:100 ,
            renderCell: (params) => (
              <Box >
                {params.value + " Days"}
              </Box>
            ),
          },
          {
            field: 'mode',
            headerName: 'Mode',
            headerClassName: 'super-app-theme--header',
          },
          { field: 'start_date', headerName: 'Start Date', headerClassName: 'super-app-theme--header', width:100 },
          { field: 'end_date', headerName: 'End Date', headerClassName: 'super-app-theme--header', width:100 },
          { field: 'stipend', headerName: 'Stipend', headerClassName: 'super-app-theme--header', width:100,
            renderCell: (params) => (
              <Box >
                {params.value==="Yes"?<div style={{display:"flex"}} ><CurrencyRupeeIcon sx={{height:"18px"}}/>{params.row.amount}</div>:"NULL"}
              </Box>
            ),
           },
          {
            field: 'certificate_path',
            headerName: 'Certificate',
            headerClassName: 'super-app-theme--header',
            width:120,
            renderCell: (params) => (
              <a style={{color:"black"}} href={`${apiBaseUrl}/api/ce/in/InternApply/pdfs/${params.value}`} target="_blank" rel="noopener noreferrer">
                View Certificate
              </a>
            )
          },
          {
            field: 'report_path',
            headerName: 'Report',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
              <a style={{color:"black"}} href={`${apiBaseUrl}/api/ce/in/InternApply/pdfs/${params.value}`} target="_blank" rel="noopener noreferrer">
                View Report
              </a>
            )
          },
          { field: 'elective', headerName: 'Elective', headerClassName: 'super-app-theme--header' , width:90},
          {
            field: 'view',
            headerName: 'View',
            headerClassName: 'super-app-theme--header',
            width:50,
            renderCell: (params) => (
              <Box style={{ cursor: 'pointer' }} onClick={() => setSelectedRowData(params.row)} >
                <RemoveRedEyeOutlinedIcon />
              </Box>
            ),
          }
        ]
      
        const customLocaleText = {
          noRowsLabel: `No Students Have Applied Yet for ${selectedOption == 1 ? "Course Exemption" : "Rewards"} `, 
        };
        
  return (
    <>
    <div className='tableDefault'>
      <div className="titFac">
        <div className="ti">
          <h4>Rejected Courses - Internship</h4>
        </div>
        <div  style={{ display: "flex", flexDirection: "row" }} >
         <h4 style={{ marginTop: "30px" }}>Filter</h4>
      <div
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className='filtermenu'
      >
        <FilterAltIcon className="iconfilter" />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCourseExemptionClick}>Course Exemption</MenuItem>
        <MenuItem onClick={handleRewardsClick}>Rewards</MenuItem>
      </Menu>
    </div>
      </div>
      <div>
        <div className="titl">
          <div>{selectedOption == "1" ? "Course Exemption" : "Rewards"}</div>
        </div>
      </div>
      <div>
        <div className='hometable'>
        <div className="tableMain">
          <div className="datagrid">
            <DataGrid
              autoHeight
              rows={data}
              columns={columns}
              localeText={customLocaleText}
              sx={{
                maxWidth: "100%", // Set width to 80%
                overflowX: "auto", // Enable horizontal scrolling
                "& .super-app-theme--header": {
                  color: "var(--heading-crsExp)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
                "& .MuiDataGrid-columnsContainer": {
                  overflow: "visible", // Allow column headers to overflow for scrolling
                },
                "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
                  whiteSpace: "nowrap", // Prevent wrapping of cell content
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </div>
          {selectedRowData && 
            <InternBasicModal
            faculty={true}
            open={true} // Always keep the modal open when there's selectedRowData
            handleClose={() => setSelectedRowData(null)}
            rowData={selectedRowData}
            approvalMembers={approvalMembers}
          />
          }
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default RejectedStudents
