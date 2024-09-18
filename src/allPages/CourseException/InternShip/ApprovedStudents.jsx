import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FacultyModal from "../stuffs/FacultyModal";
import "../styles/courseApproval.css";
import { apiBaseUrl } from "../../../api/api";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Modal from "@mui/material/Modal";
import apiLoginHost from "../../login/LoginApi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import InternBasicModal from "../stuffs/InternBasicModal";
import WarningIcon from "@mui/icons-material/Warning";
import InternFacultyModal from "../stuffs/InternFacultyModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "220px", // Maximum width for smaller screens
  maxHeight: "85%",
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 4,
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

const ApprovedStudents = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("1");
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [approvalMembers, setApprovalMembers] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [revokingStatus, setRevokingStatus] = useState(null);
  const [notifyOpen, setNotifyOpen] = useState(null);
  const [notifyTrackerOpen,setNotifyTrackerOpen] = useState(null);
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
    handleOptionSelect("1");
    setAnchorEl(null);
  };

  const handleRewardsClick = () => {
    handleOptionSelect("0");
    setAnchorEl(null);
  };

  const handleTrackerClick = () => {
    handleOptionSelect("2");
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    fetchUserData(option);
  };

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
        } else if (data.user_id === 7) {
          setRevokingStatus(2);
        } else if (data.user_id === 8) {
          setRevokingStatus(3);
        } else if (data.user_id === 4) {
          setRevokingStatus(4);
        }

        let approvalStatus;
        let url;
        let trackerApproval;
        switch (data.user_id) {
          case 5:
            approvalStatus = 1;
            url = `${apiBaseUrl}/api/ce/in/ApprovedInternship?type=${selectedOption}&approval_status=${approvalStatus}&department=${data.departmentId}`;
            break;
          case 7:
            approvalStatus = 2;
            trackerApproval = 1;
            if (selectedOption === "2") {
              url = `${apiBaseUrl}/api/ce/in/InternTrackerApprovals?approval_status=${trackerApproval}`;
            } else {
              url = `${apiBaseUrl}/api/ce/in/ApprovedInternship?type=${selectedOption}&approval_status=${approvalStatus}`;
            }
            break;
          case 8:
            approvalStatus = 3;
            url = `${apiBaseUrl}/api/ce/in/ApprovedInternship?type=${selectedOption}&approval_status=${approvalStatus}`;
            break;
          case 4:
            approvalStatus = 4;
            url = `${apiBaseUrl}/api/ce/in/ApprovedInternship?type=${selectedOption}&approval_status=${approvalStatus}`;
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
          console.log("Faculty Approvals:", approvalData);
        } else {
          console.error("Failed to fetch faculty approvals");
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

  const fetchLoginDetails = async () => {
    try {
      const response = await axios.get(`${apiLoginHost}/api/user-data`, {
        withCredentials: true,
      });
      const data = response.data;
      setName(data.name);
      setDepartment(data.departmentId);
      setUserId(data.user_id);
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
    fetchLoginDetails();
    fetchApprovalMembers();
    fetchUserData(selectedOption);
  }, []);

  const fetchApprovalMembers = async () => {
    try {
      const response1 = await axios.get(
        `${apiBaseUrl}/api/ce/in/InternApprovalMembers`,
        { withCredentials: true }
      );
      const jsonData1 = response1.data;
      const members = jsonData1.map((item) => item.member);
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

  const handleRevoke = async (userId, id, student, certificate) => {
    try {
      let tracker = 0;
      if(certificate === null || certificate === undefined){
        tracker =  1;
      }
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/in/RevokingIntern`,
        { userId, id, student, tracker },
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
      field: "company_name",
      headerName: "Industry Details",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box>{params.value + "-" + params.row.company_address}</Box>
      ),
      width: 200,
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
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => <Box>{params.value + " Days"}</Box>,
    },
    {
      field: "mode",
      headerName: "Mode",
      headerClassName: "super-app-theme--header",
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
      field: "stipend",
      headerName: "Stipend",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Box>
          {params.value === "Yes" ? (
            <div style={{ display: "flex" }}>
              <CurrencyRupeeIcon sx={{ height: "18px" }} />
              {params.row.amount}
            </div>
          ) : (
            "NULL"
          )}
        </Box>
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
          href={`${apiBaseUrl}/api/ce/in/InternApply/pdfs/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Certificate
        </a>
      ),
    },
    {
      field: "report_path",
      headerName: "Report",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <a
          style={{ color: "black" }}
          href={`${apiBaseUrl}/api/ce/in/InternApply/pdfs/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Report
        </a>
      ),
    },
    {
      field: "elective",
      headerName: "Elective",
      headerClassName: "super-app-theme--header",
      width: 90,
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
                onClick={() =>
                  handleRevoke(
                    userId,
                    params.row.id,
                    params.row.register_number,
                    params.row.certificate_path
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

  const trackers_column = [
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
      field: "company_name",
      headerName: "Industry Details",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box>{params.value + "-" + params.row.company_address}</Box>
      ),
      width: 200,
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
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => <Box>{params.value + " Days"}</Box>,
    },
    {
      field: "mode",
      headerName: "Mode",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "start_date",
      headerName: "Start Date",
      headerClassName: "super-app-theme--header",
      width: 110,
    },
    {
      field: "end_date",
      headerName: "End Date",
      headerClassName: "super-app-theme--header",
      width: 110,
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
              (params.row.certificate_path === null || params.row.certificate_path === undefined) ? false : true
            }
          >
            <div>
              <LoopIcon
                onClick={() =>
                  handleRevoke(
                    userId,
                    params.row.id,
                    params.row.register_number,
                    params.row.certificate_path
                  )
                }
              />
            </div>
          </button>
          <div className="notify">
            {!(params.row.certificate_path === null || params.row.certificate_path === undefined) ? (
              <CircleNotificationsIcon onClick={() => setNotifyTrackerOpen(true)} />
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  const customLocaleText = {
    noRowsLabel: `No Students Have Approved for ${
      selectedOption === "1"
        ? "Course Exemption"
        : selectedOption === "2"
        ? "Trackers"
        : selectedOption === "0"
        ? "Rewards"
        : null
    } `,
  };

  return (
    <>
      <div className="tableDefault">
        <div className="titFac">
          <div className="ti">
            <h4 style={{ marginRight: "5px" }}>InternShip</h4>{" "}
            <p> / Approved Applications</p>
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
              {userId === 7 && (
                <MenuItem onClick={handleTrackerClick}>Trackers</MenuItem>
              )}
            </Menu>
          </div>
        </div>
        <div>
          <div className="titl">
            <div>
              {selectedOption == "1"
                ? "Course Exemption"
                : selectedOption == "0"
                ? "Rewards"
                : selectedOption == "2"
                ? "Internship Trackers"
                : null}
            </div>
          </div>
        </div>
        {selectedOption === "1" || selectedOption === "0" ? (
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
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="hometable">
              <div className="tableMain">
                <div className="datagrid">
                  <DataGrid
                    className="dat"
                    autoHeight
                    rows={data}
                    columns={trackers_column}
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
              </div>
            </div>
          </div>
        )}
        {selectedRowData && (
          <InternBasicModal
            open={true} // Always keep the modal open when there's selectedRowData
            handleClose={() => setSelectedRowData(null)}
            rowData={selectedRowData}
            fetchUserData={fetchUserData}
            approvalMembers={approvalMembers}
          />
        )}
        <Modal
        open={notifyTrackerOpen}
        onClose={()=>setNotifyTrackerOpen(false)}
        >
          <Box sx={style}>
                  <div className="NotifyModal">
                    <div>
                      <WarningIcon
                        className="warningIcon"
                        style={{ color: "rgb(250, 41, 41)" }}
                      />
                    </div>
                    <div>
                      This Tracker is Applied by the Student so you cannot revoke it..
                    </div>
                  </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default ApprovedStudents;
