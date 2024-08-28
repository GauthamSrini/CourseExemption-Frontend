import React, { useEffect, useState } from "react";
import "../styles/onlineCourseList.css";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../../../api/api";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import axios from "axios";
import Select from "react-select";
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

const OneCreditStudentMappings = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState(null);
  const [student, setStudent] = useState(null);
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

  // handling view function
  const handleView = (row) => {
    setSelectedRow(row);
  };

  // setting needed stuffs for deleting
  const handleDelete = (row) => {
    setDeletingRow(row);
    setCourseCode(row.course_code);
    setStudent(row.student);
  };

  // function for seraching the course with specific keywords
  const handleName = (event) => {
    setName(event.target.value);
    fetchData(event.target.value);
  };

  // Main Function to Delete a completion status
  const handleDeleteSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/DeletingOnecreditCompletion`,
        { courseCode, student },
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
        console.log("Error in Adding the Course ", error);
        const errorMsg = error.response
          ? error.response.data.msg
          : "Error in Adding the Course";
        setResponseMessage(errorMsg);
        setDeletingRow(false);
        fetchData(name);
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  };

  // Main function to Fecth the completion status of the students
  const fetchData = async (name) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/ce/oc/SearchingOneCreditCourse?name=${name}`,
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
      field: "name",
      headerName: "Course Name",
      headerClassName: "super-app-theme--header",
      width: 300,
    },
    {
      field: "student",
      headerName: "Student",
      headerClassName: "super-app-theme--header",
      width: 180,
    },
    {
      field: "academic_year",
      headerName: "Academic Year",
      headerClassName: "super-app-theme--header",
      width: 180,
    },
    {
      field: "semester",
      headerName: "Semester",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.value === 1
            ? "Semester 1"
            : params.value === 2
            ? "Semester 2"
            : params.value === 3
            ? "Semester 3"
            : params.value === 4
            ? "Semester 4"
            : params.value === 5
            ? "Semester 5"
            : params.value === 6
            ? "Semester 6"
            : params.value === 7
            ? "Semester 7"
            : "Semester 8"}
        </Box>
      ),
    },
    {
      field: "view",
      headerName: "View",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          sx={{ padding: "5px" }}
          style={{ cursor: "pointer" }}
          onClick={() => handleView(params.row)}
        >
          <RemoveRedEyeOutlinedIcon />
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
          <h4>One Credit Student Completion</h4>
        </div>
      </div>
      <div className="searchBarDiv">
        <TextField
          className="textSearch"
          variant="outlined"
          size="small"
          placeholder="Search"
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
            {/* View Modal */}
            {selectedRow && (
              <Modal open={true} onClose={() => setSelectedRow(false)}>
                <Box sx={style}>
                  <div className="edModal">
                    <div className="editTit">One Credit Completion</div>
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
                          disabled
                          defaultValue={selectedRow.course_code}
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
                          disabled
                        />
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Student RollNumber</div>
                      <div>
                        <Select
                          className="editInp"
                          placeholder=""
                          defaultValue={{
                            value: selectedRow.student,
                            label: selectedRow.student,
                          }}
                          isDisabled
                        ></Select>
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Academic Year</div>
                      <div>
                        <Select
                          className="editInp"
                          placeholder=""
                          defaultValue={{
                            value: selectedRow.academic_year,
                            label: selectedRow.academic_year,
                          }}
                          isDisabled
                        ></Select>
                      </div>
                    </div>
                    <div className="editInpDiv">
                      <div>Semester</div>
                      <div>
                        <Select
                          className="editInp"
                          placeholder=""
                          defaultValue={{
                            value: selectedRow.semester,
                            label:
                              selectedRow.semester === 1
                                ? "Semester 1"
                                : selectedRow.semester === 2
                                ? "Semester 2"
                                : selectedRow.semester === 3
                                ? "Semester 3"
                                : selectedRow.semester === 4
                                ? "Semester 4"
                                : selectedRow.semester === 5
                                ? "Semester 5"
                                : selectedRow.semester === 6
                                ? "Semester 6"
                                : selectedRow.semester === 7
                                ? "Semester 7"
                                : "Semester 8",
                          }}
                          isDisabled
                        ></Select>
                      </div>
                    </div>
                    <div className="editBtns">
                      <button
                        className="editCancelBtn"
                        onClick={() => setSelectedRow(false)}
                      >
                        close
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

export default OneCreditStudentMappings;
