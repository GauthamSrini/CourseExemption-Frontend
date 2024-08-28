import React, { useEffect, useState } from "react";
import "../styles/onlineCourseList.css";
import TextField from "@mui/material/TextField";
import { apiBaseUrl } from "../../../api/api";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Slide from '@mui/material/Slide';
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import Select from "react-select";
import { useMediaQuery } from '@mui/material';

const getResponsiveStyle = (isLargeScreen) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width:"70%",
  maxWidth: isLargeScreen ? "750px": "650px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  p: 4,
});

  
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
  
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 200,
    bgcolor: "background.paper",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    borderRadius: "10px",
    p: 4,
  };    

const InternshipCompanies = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [companyDataWithoutId,setCompanyDatawithoutId] = useState([])
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState(null);
  const [companyAddress, setCompanyAddress] = useState(null);
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState(null);
  const [selectedCompanyId,setSelectedCompanyId] = useState(null)
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const isLargeScreen = useMediaQuery('(min-width: 1500px)');
  const style = getResponsiveStyle(isLargeScreen);

  
  const handleEdit = (row) => {
    setSelectedRow(row);
    setCompanyName(row.company_name);
    setSelectedCompanyId(row.id);
    setCompanyAddress(row.company_address);
    setCompanyPhoneNumber(row.company_phone);
  };

  const handleDelete = (row) => {
    setDeletingRow(row);
    setSelectedCompanyId(row.id);
  };

  const handleName = (event) => {
    setName(event.target.value);
    fetchData(event.target.value);
  };

  const handleCompanyName = (event) => {
    setCompanyName(event.target.value);
  };

  const handleCompanyAddress = (event) => {
    setCompanyAddress(event.target.value);
  };
  
  const handleCompanyPhone = (event) => {
    setCompanyPhoneNumber(event.target.value);
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

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/in/InternCompanyEdit`,
        {
          companyName,
          companyAddress,
          companyPhoneNumber,
          selectedCompanyId
        }
        , { withCredentials: true }
      );
      console.log("Response:", response.data);
      if (response.status === 200) {
        console.log("Course Updated Successfully");
        setSelectedRow(false);
        fetchData(name);
        setResponseMessage("Course Updated Successfully");
        setResponseModalOpen(true);
        setIsSuccess(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
      console.log("Error in Updating the Course", error);
      setSelectedRow(false);
      fetchData(name);
      setResponseMessage("Error in Updating the Course");
      setResponseModalOpen(true);
      setIsSuccess(false);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try{
        const response = await axios.post(`${apiBaseUrl}/api/ce/in/InternCompanyDelete`,{selectedCompanyId}, { withCredentials: true })
        console.log("Response :",response.data);
        if(response.status===200){
            console.log("Company Deleted Successfully");
            setDeletingRow(false);
            fetchData(name)
            setResponseMessage("Company Deleted Successfully");
            setResponseModalOpen(true);
            setIsSuccess(true);
        }
    }
    catch(error){
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
        console.log("Error in Deleting the Company ", error);
        const errorMsg = error.response ? error.response.data.msg : "Error in Deleting the Company";
        setResponseMessage(errorMsg);
        setDeletingRow(false)
        fetchData(name);
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  }

  const fetchData = async (name) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/ce/in/InternCompanySearch?name=${name}`, { withCredentials: true }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      const rowsWithSno = jsonData.map((row, index) => ({
        ...row,
        sno: index + 1, // Sequential number
      }));
      setData(rowsWithSno);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
      console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData(name);
  }, []);

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "company_name",
      headerName: "Company Name",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
    {
      field: "company_address",
      headerName: "Company Address",
      headerClassName: "super-app-theme--header",
      width: 300,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          sx={{backgroundColor:"rgb(62, 62, 230)",color:"white",padding:"5px",borderRadius:"5px"}}
          style={{ cursor: "pointer", }}
          onClick={() => handleEdit(params.row)}
        >
          <EditNoteIcon />
        </Box>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          sx={{backgroundColor:"rgb(250, 41, 41)",color:"white",padding:"5px",borderRadius:"5px"}}
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(params.row)}
        >
          <DeleteIcon />
        </Box>
      ),
    },
  ];

  const customLocaleText = {
    noRowsLabel: "No Courses Available",
  };

  return (
    <div className="tableDefault">
      <div className="titleBtn">
        <div className="titlehm">
          <h4>InternShip Companies List</h4>
        </div>
      </div>
      <div className="searchBarDiv">
        <TextField
          className="textSearch"
          variant="outlined"
          size="small"
          placeholder="Course Name"
          onChange={handleName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        <div className="hometable">
          <div className="tableMain">
            <div className="datagrid">
              <DataGrid
                className="dat"
                autoHeight
                rows={data}
                columns={columns}
                localeText={customLocaleText}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                sx={{
                  maxWidth: '100%', // Set width to 80%
                  overflowX: 'auto', // Enable horizontal scrolling
                  '& .super-app-theme--header': {
                    color: 'var(--heading-crsExp)',
                    justifyContent: 'center',
                  },
                  '& .MuiDataGrid-columnsContainer': {
                    overflow: 'visible', // Allow column headers to overflow for scrolling
                  },
                  '& .MuiDataGrid-colCell, .MuiDataGrid-cell': {
                    whiteSpace: 'nowrap', // Prevent wrapping of cell content
                  },
                }}
              />
            </div>
            {selectedRow && (
              <Modal open={true} onClose={() => setSelectedRow(false)}>
                <Box sx={style}>
                  <div className="edModal">
                    <div className="editTit">Edit Company</div>
                    <div className="editInpDiv">
                      <div>Company Name</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          value={companyName}
                          defaultValue={selectedRow.company_name}
                          onChange={handleCompanyName}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Company Address</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          value={companyAddress}
                          defaultValue={selectedRow.company_address}
                          onChange={handleCompanyAddress}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Company PhoneNumber</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={selectedRow.company_phone}
                          value={companyPhoneNumber}
                          onChange={handleCompanyPhone}
                        />
                      </div>
                    </div>
                    <div className="editBtns">
                      <button
                        className="editCancelBtn"
                        onClick={() => setSelectedRow(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="editConformBtn"
                        onClick={handleEditSubmit}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
            {deletingRow && (
              <Modal open={true} onClose={() => setDeletingRow(false)}>
                <Box sx={style2}>
                  <div className="edModal">
                    <div className="DelTit">Delete Course</div>
                    <div>Are you Sure want to delete?</div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "10px",
                      }}
                    >
                      <div>
                        <button
                          className="conformBtnApprove"
                          onClick={handleDeleteSubmit}
                        >
                          Yes
                        </button>
                      </div>
                      <div>
                        <button
                          className="conformBtnRemove"
                          onClick={() => setDeletingRow(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
            <Modal
              open={responseModalOpen}
              onClose={() => setResponseModalOpen(false)}
              style={{ zIndex: 6000 }}
            >
              <Box sx={style1} className="success">
                <div>{responseMessage}</div>
                <div className="tick">
                  {issuccess ? <CheckCircleIcon /> : <AnnouncementIcon />}
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipCompanies
