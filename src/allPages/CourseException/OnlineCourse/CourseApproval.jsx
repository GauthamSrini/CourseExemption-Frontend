import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FacultyModal from "../stuffs/FacultyModal";
import "../styles/courseApproval.css";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../../../api/api";
import apiLoginHost from "../../login/LoginApi";
import Menu from "@mui/material/Menu";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const CourseApproval = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("1"); //selected filter option as exemption or rewards
  const [name, setName] = useState(""); // login details can be used if needed
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null); // use state for handling the filter menu
  const open = Boolean(anchorEl);

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

  // Main function to fetch the pending courses
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
        switch (data.user_id) {
          case 5:
            approvalStatus = 0;
            url = `${apiBaseUrl}/api/ce/oc/facultyApprovals?type=${selectedOption}&approval_status=${approvalStatus}&department=${data.departmentId}`;
            break;
          case 6:
            approvalStatus = 1;
            url = `${apiBaseUrl}/api/ce/oc/facultyApprovals?type=${selectedOption}&approval_status=${approvalStatus}`;
            break;
          case 4:
            approvalStatus = 2;
            url = `${apiBaseUrl}/api/ce/oc/facultyApprovals?type=${selectedOption}&approval_status=${approvalStatus}`;
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
          console.log("Pending Online Course Applications", approvalData);
        } else {
          console.error("Failed to fetch Pending Applications");
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
      renderCell: (params) => (
        <Box
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedRowData(params.row)}
        >
          <RemoveRedEyeOutlinedIcon />
        </Box>
      ),
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
            <p>/ Pending Applications</p>
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

              {/* modal for viewing and making decision as approve or reject the application */}
              {selectedRowData && (
                <FacultyModal
                  open={true} // Always keep the modal open when there's selectedRowData
                  handleClose={() => setSelectedRowData(null)}
                  rowData={selectedRowData}
                  fetchUserData={fetchUserData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseApproval;
