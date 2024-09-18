import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import '../styles/table.css';
import { apiBaseUrl } from "../../../api/api";
import InternBasicModal from './InternBasicModal';
import { useMediaQuery } from "@mui/material";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const InternshipTable = () => {
  const [data, setData] = useState([]);
  const [trackerData,setTrackerData] = useState(null)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student,setStudent] = useState("7376222AD156")
  const [selectedRowData,setSelectedRowData] = useState(null)
  const [approvalMembers,setApprovalMembers] = useState([])
  const [id,setId] = useState(2);
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/ce/in/Registered?student=${student}`, { withCredentials: true });
        const response1 = await axios.get(`${apiBaseUrl}/api/ce/in/InternApprovalMembers`, { withCredentials: true });
        const jsonData = response1.data;
        const members = jsonData.map(item => item.member);
        members.push("Approved");
        setApprovalMembers(members)
        setData(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        }
        else { 
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false)
      }
      }
    };

    const fetchRegisteredTrackers = async () => {
      try{
        const response = await axios.get(`${apiBaseUrl}/api/ce/in/RegisteredInterntrackers?student=${student}`,{withCredentials:true});
        setTrackerData(response.data)
      }
      catch(error){
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        }
        else { 
        console.log('Error fetching data:', error);
      }
      }
    }

    fetchData();
    fetchRegisteredTrackers();
  }, []);

  // Function to navigate to the InternshipForm and pass the id
  const handleApplyIntern = (row) => {
    const row_id = row.id;
    navigate('/InternshipForm', { state: { id , row_id } }); // Pass id as state
  };


  let dynamicFlex = isSmallScreen ? null : 1;
  const columns = [
    {
      field: 'company_name',
      headerName: 'Industry Details',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box >
          {params.value + '-' + params.row.company_address}
        </Box>
      ),
      width:200,
      flex:dynamicFlex
    },
    {
      field: 'mode',
      headerName: 'Mode',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex,
      renderCell: (params) => (
        <Box sx={{marginLeft:"10px"}} >{params.value}</Box>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'duration',
      headerName: 'Duration',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'academic_year',
      headerName: 'Academic Year',
      headerClassName: 'super-app-theme--header',
      width:140,
      flex:dynamicFlex
    },
    {
      field: 'aim_objective_path',
      headerName: 'Aim Objective',
      headerClassName: 'super-app-theme--header',
      width:120,
      renderCell: (params) => (
        <a style={{color:"black"}} href={`${apiBaseUrl}/api/ce/in/InternTrackerApply/pdfs/${params.value}`} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      )
    },
    {
      field: "apply",
      headerName: "Application",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <Box style={{ cursor: "pointer" }}>
          {((params.row.tracker_approval === 1)&&(params.row.approval_status === 0)&&(params.row.certificate_path === null))? (
            <div style={{ display: "flex" }}>
              <button
                className="ApplyBtn"
                onClick={()=>handleApplyIntern(params.row)}
                style={{ paddingLeft: "24px", paddingRight: "24px" }}
              >
                Apply
              </button>
            </div>
          ) : params.row.tracker_approval === 0 ? (
            <button className="ApplyBtn" style={{ backgroundColor: "gray" }}>
              Initiated
            </button>
          ) : params.row.approval_status === -1 ? (
            <button className="ApplyBtn" style={{ backgroundColor: "red" }}>
              Rejected
            </button>
          ) : <button className="ApplyBtn" style={{ backgroundColor: "green" }}>
            Applied
          </button> }
        </Box>
      ),
    },
  ];

  const ApplicationsColums = [
    {
      field: 'company_name',
      headerName: 'Industry Details',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box >
          {params.value + '-' + params.row.company_address}
        </Box>
      ),
      width:200,
      flex:dynamicFlex
    },
    {
      field: 'mode',
      headerName: 'Mode',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex,
      renderCell: (params) => (
        <Box sx={{marginLeft:"10px"}} >{params.value}</Box>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'duration',
      headerName: 'Duration',
      headerClassName: 'super-app-theme--header',
      flex:dynamicFlex
    },
    {
      field: 'academic_year',
      headerName: 'Academic Year',
      headerClassName: 'super-app-theme--header',
      width:140,
      flex:dynamicFlex
    },
     {
      field: 'type',
      headerName: 'Applied for',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <div>{params.value==="1"?"Exemption":params.value==="0"?"Rewards":null}</div>
      )
    },
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
      flex:dynamicFlex
    },
    {
      field: 'approval_status',
      headerName: 'Status',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box
          style={{
            backgroundColor:
            (params.value >=0 && params.value <4)
                ? 'grey'
                : params.value === 4
                ? 'green'
                : params.value === -1
                ? 'red'
                : 'inherit',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
          }}
        >
           { (params.value >=0 && params.value <4)
            ? 'Initiated'
            : params.value === 4
            ? 'Approved'
            : params.value === -1
            ? 'Rejected'
            : 'Unknown'}
        </Box>
      ),
      flex:dynamicFlex
    },
  ]

  const customLocaleText = {
    noRowsLabel: 'You have not yet applied any internship reports yet',
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='tableMain' style={{height:data.length>0?"500px":"100%"}} >
      <div className="titl" style={{marginLeft:0,marginTop:0,marginBottom:"20px"}}>
            <div>InternShip Trackers</div>
      </div>
      <div className="datagrid">
        <DataGrid
          autoHeight
          rows={trackerData}
          columns={columns}
          localeText={customLocaleText}
          getRowId={(row) => row.id}
          sx={{
            "--DataGrid-overlayHeight": "100px",
            "& .super-app-theme--header": {
              color: "var(--heading-crsExp)", 
            },
            "& .MuiDataGrid-root": {
              width: "100%", // Ensure the DataGrid fills the container width
              height: "100%", // Ensure the DataGrid fills the container height
            },
            "& .MuiDataGrid-columnsContainer": {
              gap: "70px",
              margin: "10px", // Add gap between columns
            },
            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
              padding: "5px", // Add padding to column headers and cells
            },
          }}
        />
      </div>
      {selectedRowData && (
        <InternBasicModal
        open={true} // Always keep the modal open when there's selectedRowData
        handleClose={() => setSelectedRowData(null)}
        rowData={selectedRowData}
        approvalMembers={approvalMembers}
      />
      )}
      { data.length>0 &&
      <div>
      <div className="titl" style={{marginLeft:0,marginTop:"20px",marginBottom:"20px"}}>
            <div>InternShip Applications</div>
      </div>
      <div className='datagrid'>
        <DataGrid
        autoHeight
        rows={data}
        columns={ApplicationsColums}
        localeText={customLocaleText}
        />
      </div>
    </div>
}
    </div>
  );
}

export default InternshipTable;