import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Modal from "@mui/material/Modal";
import { apiBaseUrl } from "../../../api/api";
import apiLoginHost from "../../login/LoginApi";
import "../styles/Facultymodal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "430px", // Maximum width for smaller screens
  maxHeight: "80%",
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

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 210,
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  borderRadius: "10px",
  p: 4,
};

const style3 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "290px", // Maximum width for smaller screens
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  borderRadius: "10px",
  p: 4,
};

const FacultyModal = ({ rowData, open, handleClose, fetchUserData }) => {
  const navigate = useNavigate();
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [remarkResponse, setRemarkResponse] = useState(false);
  const [remark, setRemark] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [remarkResponseMsg, setRemarkResponseMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [certificatePath1, setCertificatePath1] = useState("");
  const [certificatePath2, setCertificatePath2] = useState("");
  const [certificatePath3, setCertificatePath3] = useState("");
  const [markSheetPath, setMarkSheetPath] = useState("");
  const [step, setStep] = useState(1);
  const [numberOfCourses, setNumberOfCourses] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // logout function
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

  // getting up the login details and setting up the needed stuffs
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiLoginHost}/api/user-data`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user_id);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    setCertificatePath1(rowData.certificate_path1);
    setCertificatePath2(rowData.certificate_path2);
    setCertificatePath3(rowData.certificate_path3);
    setMarkSheetPath(rowData.mark_sheet_path);
    setSelectedOption(rowData.type);
    if((rowData.course_code2)!=null){
      const val = numberOfCourses+1;
      console.log(val);
      setNumberOfCourses(val)
    }
    if(((rowData.course_code2)!=null)&&((rowData.course_code3)!=null))
    {
      const val = numberOfCourses+2;
      console.log(val);
      setNumberOfCourses(val)
    }
  }, []);

  // Main function to Approve the student
  const handleApprove = () => {
    axios
      .post(
        `${apiBaseUrl}/api/ce/oc/toApprove`,
        { id: rowData.id, student: rowData.register_number, user_id: userId },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Student approved successfully");
        setResponseMessage("Student approved successfully");
        setIsSuccess(true);
        setResponseModalOpen(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error approving student:", error.message);
          setResponseMessage("Error approving student: " + error.message);
          setIsSuccess(false);
          setResponseModalOpen(true);
        }
      });
  };

  // list of functions to handle the closing of all the modals
  const handleConfirmation = () => {
    setConfirmModal(true);
  };

  const handleReject = () => {
    setRemarkModalOpen(true);
  };

  const handleRemarkClose = () => {
    setRemarkModalOpen(false);
  };

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
    setConfirmModal(false);
    handleClose();
    fetchUserData(selectedOption);
  };

  const setRemarkResponseClose = () => {
    setRemarkResponse(false);
    setRemarkModalOpen(false);
    handleClose();
    fetchUserData(selectedOption);
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  // Main function to handle the rejection of the Application
  const handleRemarkSubmit = () => {
    axios
      .post(
        `${apiBaseUrl}/api/ce/oc/toReject`,
        { remark, id: rowData.id, user_id: userId },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Remark submitted successfully");
        setRemarkResponseMsg("Remark Submitted SuccessFully");
        setIsSuccess(true);
        setRemarkResponse(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error submitting remark:", error.message);
          setRemarkResponseMsg("Failed to Update Remarks");
          setIsSuccess(false);
          setRemarkResponse(true);
        }
      });
  };

  //Function for Handling PDF view
  const handleView = (certificatePath) => {
    const pdfURL = `${apiBaseUrl}/api/ce/oc/onlineApply/pdfs/${certificatePath}`;
    window.open(pdfURL, "_blank");
  };
  
  // Function to increase the step of the displaying multiple courses if available
  const handleStepIncrease = () => {
    const ins = step + 1;
    setStep(ins);
  };

  // Function to Decrease the step of the displaying multiple courses if available
  const handleStepDecrease = () => {
    const des = step - 1;
    setStep(des);
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div>
            <div className="modal">
              <div className="CourseTit">Course Details</div>
              <hr />
              <div className="field">
                <div className="fldClm">Student</div>
                <div className="fldData">{rowData.student_name}</div>
              </div>
              <div className="field">
                <div className="fldClm">Register Number</div>
                <div className="fldData">{rowData.register_number}</div>
              </div>
              <div className="field">
                <div className="fldClm">Department</div>
                <div className="fldData">{rowData.branch}</div>
              </div>
              <div className="field">
                <div className="fldClm">Year</div>
                <div className="fldData">
                  {rowData.year === 1
                    ? "1st Year"
                    : rowData.year === 2
                    ? "2nd year"
                    : rowData.year === 3
                    ? "3rd Year"
                    : "4th Year "}
                </div>
              </div>
              <hr />
              { numberOfCourses!=1 &&
            <div className="SubtileWithstepButtons">
              {" "}
              <div>
              {step > 1 ? (
                <button
                  className="MultiFormBackBUtton"
                  onClick={handleStepDecrease}
                  style={{paddingLeft:"0px"}}
                >
                  previous
                </button>
              ) : (
                <button
                  className="MultiFormBackBUtton"
                  onClick={handleStepDecrease}
                  style={{paddingLeft:"0px"}}
                  disabled={true}
                >
                  previous
                </button>
              )}
              </div>{" "}
              <div className="coursesubtit">{step===1?"Course 1":step===2?"Course 2":((numberOfCourses===2)&&(step===3))?
              "Elective Details":((numberOfCourses===3)&&(step===3))?"Course 3":"Elective Details"}</div>{" "}
              <div>
                {
                  ((numberOfCourses === 2)&&(step < 3))?
                  <div><button  className="MultiFormNextButton"
                  onClick={handleStepIncrease} >Next</button></div>:
                  ((numberOfCourses === 3)&&(step < 4))?
                  <div><button   className="MultiFormNextButton"
                  onClick={handleStepIncrease} >Next</button></div>:
                  <div><button className="MultiFormBackBUtton"
                  disabled={true}>Next</button></div>
                }
              </div>{" "}
            </div>}
            
              <div className="field">
                <div className="fldClm">Course Type</div>
                <div className="fldData">{rowData.platform_name}</div>
              </div>
              <div className="field">
                <div className="fldClm">Course Code</div>
                <div className="fldData">{rowData.course_code}</div>
              </div>
              <div className="field">
                <div className="fldClm">Course Name</div>
                <div className="fldData">{rowData.course_name}</div>
              </div>
              <div className="field">
                <div className="fldClm">Duration</div>
                <div className="fldData">
                  {rowData.duration === 12
                    ? "12 weeks"
                    : rowData.duration === 4
                    ? "4 weeks"
                    : "8 Weeks"}
                </div>
              </div>
              <div className="field">
                <div className="fldClm">Credits</div>
                <div className="fldData">
                  {rowData.credit === 1
                    ? "1 credit"
                    : rowData.credit === 2
                    ? "2 credits"
                    : "3 credits"}
                </div>
              </div>
              <div className="field">
                <div className="fldClm">Academic Year</div>
                <div className="fldData">{rowData.academic_year}</div>
              </div>
              <div className="field">
                <div className="fldClm">Semester</div>
                <div className="fldData">{rowData.semester}</div>
              </div>
              <div className="field">
                <div className="fldClm">Start Date</div>
                <div className="fldData">{rowData.start_date}</div>
              </div>
              <div className="field">
                <div className="fldClm">End Date</div>
                <div className="fldData">{rowData.end_date}</div>
              </div>
              <div className="field">
                <div className="fldClm">Exam Date</div>
                <div className="fldData">{rowData.exam_date}</div>
              </div>
              <div className="field">
                <div className="fldClm">Marks</div>
                <div className="fldData">{rowData.mark}</div>
              </div>
              {rowData.type_name && (
                <div className="field">
                  <div className="fldClm">Certificate Type</div>
                  <div className="fldData">{rowData.type_name}</div>
                </div>
              )}
              <div className="field">
                <div className="fldClm">Certificate Url</div>
                <div className="fldData">
                  <a style={{ color: "black" }} href={rowData.certificate_url}>
                    {rowData.certificate_url}
                  </a>
                </div>
              </div>
              <div className="field">
                <div className="fldClm">Certificate</div>
                <div className="pdficon" onClick={()=>handleView(certificatePath1)}>
                  <InsertDriveFileIcon />
                  <div>View</div>
                </div>
              </div>
              {rowData.elective && (
                <div className="field">
                  <div className="fldClm">Elective</div>
                  <div className="fldData">{rowData.elective}</div>
                </div>
              )}
              <div className="fieldbtn">
                <div>
                  <button className="btnApprove" onClick={handleConfirmation}>
                    Approve
                  </button>
                </div>
                <div>
                  <button className="btnRemove" onClick={handleReject}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Remark Modal */}
      <Modal open={remarkModalOpen} onClose={handleRemarkClose}>
        <Box sx={style3}>
          <div>
            <div className="rm">Remarks</div>
            <textarea
              id="remark-modal-description"
              value={remark}
              className="remarkArea"
              onChange={handleRemarkChange}
              rows={3}
              cols={38}
              placeholder="Enter your remark here..."
            ></textarea>
            {remark === "" ? (
              <button className="CourseBtn" disabled={true}>
                Submit Remark
              </button>
            ) : (
              <button className="btnApprove" onClick={handleRemarkSubmit}>
                Submit Remark
              </button>
            )}
          </div>
        </Box>
      </Modal>

      {/* Response Modal */}
      <Modal
        open={responseModalOpen}
        onClose={handleResponseModalClose}
        style={{ zIndex: 6000 }}
      >
        <Box sx={style1} className="success">
          <div>{responseMessage}</div>
          <div className="tick">
            {isSuccess ? (
              <CheckCircleIcon style={{ color: "green" }} />
            ) : (
              <AnnouncementIcon style={{ color: "rgb(250, 41, 41)" }} />
            )}
          </div>
        </Box>
      </Modal>

      {/* Remark submit modal */}
      <Modal
        open={remarkResponse}
        onClose={setRemarkResponseClose}
        style={{ zIndex: 6000 }}
      >
        <Box sx={style1} className="success">
          <div>{remarkResponseMsg}</div>
          <div className="tick">
            {isSuccess ? (
              <CheckCircleIcon style={{ color: "green" }} />
            ) : (
              <AnnouncementIcon style={{ color: "rgb(250, 41, 41)" }} />
            )}
          </div>
        </Box>
      </Modal>

      {/*Confirmation Modal */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)}>
        <Box sx={style2}>
          <div>
            <div>Are you Sure want to approve this Application</div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div>
                <button className="conformBtnApprove" onClick={handleApprove}>
                  Approve
                </button>
              </div>
              <div>
                <button
                  className="conformBtnRemove"
                  onClick={() => setConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FacultyModal;
