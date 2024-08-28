import React, { useEffect, useState } from "react";
import "../styles/onlineCourseList.css";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { apiBaseUrl } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import WarningIcon from "@mui/icons-material/Warning";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import Select from "react-select";
import edit from '/edit.png'
import { useMediaQuery } from "@mui/material";

// defined like this for giving responive design for higher screens especially for high range desktops
const getResponsiveStyle = (isLargeScreen) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  maxWidth: isLargeScreen ? "750px" : "650px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  p: 4,
});

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

const ListOfCourses = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [courseCode, setCourseCode] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [coursePlatform, setCoursePlatform] = useState(null);
  const [courseDuration, setCourseDuration] = useState(null);
  const [courseCredits, setCourseCredits] = useState(null);
  const [courseExepmtion, setCourseExemption] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width: 1600px)");
  const style = getResponsiveStyle(isLargeScreen);

  // purposely declared inside funcntion as it uses issuccss state
  const style1 = {
    position: "absolute",
    top: "5%",
    left: "50%",
    bottom: "90%",
    transform: "translate(-50%, -50%)",
    width: 280,
    bgcolor: "background.paper",
    boxShadow: issuccess ? "green 0px 3px 2px" : "rgb(250, 41, 41) 0px 3px 2px",
    borderRadius: "10px",
    p: 4,
  };

  // logout Function
  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/logout`, { withCredentials: true });
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("resources");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  //Fetching the available Platforms
  useEffect(() => {
    const fetchPlatform = async () => {
      try {
        const type = await axios.get(`${apiBaseUrl}/api/ce/oc/platform`, {
          withCredentials: true,
        });
        setPlatformData(type.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching users:", error);
        }
      }
    };
    fetchPlatform();
  }, []);

  // setting up the dropdown options
  const PlatformList = platformData.map((types) => ({
    value: types.id,
    label: types.name,
  }));

  //List of all handling functions
  const handleEdit = (row) => {
    const platfrm = PlatformList.find(
      (platform) => platform.label === row.platform
    );
    setSelectedRow(row);
    setCourseCode(row.course_code);
    setSelectedCourseId(row.id);
    setCourseName(row.name);
    setCoursePlatform(platfrm.value);
    setCourseDuration(row.duration);
    setCourseCredits(row.credit);
    setCourseExemption(row.excemption);
  };

  const handleDelete = (row) => {
    setDeletingRow(row);
    setSelectedCourseId(row.id);
  };

  const handleCourseCode = (event) => {
    setCourseCode(event.target.value);
  };

  const handleCourseName = (event) => {
    setCourseName(event.target.value);
  };

  const handleDuration = (event) => {
    setCourseDuration(event.target.value);
  };

  const handleCredits = (event) => {
    setCourseCredits(event.target.value);
  };

  const handlePlatform = (selectedOption) => {
    setCoursePlatform(selectedOption.value);
  };

  const handleExemption = (selectedOption) => {
    setCourseExemption(selectedOption.value);
  };

  // Function to serach the courses based on keyword
  const handleName = (event) => {
    setName(event.target.value);
    fetchData(event.target.value);
  };

  // Main Function to edit the Course
  const handleEditSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/EditCourseList`,
        {
          courseCode,
          courseName,
          coursePlatform,
          courseDuration,
          courseCredits,
          courseExepmtion,
          selectedCourseId,
        },
        { withCredentials: true }
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
      } else {
        console.log("Error in Updating the Course", error);
        setSelectedRow(false);
        fetchData(name);
        setResponseMessage("Error in Updating the Course");
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  };

  // Main Function to delete a Course
  const handleDeleteSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/DeleteCourseList`,
        { selectedCourseId },
        { withCredentials: true }
      );
      console.log("Response :", response.data);
      if (response.status === 200) {
        console.log("Course Deleted Successfully");
        setDeletingRow(false);
        fetchData(name);
        setResponseMessage("Course Deleted Successfully");
        setResponseModalOpen(true);
        setIsSuccess(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.log("Error in Deleting the Course ", error);
        const errorMsg = error.response
          ? error.response.data.msg
          : "Error in Deleting the Course";
        setResponseMessage(errorMsg);
        setDeletingRow(false);
        fetchData(name);
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  };

  // Main Function to Search the course List
  const fetchData = async (name) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/ce/oc/SearchCourseList?name=${name}`,
        { withCredentials: true }
      );
      const jsonData = response.data;
      setData(jsonData);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData(name);
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "course_code",
      headerName: "Course Code",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "platform",
      headerName: "Platform",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Course Name",
      headerClassName: "super-app-theme--header",
      width: 300,
    },
    {
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Box>
          {params.value === 12
            ? "12 Weeks"
            : params.value === 8
            ? "8 Weeks"
            : "4 Weeks"}
        </Box>
      ),
    },
    {
      field: "credit",
      headerName: "Credits",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "excemption",
      headerName: "Exemption",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => <Box>{params.value === "1" ? "Yes" : "No"}</Box>,
    },
    {
      field: "edit",
      headerName: "Edit",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "rgb(62, 62, 230)",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
          }}
          style={{ cursor: "pointer" }}
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
          sx={{
            backgroundColor: "rgb(250, 41, 41)",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
          }}
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
          <h4>Online Course List</h4>
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
                <SearchIcon style={{ color: "var(--secondaryBlue)" }} />
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
                  maxWidth: "100%", // Set width to 80%
                  overflowX: "auto", // Enable horizontal scrolling
                  "& .super-app-theme--header": {
                    color: "var(--heading-crsExp)",
                    justifyContent: "center",
                  },
                  "& .MuiDataGrid-columnsContainer": {
                    overflow: "visible", // Allow column headers to overflow for scrolling
                  },
                  "& .MuiDataGrid-colCell, .MuiDataGrid-cell": {
                    whiteSpace: "nowrap", // Prevent wrapping of cell content
                  },
                }}
              />
            </div>

            {/* Edit Modal */}
            {selectedRow && (
              <Modal open={true} onClose={() => setSelectedRow(false)}>
                <Box className="ListCourseMaindiv" sx={style}>
                  <div className="edModal">
                    <div className="editTit">Edit Course</div>
                    <hr
                      style={{
                        marginBottom: "20px",
                        marginLeft: "15px",
                        marginRight: "15px",
                      }}
                    />
                    <div className="editInpDiv">
                      <div>Course Code</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          defaultValue={selectedRow.course_code}
                          onChange={handleCourseCode}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Course Name</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          defaultValue={selectedRow.name}
                          onChange={handleCourseName}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Course Platform</div>
                      <div>
                        <Select
                          className="editInp"
                          options={PlatformList}
                          placeholder=""
                          defaultValue={{
                            value: PlatformList.find(
                              (platform) =>
                                platform.label === selectedRow.platform
                            ),
                            label: selectedRow.platform,
                          }}
                          onChange={handlePlatform}
                        ></Select>
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Course Duration</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={selectedRow.duration}
                          onChange={handleDuration}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Course Credits</div>
                      <div>
                        <TextField
                          className="editInp"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={selectedRow.credit}
                          onChange={handleCredits}
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Valid For Exemption</div>
                      <div>
                        <Select
                          className="editInp"
                          options={[
                            { value: "1", label: "Yes" },
                            { value: "0", label: "No" },
                          ]}
                          placeholder=""
                          defaultValue={{
                            value: selectedRow.excemption,
                            label:
                              selectedRow.excemption === "1" ? "Yes" : "No",
                          }}
                          onChange={handleExemption}
                        ></Select>
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

            {/* confirmation modal for deleting a row */}
            {deletingRow && (
              <Modal open={true} onClose={() => setDeletingRow(false)}>
                <Box sx={style2}>
                  <div className="edModal">
                    <div className="DelTit">
                      Confirmation{" "}
                      <WarningIcon
                        className="warningIcon"
                        style={{ color: "rgb(250, 41, 41)" }}
                      />
                    </div>
                    <hr style={{ marginBottom: "10px" }} />
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
                          className="conformBtnDelete"
                          onClick={handleDeleteSubmit}
                        >
                          Delete
                        </button>
                      </div>
                      <div>
                        <button
                          className="conformBtnCancel"
                          onClick={() => setDeletingRow(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </Box>
              </Modal>
            )}

            {/* Response Modal gives info about the success or failure */}
            <Modal
              open={responseModalOpen}
              onClose={() => setResponseModalOpen(false)}
              style={{ zIndex: 6000 }}
            >
              <Box sx={style1} className="success">
                <div>{responseMessage}</div>
                <div className="tick">
                  {issuccess ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    <AnnouncementIcon style={{ color: "rgb(250, 41, 41)" }} />
                  )}
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfCourses;
