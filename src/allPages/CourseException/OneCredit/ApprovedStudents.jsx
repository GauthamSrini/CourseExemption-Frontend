import React, { useEffect, useState } from "react";
import "../styles/courseApproval.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { apiBaseUrl } from "../../../api/api";
import Modal from "@mui/material/Modal";
import apiLoginHost from "../../login/LoginApi";
import axios from "axios";
import LoopIcon from "@mui/icons-material/Loop";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import OneCreditFacultyModal from "../stuffs/OneCreditFacultyModal";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "250px", // Maximum width for smaller screens
  maxHeight: "85%",
  bgcolor: "background.paper",
  boxShadow: "rgb(250, 41, 41) 0px 3px 2px;",
  p: 4,
  borderRadius: "10px",
  overflowY: "auto",
};

const ApprovedStudents = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [revokingStatus, setRevokingStatus] = useState(null);
  const [notifyOpen, setNotifyOpen] = useState(null);
  const [userId, setUserId] = useState(null);

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

  // Main Function for fetching the Approved Applications
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiLoginHost}/api/user-data`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const data = response.data;
        setName(data.name);
        setDepartment(data.departmentId);
        setUserId(data.user_id);

        if (data.user_id === 2) {
          setRevokingStatus(1); // setting up the revokation status for enabling the revocation button
        } else if (data.user_id === 3) {
          setRevokingStatus(2);
        } else if (data.user_id === 4) {
          setRevokingStatus(3);
        }

        let approvalStatus;
        let url;
        switch (data.user_id) {
          case 2:
            approvalStatus = 1;
            url = `${apiBaseUrl}/api/ce/oneCredit/ApprovedOneCredit?&approval_status=${approvalStatus}`;
            break;
          case 3:
            approvalStatus = 2;
            url = `${apiBaseUrl}/api/ce/oneCredit/ApprovedOneCredit?&approval_status=${approvalStatus}`;
            break;
          case 4:
            approvalStatus = 3;
            url = `${apiBaseUrl}/api/ce/oneCredit/ApprovedOneCredit?&approval_status=${approvalStatus}`;
            break;
          default:
            console.error("Unknown user id");
            return;
        }
        // Fetch Approved Applications
        const approvalResponse = await axios.get(url, {
          withCredentials: true,
        });
        if (approvalResponse.status === 200) {
          const approvalData = approvalResponse.data;
          setData(approvalData);
          console.log("one credit Approved", approvalData);
        } else {
          console.error("Failed to fetch Approved Applications");
        }
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const columns = [
    {
      field: "student_name",
      headerName: "Student",
      headerClassName: "super-app-theme--header",
      width: 130,
    },
    {
      field: "register_number",
      headerName: "Register Number",
      headerClassName: "super-app-theme--header",
      width: 130,
    },
    {
      field: "year",
      headerName: "Year Of Study",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box>
          {params.value === 1
            ? "1st Year"
            : params.value === 2
            ? "2nd Year"
            : params.value === 3
            ? "3rd Year"
            : "4th year"}
        </Box>
      ),
    },
    {
      field: "branch",
      headerName: "Department",
      headerClassName: "super-app-theme--header",
      width: 70,
    },

    {
      field: "course_1_code",
      headerName: "Course Code 1",
      headerClassName: "super-app-theme--header",
      width: 120,
    },

    {
      field: "course_1_name",
      headerName: "Course Name 1",
      headerClassName: "super-app-theme--header",
      width: 150,
    },

    {
      field: "academic_year_1",
      headerName: "Academic Year 1",
      headerClassName: "super-app-theme--header",
      width: 140,
    },

    {
      field: "semester_1",
      headerName: "Semecter 1",
      headerClassName: "super-app-theme--header",
      width: 90,
    },

    {
      field: "course_2_code",
      headerName: "Course Code 2",
      headerClassName: "super-app-theme--header",
      width: 120,
    },

    {
      field: "course_2_name",
      headerName: "Course Name 2",
      headerClassName: "super-app-theme--header",
      width: 150,
    },

    {
      field: "academic_year_2",
      headerName: "Academic Year 2",
      headerClassName: "super-app-theme--header",
      width: 140,
    },

    {
      field: "semester_2",
      headerName: "Semecter 2",
      headerClassName: "super-app-theme--header",
      width: 90,
    },

    {
      field: "course_3_code",
      headerName: "Course Code 3",
      headerClassName: "super-app-theme--header",
      width: 120,
    },

    {
      field: "course_3_name",
      headerName: "Course Name 3",
      headerClassName: "super-app-theme--header",
      width: 150,
    },

    {
      field: "academic_year_3",
      headerName: "Academic Year 3",
      headerClassName: "super-app-theme--header",
      width: 140,
    },

    {
      field: "semester_3",
      headerName: "Semecter 3",
      headerClassName: "super-app-theme--header",
      width: 90,
    },

    {
      field: "elective",
      headerName: "Elective",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "view",
      headerName: "View",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedRowData(params.row)}
        >
          <RemoveRedEyeOutlinedIcon />
        </Box>
      ),
    },
    {
      field: "revoke",
      headerName: "Revoke",
      headerClassName: "super-app-theme--header",
      width: 70,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <button
            className="revokeBtn"
            disabled={
              params.row.approval_status === revokingStatus ? false : true
            }
          >
            <div>
              <LoopIcon
                style={{
                  color:
                    params.row.approval_status === revokingStatus
                      ? "var(--secondaryBlue)"
                      : null,
                }}
                onClick={() =>
                  handleRevoke(
                    userId,
                    params.row.id,
                    params.row.register_number
                  )
                }
              />
            </div>
          </button>
          <div className="notify">
            {params.row.approval_status > revokingStatus ? (
              <CircleNotificationsIcon onClick={() => setNotifyOpen(true)} />
            ) : null}
          </div>
        </div>
      ),
    },
  ];
  const customLocaleText = {
    noRowsLabel: `No Students Have Applied Yet forCourse Exemption`,
  };

  // Function to Revoke the Approval Status
  const handleRevoke = async (userId, id, student) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oneCredit/RevokingOneCredit`,
        { userId, id, student },
        { withCredentials: true }
      );
      console.log("Response :", response.data);
      if (response.status === 200) {
        console.log("Approval Status Revoked");
        setResponseMessage("Approval Status Revoked");
        setResponseModalOpen(true);
        setIsSuccess(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.log("Error in Revoking the status ", error);
        const errorMsg =
          error.response && error.response.data.error
            ? error.response.data.error
            : "Error in Revoking the status";
        setResponseMessage(errorMsg);
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  };

  const handleCloseModal = () => {
    setResponseModalOpen(false);
    fetchUserData();
  };

  return (
    <div className="tableDefault">
      <div className="titFac">
        <div className="ti">
          <h4 style={{ marginRight: "5px" }}>One Credit</h4>{" "}
          <p>/ Approved Applications</p>
        </div>
      </div>
      <div>
        <div className="subtit">
          <div>Course Exemption</div>
        </div>
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
                sx={{
                  maxWidth: "100%", // Set width to 80%
                  overflowX: "auto", // Enable horizontal scrolling
                  "& .super-app-theme--header": {
                    color: "var(--heading-crsExp)",
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
            {/* Modal for Displaying the Courses */}
            {selectedRowData && (
              <OneCreditFacultyModal
                open={true} // Always keep the modal open when there's selectedRowData
                handleClose={() => setSelectedRowData(null)}
                rowData={selectedRowData}
                fetchUserData={fetchUserData}
                reviewed={true}
              />
            )}

            {/* Response Modal giving the success or failure */}
            <Modal
              open={responseModalOpen}
              onClose={handleCloseModal}
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

            {/* Modal for Alerting the Faculty */}
            <Modal open={notifyOpen} onClose={() => setNotifyOpen(false)}>
              <Box sx={style}>
                <div className="NotifyModal">
                  <div>
                    <WarningIcon
                      className="warningIcon"
                      style={{ color: "rgb(250, 41, 41)" }}
                    />
                  </div>
                  <div>
                    Check for Approval Status Next Faculty Has Approved this
                    Application...So you can not Revoke the Status
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedStudents;
