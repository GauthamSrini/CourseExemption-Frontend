import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "../styles/creditHome.css";
import { apiBaseUrl } from "../../../api/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import WarningIcon from "@mui/icons-material/Warning";
import Modal from "@mui/material/Modal";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Select from "react-select";
import StepperWithContent from "../stuffs/StepperWithContent";
import { useMediaQuery } from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "400px", // Maximum width for smaller screens
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 4,
};

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%", // Adjusted width for larger screens
  maxWidth: "420px", // Maximum width for smaller screens
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 4,
};

const style3 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "300px", // Maximum width for smaller screens
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 4,
};

const CreditHome = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState("7376222AD156");
  const [email, setEmail] = useState("gauthamsrinivasan21@gmail.com");
  const [showModal, setShowModal] = useState(false);
  const [resModal, setResModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [remark, setRemark] = useState("");
  const [expModal, setExpModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [expData, setExpData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(0);
  const [reasonModal, setReasonModal] = useState(false);
  const [rejectionStatus, setRejectionStatus] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [electiveId, setElectiveId] = useState(null);
  const [electiveData, setElectiveData] = useState([]);
  const [electiveName, setElectiveName] = useState(null);
  const [nptelActive, setNptelActive] = useState(null);
  const [onecreditActive, setOneCreditActive] = useState(null);
  const [totalActive, setTotalActive] = useState(null);
  const [revokeNotify, setRevokeNotify] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width: 1600px)");

  // purposely declared inside funcntion as it uses issuccss state
  const style2 = {
    position: "absolute",
    top: "5%",
    left: "50%",
    bottom: "90%",
    transform: "translate(-50%, -50%)",
    width: 280,
    bgcolor: "background.paper",
    boxShadow: !error ? "green 0px 3px 2px" : "rgb(250, 41, 41) 0px 3px 2px",
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

  // fetching all the needed stuffs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/ce/oc/OneCreditApprovalMembers`,
          { withCredentials: true }
        );
        const jsonData = response.data;
        const members = jsonData.map((item) => item.members);
        members.push("Approved");
        setMembersData(members);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.log(
            "Error while fetching ApprovalMembers",
            error.reposne,
            error,
            error.response.status
          );
        }
      }
    };
    const fetchElective = async () => {
      try {
        const type2 = await axios.get(
          `${apiBaseUrl}/api/ce/AvailableElectives?student=${student}`,
          { withCredentials: true }
        );
        setElectiveData(type2.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.log("Error while fetching Electives", error);
        }
      }
    };
    const fetchActiveApplications = async () => {
      try {
        const active = await axios.get(
          `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
          { withCredentials: true }
        );
        const jsonData = active.data;
        setNptelActive(jsonData.nptel);
        setOneCreditActive(jsonData.oneCredit);
        setTotalActive(jsonData.total);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.log("Error while fetching active applications", error);
        }
      }
    };
    fetchData();
    fetchElective();
    fetchActiveApplications();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Id",
      headerClassName: "super-app-theme--header",
      width: 100,
    },
    {
      field: "name",
      headerName: "Course Name",
      headerClassName: "super-app-theme--header",
      width: 350,
    },
    {
      field: "course_code",
      headerName: "Course Code",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
    {
      field: "academic_year",
      headerName: "Academic Year",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
    {
      field: "semester",
      headerName: "Semester",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
  ];
  const customLocaleText = {
    noRowsLabel: "You have not yet completed any One credit", // Change this to your desired text
  };

  // Main function to fetch all the completed oenCredit courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/ce/oc/completedCourses?student_id=${student}`,
          { withCredentials: true }
        );
        const jsonData = response.data;
        const orderedData = jsonData.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setData(orderedData);
        // if(jsonData.length>=3){
        //   // sendReminderEmail();
        // }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.log(
            "Error while fetching completed Courses",
            error.reposne,
            error,
            error.response.status
          );
        }
      }
    };
    fetchData();
  }, []);

  // Main function to fetch the applied Applications
  useEffect(() => {
    const fetchExp = async () => {
      try {
        const resp = await axios.get(
          `${apiBaseUrl}/api/ce/oc/oneCreditExp?student_id=${student}`,
          { withCredentials: true }
        );
        const Data = resp.data;
        setExpData(Data);
        if (Data.length != 0) {
          setApplied(true);
        }
        setC1(Data[0].course_id_1_name);
        setC2(Data[0].course_id_2_name);
        setC3(Data[0].course_id_3_name);
        setElectiveName(Data[0].elective);
        setApprovalStatus(Data[0].approval_status);
        setRejectionStatus(Data[0].rejected_by);
        if (Data[0].approval_status === -1) {
          setRejection(true);
          setRemark(Data[0].remarks);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.log("Error :", error);
        }
      }
    };
    fetchExp();
  }, []);

  // Function to apply one Credit For Exemption
  const handleApply = async () => {
    const activeApplicationsResponse = await axios.get(
      `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
      { withCredentials: true }
    );
    const { total, oneCredit } = activeApplicationsResponse.data;

    if (total >= 4 || oneCredit === 1) {
      alert("You have reached the maximum number of applications allowed.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/StoringExcemption`,
        {
          studentId: student,
          selectedCourses: selectedCourses,
          electiveId: electiveId,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowModal(false);
        setResModal(true);
        setResponseMessage("Course exemption applied successfully");
        console.log("Course exemption applied successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error applying course exemption:", error);
        setShowModal(false);
        setResModal(true);
        setError(1);
        setResponseMessage("Failed to apply course exemption");
        throw new Error("Failed to apply course exemption");
      }
    }
  };

  // setting up the dropdown options
  const ElectiveList = electiveData.map((types) => ({
    value: types.id,
    label: types.elective,
  }));

  let namelist = data.map((name) => ({
    value: name.course_code,
    label: name.name,
  }));

  // list of other handling functions and the validating Functions and modal closing functions
  const handleSelectChange = (selectedOptions) => {
    const selectedLabels = selectedOptions.map((option) => option.value);
    setSelectedCourses(selectedLabels);
  };

  const isOptionDisabled = (option) => {
    return (
      selectedCourses.length >= 3 &&
      !selectedCourses.find((course) => course.value === option.value)
    );
  };

  const handleResModalClose = () => {
    setResModal(false);
    navigate("/courseExcp");
  };

  const validateButton = () => {
    if (selectedCourses.length == 3 && electiveId) {
      return true;
    } else {
      return false;
    }
  };

  const handleNotification = () => {
    setReasonModal(true);
  };

  const handleElective = (selectedOption) => {
    setElectiveId(selectedOption.value);
  };

  const handleCloseApplyModal = () => {
    setElectiveId(null);
    setSelectedCourses([]);
    setShowModal(false);
  };

  return (
    <div className="creditHomeMain">
      <div className="titleBtn">
        <div className="titlehm">
          <h4>Completed Courses</h4>
        </div>
        <div className="createDiv">
          {applied ? (
            <button
              className="CourseBtnActive"
              onClick={() => setExpModal(true)}
            >
              View Applied Exemption
            </button>
          ) : (
            <div className="expBtnsReasons">
              <div>
                <button
                  className={
                    data.length >= 3 && totalActive < 4
                      ? "CourseBtnActive"
                      : "CourseBtn"
                  }
                  onClick={() => setShowModal(true)}
                  disabled={data.length >= 3 && totalActive < 4 ? false : true}
                >
                  Course Exemption
                </button>
              </div>
              {data.length < 3 || totalActive >= 4 ? (
                <div className="btnReason" onClick={handleNotification}>
                  <CircleNotificationsIcon />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      <div className="hometable">
        <div className="tableMain">
          <div className="datagrid">
            <DataGrid
              autoHeight
              rows={data}
              columns={columns}
              localeText={customLocaleText}
              sx={{
                width: "80%", // Set width to 80%
                overflowX: "auto",
                display: "flex",
                justifyContent: "space-between",
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
            />
          </div>
        </div>
      </div>

      {/* Modal for Applying One Credit */}
      <Modal open={showModal} onClose={handleCloseApplyModal}>
        <Box sx={style1}>
          <div>
            <div className="onecreditSelection">
              <div className="CourseTit">
                Apply Exemption
              </div>
              <hr style={{marginBottom:"20px",marginTop:"15px"}}/>
              <div className="quesField">
                <div className="inp">Select Courses</div>
                <div>
                  <Select
                    className="oncreditField"
                    isMulti
                    options={namelist}
                    placeholder=""
                    onChange={handleSelectChange}
                    isOptionDisabled={isOptionDisabled} // Disable options when max selections reached
                  />
                  { selectedCourses.length < 3 &&
                  <p style={{color:'red'}}>select 3 courses</p>
                  }
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Elective</div>
                <div>
                  <Select
                    className="oncreditField"
                    onChange={handleElective}
                    options={ElectiveList}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div className="modalbtns">
              <div>
                <button
                  className="btncancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
              {validateButton() ? (
                <div>
                  <button className="btnapply" onClick={handleApply}>
                    Apply
                  </button>
                </div>
              ) : (
                <div>
                  <button className="CourseBtn" disabled={true}>
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>

      {/* Modal for displaying Applied One Credit */}
      <Modal open={expModal} onClose={() => setExpModal(false)}>
        <Box sx={style}>
          <div className="modal">
            <div
              className="CourseTit"
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              Courses Applied{" "}
              {rejection && (
                <div
                  className="btnReason"
                  onClick={() => setRevokeNotify(true)}
                >
                  <CircleNotificationsIcon />
                </div>
              )}
            </div>
            <hr style={{ marginLeft: "10px", marginRight: "10px" }} />
            <div className="oneCreditModal">
              <div className="field">
                <div className="fldClm">Course 1 </div>{" "}
                <div className="fldData">{c1}</div>
              </div>
              <div className="field">
                <div className="fldClm">Course 2 </div>{" "}
                <div className="fldData">{c2}</div>
              </div>
              <div className="field">
                <div className="fldClm">Course 3 </div>{" "}
                <div className="fldData">{c3}</div>
              </div>
              <div className="field">
                <div className="fldClm">Elective</div>{" "}
                <div className="fldData">{electiveName}</div>
              </div>
              {rejection && (
                <div className="field">
                  <div className="fldClm">Remarks </div>
                  <div className="fldData" style={{ color: "red" }}>
                    {remark}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: "10px", display: "flex" }}>
              {" "}
              <StepperWithContent
                status={approvalStatus}
                data={membersData}
                rejection={rejectionStatus}
              />{" "}
            </div>
          </div>
        </Box>
      </Modal>

      {/* Response Modal to tell as success or failure */}
      <Modal open={resModal} onClose={handleResModalClose}>
        <Box sx={style2} className="success">
          <div>{responseMessage}</div>
          <div className="tick">
            {error ? (
              <AnnouncementIcon style={{ color: "rgb(250, 41, 41)" }} />
            ) : (
              <CheckCircleIcon style={{ color: "green" }} />
            )}
          </div>
        </Box>
      </Modal>

      {/* Restricting Modal for Invalid Credentials */}
      <Modal open={reasonModal} onClose={() => setReasonModal(false)}>
        <Box sx={style3}>
          <div>
            {data.length < 3 && (
              <div className="restrictDiv">
                <div className="DelTit">
                  Warning{" "}
                  <WarningIcon
                    className="warningIcon"
                    style={{ color: "rgb(250, 41, 41)" }}
                  />
                </div>
                <hr style={{ marginBottom: "10px" }} />
                <div>
                  Minimum 3 courses should be completed for applying course
                  Exemption
                </div>
              </div>
            )}
            {totalActive == 4 && onecreditActive < 1 && (
              <div className="restrictDiv">
                <div className="DelTit">
                  Warning{" "}
                  <WarningIcon
                    className="warningIcon"
                    style={{ color: "rgb(250, 41, 41)" }}
                  />
                </div>
                <hr style={{ marginBottom: "10px" }} />
                <div>
                  You have Sufficient Application Applied Wait For the Approval
                  Status of All other courses untill you can not Apply
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* alerting Modal */}
      <Modal open={revokeNotify} onClose={() => setRevokeNotify(false)}>
        <Box sx={style3}>
          <div className="restrictDiv">
            <div className="DelTit">
              Alert{" "}
              <WarningIcon
                className="warningIcon"
                style={{ color: "rgb(250, 41, 41)" }}
              />
            </div>
            <hr style={{ marginBottom: "10px" }} />
            <div>
              Consult the Respective Faculty For Exact Reason And revoking
              Process
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreditHome;
