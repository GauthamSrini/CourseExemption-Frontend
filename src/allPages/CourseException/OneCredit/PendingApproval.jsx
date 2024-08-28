import React, { useEffect, useState } from "react";
import "../styles/courseApproval.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { apiBaseUrl } from "../../../api/api";
import apiLoginHost from "../../login/LoginApi";
import axios from "axios";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import OneCreditFacultyModal from "../stuffs/OneCreditFacultyModal";

const PendingApproval = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [name, setName] = useState(""); // login details if needed can be used
  const [department, setDepartment] = useState(null);
  const [userId, setUserId] = useState(null);

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

  // Main function to fetch the pending courses
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

        let approvalStatus;
        let url;
        switch (data.user_id) {
          case 2:
            approvalStatus = 0;
            url = `${apiBaseUrl}/api/ce/oneCredit/PendingOneCredit?&approval_status=${approvalStatus}`;
            break;
          case 3:
            approvalStatus = 1;
            url = `${apiBaseUrl}/api/ce/oneCredit/PendingOneCredit?&approval_status=${approvalStatus}`;
            break;
          case 4:
            approvalStatus = 2;
            url = `${apiBaseUrl}/api/ce/oneCredit/PendingOneCredit?&approval_status=${approvalStatus}`;
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
          console.log("one credit pending", approvalData);
        } else {
          console.error("Failed to fetch pending one credit Applications");
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
  ];
  const customLocaleText = {
    noRowsLabel: `No Applications Available for Exemption`,
  };

  return (
    <div className="tableDefault">
      <div className="titFac">
        <div className="ti">
          <h4 style={{ marginRight: "5px" }}>One Credit</h4>{" "}
          <p>/ Pending Applications</p>
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

            {/* modal for viewing and making decision as approve or reject the application */}
            {selectedRowData && (
              <OneCreditFacultyModal
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
  );
};

export default PendingApproval;
