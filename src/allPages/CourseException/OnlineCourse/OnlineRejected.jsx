import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "../styles/courseApproval.css";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { apiBaseUrl } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import apiLoginHost from "../../login/LoginApi";
import Menu from "@mui/material/Menu";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import BasicModal from "../stuffs/BasicModal";

const OnlineRejected = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("1");
  const [data, setData] = useState([]);
  const [name, setName] = useState(""); // login Details can be used if needed
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [approvalMembers, setApprovalMembers] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null); // use state for handling the filter menu
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

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

  // Main function to fetch the Rejected courses
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
            rejected_by = 1;
            url = `${apiBaseUrl}/api/ce/oc/RejectedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}&department=${data.departmentId}`;
            break;
          case 6:
            approvalStatus = -1;
            rejected_by = 2;
            url = `${apiBaseUrl}/api/ce/oc/RejectedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}`;
            break;
          case 4:
            approvalStatus = -1;
            rejected_by = 3;
            url = `${apiBaseUrl}/api/ce/oc/RejectedOnlineCourse?type=${selectedOption}&approval_status=${approvalStatus}&rejected_by=${rejected_by}`;
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
          console.log("Faculty Rejected Data: ", approvalData);
        } else {
          console.error("Failed to fetch Rejected Applications");
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

  let dynamicFlex = isSmallScreen ? null : 1;
  const columns = [
    {
      field: "student_name",
      headerName: "Student",
      headerClassName: "super-app-theme--header",
      flex:dynamicFlex
    },
    {
      field: "register_number",
      headerName: "Register Number",
      headerClassName: "super-app-theme--header",
      flex:dynamicFlex
    },
    {
      field: "branch",
      headerName: "Department",
      headerClassName: "super-app-theme--header",
      flex:dynamicFlex
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
      flex:dynamicFlex
    },
    {
      field: "elective1",
      headerName: "Elective 1",
      headerClassName: "super-app-theme--header",
      width: 90,
      renderCell: (params) => (
        <Box>
          {params.row.elective1 === undefined || params.row.elective1 === null ? (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
              }}
            >
              NULL
            </p>
          ) : (
            params.value
          )}
        </Box>
      ),
      flex:dynamicFlex
    },
    {
      field: "elective2",
      headerName: "Elective 2",
      headerClassName: "super-app-theme--header",
      width: 90,
      renderCell: (params) => (
        <Box>
          {params.row.elective2 === undefined || params.row.elective2 === null ? (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
              }}
            >
              NULL
            </p>
          ) : (
            params.value
          )}
        </Box>
      ),
      flex:dynamicFlex
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
      flex:dynamicFlex
    },
  ];

  const customLocaleText = {
    noRowsLabel: `No Applications for ${
      selectedOption == 1 ? "Course Exemption" : "Rewards"
    } `,
  };

  return (
    <>
      <div className="tableDefault">
        <div className="titFac">
          <div className="ti">
            <h4 style={{ marginRight: "5px" }}>Online Course </h4>{" "}
            <p>/ Rejected Applications</p>
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

              {/* Modal for Displaying Details */}
              {selectedRowData && (
                <BasicModal
                  faculty={true}
                  reviewed={true}
                  open={true} // Always keep the modal open when there's selectedRowData
                  handleClose={() => setSelectedRowData(null)}
                  rowData={selectedRowData}
                  approvalMembers={approvalMembers}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineRejected;
