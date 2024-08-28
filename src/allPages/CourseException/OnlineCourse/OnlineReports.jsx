import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "../styles/courseApproval.css";
import { apiBaseUrl } from "../../../api/api";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import apiLoginHost from "../../login/LoginApi";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import BasicModal from "../stuffs/BasicModal";
import WarningIcon from "@mui/icons-material/Warning";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "250px", // Maximum width for smaller screens
  maxHeight: "85%",
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 2,
  borderRadius: "10px",
  overflowY: "auto",
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

const OnlineReports = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("1");
  const [data, setData] = useState([]);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [name, setName] = useState(""); // login details if needed can be used
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [approvalMembers, setApprovalMembers] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [revokingStatus, setRevokingStatus] = useState(null);
  const [notifyOpen, setNotifyOpen] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null); // use state for handling the filter menu
  const open = Boolean(anchorEl);

  // functions for filter menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // functions for swithcing purpose incorporated with filter icon at top right
  const handleCourseExemptionClick = () => {
    handleOptionSelect("1");
    setAnchorEl(null);
  };

  const handleRewardsClick = () => {
    handleOptionSelect("0");
    setAnchorEl(null);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    fetchUserData(option);
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

  // Main function to fetch the Approved courses
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
        if (data.user_id === 5) {
          setRevokingStatus(1);
        } else if (data.user_id === 6) {
          setRevokingStatus(2);
        } else if (data.user_id === 4) {
          setRevokingStatus(3);
        }

        let approvalStatus;
        let url;
        switch (data.user_id) {
          case 5:
            approvalStatus = 1;
            url = `${apiBaseUrl}/api/ce/oc/ApprovedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}&department=${data.departmentId}`;
            break;
          case 6:
            approvalStatus = 2;
            url = `${apiBaseUrl}/api/ce/oc/ApprovedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}`;
            break;
          case 4:
            approvalStatus = 3;
            url = `${apiBaseUrl}/api/ce/oc/ApprovedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}`;
            break;
          default:
            console.error("Unknown user id");
            return;
        }
        // Fetch faculty approvals
        const approvalResponse = await axios.get(url, {
          withCredentials: true,
        });
        if (approvalResponse.status === 200) {
          const approvalData = approvalResponse.data;
          setData(approvalData);
          console.log("Faculty Approved Data: ", approvalData);
        } else {
          console.error("Failed to fetch Approved Online Course Applications");
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
    fetchUserData(selectedOption);
    fetchApprovalMembers();
  }, []);

  // function to fetch the approval members
  const fetchApprovalMembers = async () => {
    try {
      const response1 = await axios.get(
        `${apiBaseUrl}/api/ce/oc/OnlineCourseApprovalMembers`,
        { withCredentials: true }
      );
      const jsonData1 = response1.data;
      const members = jsonData1.map((item) => item.members);
      members.push("Approved");
      setApprovalMembers(members);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        setError(error.message);
      }
    }
  };

  // Function to handle the revoking process of the application
  const handleRevoke = async (userId, id, student) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/RevokeOnlineCourse`,
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
    fetchUserData(selectedOption);
  };

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
      field: "branch",
      headerName: "Department",
      headerClassName: "super-app-theme--header",
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
      field: "platform_name",
      headerName: "Course Type",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "course_code",
      headerName: "Course Code",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "course_name",
      headerName: "Course Name",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <div>
          {params.value === 12
            ? "12 Weeks"
            : params.value === 4
            ? "4 Weeks"
            : "8 Weeks"}
        </div>
      ),
    },
    {
      field: "credit",
      headerName: "Credits",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <div>
          {params.value === 1
            ? "1 Credit"
            : params.value === 2
            ? "2 Credits"
            : "3 Credits"}
        </div>
      ),
    },
    {
      field: "academic_year",
      headerName: "Academic Year",
      headerClassName: "super-app-theme--header",
      width: 150,
    },
    {
      field: "semester",
      headerName: "Semester",
      headerClassName: "super-app-theme--header",
      width: 90,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "end_date",
      headerName: "End Date",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "exam_date",
      headerName: "Exam Date",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "mark",
      headerName: "Marks",
      headerClassName: "super-app-theme--header",
      width: 60,
    },
    {
      field: "certificate_url",
      headerName: "Certificate URL",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => (
        <a style={{ color: "black" }} href={params.value}>
          {params.value}
        </a>
      ),
    },
    {
      field: "certificate_path",
      headerName: "Certificate",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => (
        <a
          style={{ color: "black" }}
          href={`${apiBaseUrl}/api/ce/oc/onlineApply/pdfs/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Certificate
        </a>
      ),
    },
    {
      field: "elective",
      headerName: "Elective",
      headerClassName: "super-app-theme--header",
      width: 90,
      renderCell: (params) => (
        <Box>
          {params.row.elective === undefined || params.row.elective === null ? (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
              }}
            >
              NAN
            </p>
          ) : (
            params.value
          )}
        </Box>
      ),
    },
    {
      field: "view",
      headerName: "View",
      headerClassName: "super-app-theme--header",
      width: 50,
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
    noRowsLabel: `No Approved Applications for ${
      selectedOption == "1" ? "Course Exemption" : "Rewards"
    } `,
  };

  return (
    <>
      <div className="tableDefault">
        <div className="titFac">
          <div className="ti">
            <h4 style={{ marginRight: "5px" }}>Online Course </h4>{" "}
            <p>/ Approved Applications</p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4 style={{ marginTop: "30px" }}>Filter</h4>
            <div
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="filtermenu"
            >
              <FilterAltIcon className="iconfilter" />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleCourseExemptionClick}>
                Course Exemption
              </MenuItem>
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
          <div className="hometable">
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

              {/* Modal for Displaying the details */}
              {selectedRowData && (
                <BasicModal
                  faculty={true}
                  open={true} // Always keep the modal open when there's selectedRowData
                  handleClose={() => setSelectedRowData(null)}
                  rowData={selectedRowData}
                  approvalMembers={approvalMembers}
                />
              )}

              {/* Response Modal for Success or Failure */}
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

              {/* Notification Modal for Alerting the Faculty */}
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
    </>
  );
};

export default OnlineReports;
