import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "../styles/Facultymodal.css";
import { apiBaseUrl } from "../../../api/api";
import apiLoginHost from "../../login/LoginApi";
import { useEffect, useState } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Collapse from "@mui/material/Collapse";
import StepperWithContent from "./StepperWithContent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "450px", // Maximum width for smaller screens
  maxHeight: "85%",
  bgcolor: "var(--background)",
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

const BasicModal = ({
  reviewed,
  rowData,
  open,
  handleClose,
  faculty,
  approvalMembers,
  fetchApplications
}) => {
  const [appliedFor, setAppliedFor] = useState("");
  const [remOpen, setremOpen] = useState(false);
  const [certificatePath1, setCertificatePath1] = useState("");
  const [certificatePath2, setCertificatePath2] = useState("");
  const [certificatePath3, setCertificatePath3] = useState("");
  const [userId, setUserId] = useState(null);
  const [remarkResponse, setRemarkResponse] = useState(false);
  const [remark, setRemark] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [remarkResponseMsg, setRemarkResponseMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [markSheetPath, setMarkSheetPath] = useState("");
  const [approvalMem, setApprovalMem] = useState(approvalMembers);
  const [rejectionStatus, setRejectionStatus] = useState(null);
  const [step, setStep] = useState(1);
  const [numberOfCourses, setNumberOfCourses] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // setting up the needed stuffs
  useEffect(() => {
    if (rowData.approval_status === -1) {
      setremOpen(true);
      setRejectionStatus(rowData.rejected_by);
    }

    if (rowData.type == "1") {
      setAppliedFor("Excemption");
    } else {
      setAppliedFor("Rewards");
    }
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
    fetchUserData()
  }, []);

  /// function to fetch the login details as name usedId and other stuf
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

   // list of functions to handle the closing of all the modals
   const handleConfirmation = () => {
    setConfirmModal(true);
  };

  const handleReject = () => {
    setRemarkModalOpen(true);
  };

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
    setConfirmModal(false);
    handleClose();
    fetchApplications(selectedOption);
  };

  const setRemarkResponseClose = () => {
    setRemarkResponse(false);
    setRemarkModalOpen(false);
    handleClose();
    fetchApplications(selectedOption);
  };

  const handleRemarkClose = () => {
    setRemarkModalOpen(false);
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };


  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} >
          <div>
            <div className="CourseTit">Course Details</div>
            <hr style={{ color: "var(--Bordercolor)",marginTop:"10px"}} />
            {/* Conditional rendering for only faculty logins */}
            {faculty && (
              <>
                <div className="collapseDiv" style={{marginTop:"17px"}}>
                <div className="field">
                  <div className="fldClm">Student</div>
                  <div className="fldData">{rowData.student_name}</div>
                </div>
                <div className="field">
                  <div className="fldClm">Register Number</div>
                  <div className="fldData">{rowData.register_number}</div>
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
                <div className="field">
                  <div className="fldClm">Department</div>
                  <div className="fldData">{rowData.branch}</div>
                </div>
                </div>
                <hr />
              </>
            )}
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
            <Collapse in={step==1} collapsedSize={0} >
            <div className="collapseDiv" style={{marginTop:numberOfCourses===1?"20px":null}} >
            <div className="field">
              <div className="fldClm">Course Type</div>
              <div className="fldData">{rowData.platform_name1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Code</div>
              <div className="fldData">{rowData.course_code1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Name</div>
              <div className="fldData"> {rowData.course_name1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Academic Year</div>
              <div className="fldData"> {rowData.academic_year1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Semester</div>
              <div className="fldData">{rowData.semester1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Duration</div>
              <div className="fldData">
                {rowData.duration1 === 12
                  ? "12 weeks"
                  : rowData.duration1 === 4
                  ? "4 weeks"
                  : "8 Weeks"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Credits</div>
              <div className="fldData">
                {rowData.credit1 === 1
                  ? "1 credit"
                  : rowData.credit1 === 2
                  ? "2 credits"
                  : "3 credits"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Start Date</div>
              <div className="fldData">{rowData.start_date_1}</div>
            </div>
            <div className="field">
              <div className="fldClm">End Date</div>
              <div className="fldData">{rowData.end_date_1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Exam Date</div>
              <div className="fldData">{rowData.exam_date_1}</div>
            </div>
            <div className="field">
              <div className="fldClm">Applied For</div>
              <div className="fldData">{appliedFor}</div>
            </div>
            <div className="field">
              <div className="fldClm">Certificate Url</div>
              <div className="fldData">
                <a
                  style={{ color: "black" }}
                  href={rowData.certificate_url1}
                  target="_blank"
                >
                  {rowData.certificate_url1}
                </a>
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Marks</div>
              <div className="fldData">{rowData.marks1}</div>
            </div>
            {rowData.certificate_type1 ? (
              <div className="field">
                <div className="fldClm">Certificate Type</div>
                <div className="fldData">{rowData.certificate_type1}</div>
              </div>
            ) : null}
            <div className="field">
              <div className="fldClm">Certificate</div>
              <div className="pdficon" onClick={()=>handleView(certificatePath1)}>
                <InsertDriveFileIcon />
                <div>View</div>
              </div>
            </div>
            {
              (numberOfCourses===1)&&(!reviewed)?
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
              </div>:null
            }
            </div>
            </Collapse>
            
            <Collapse in={step==2} collapsedSize={0} >
            <div className="collapseDiv">
            <div className="field">
              <div className="fldClm">Course Type</div>
              <div className="fldData">{rowData.platform_name2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Code</div>
              <div className="fldData">{rowData.course_code2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Name</div>
              <div className="fldData"> {rowData.course_name2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Academic Year</div>
              <div className="fldData"> {rowData.academic_year2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Semester</div>
              <div className="fldData">{rowData.semester2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Duration</div>
              <div className="fldData">
                {rowData.duration2 === 12
                  ? "12 weeks"
                  : rowData.duration2 === 4
                  ? "4 weeks"
                  : "8 Weeks"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Credits</div>
              <div className="fldData">
                {rowData.credit2 === 1
                  ? "1 credit"
                  : rowData.credit2 === 2
                  ? "2 credits"
                  : "3 credits"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Start Date</div>
              <div className="fldData">{rowData.start_date_2}</div>
            </div>
            <div className="field">
              <div className="fldClm">End Date</div>
              <div className="fldData">{rowData.end_date_2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Exam Date</div>
              <div className="fldData">{rowData.exam_date_2}</div>
            </div>
            <div className="field">
              <div className="fldClm">Applied For</div>
              <div className="fldData">{appliedFor}</div>
            </div>
            <div className="field">
              <div className="fldClm">Certificate Url</div>
              <div className="fldData">
                <a
                  style={{ color: "black" }}
                  href={rowData.certificate_url2}
                  target="_blank"
                >
                  {rowData.certificate_url2}
                </a>
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Marks</div>
              <div className="fldData">{rowData.marks2}</div>
            </div>
            {rowData.certificate_type2 ? (
              <div className="field">
                <div className="fldClm">Certificate Type</div>
                <div className="fldData">{rowData.certificate_type2}</div>
              </div>
            ) : null}
            <div className="field">
              <div className="fldClm">Certificate</div>
              <div className="pdficon" onClick={()=>handleView(certificatePath2)}>
                <InsertDriveFileIcon />
                <div>View</div>
              </div>
            </div>
            </div>
            </Collapse>
            <Collapse in={((numberOfCourses===3)&&(step===3))} collapsedSize={0} >
            <div className="collapseDiv">
            <div className="field">
              <div className="fldClm">Course Type</div>
              <div className="fldData">{rowData.platform_name3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Code</div>
              <div className="fldData">{rowData.course_code3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Course Name</div>
              <div className="fldData"> {rowData.course_name3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Academic Year</div>
              <div className="fldData"> {rowData.academic_year3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Semester</div>
              <div className="fldData">{rowData.semester3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Duration</div>
              <div className="fldData">
                {rowData.duration3 === 12
                  ? "12 weeks"
                  : rowData.duration3 === 4
                  ? "4 weeks"
                  : "8 Weeks"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Credits</div>
              <div className="fldData">
                {rowData.credit3 === 1
                  ? "1 credit"
                  : rowData.credit3 === 2
                  ? "2 credits"
                  : "3 credits"}
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Start Date</div>
              <div className="fldData">{rowData.start_date_3}</div>
            </div>
            <div className="field">
              <div className="fldClm">End Date</div>
              <div className="fldData">{rowData.end_date_3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Exam Date</div>
              <div className="fldData">{rowData.exam_date_3}</div>
            </div>
            <div className="field">
              <div className="fldClm">Applied For</div>
              <div className="fldData">{appliedFor}</div>
            </div>
            <div className="field">
              <div className="fldClm">Certificate Url</div>
              <div className="fldData">
                <a
                  style={{ color: "black" }}
                  href={rowData.certificate_url3}
                  target="_blank"
                >
                  {rowData.certificate_url3}
                </a>
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Marks</div>
              <div className="fldData">{rowData.marks3}</div>
            </div>
            {rowData.certificate_type3 ? (
              <div className="field">
                <div className="fldClm">Certificate Type</div>
                <div className="fldData">{rowData.certificate_type3}</div>
              </div>
            ) : null}
            <div className="field">
              <div className="fldClm">Certificate</div>
              <div className="pdficon" onClick={()=>handleView(certificatePath3)}>
                <InsertDriveFileIcon />
                <div>View</div>
              </div>
            </div>
            </div>
            </Collapse>
            <Collapse in={((numberOfCourses===2)&&(step==3))?true:((numberOfCourses===3)&&(step==4))?true:false} collapsedSize={0} >
            <div className="collapseDiv" >
              {rowData.elective1 ? (
              <div className="field">
                <div className="fldClm">{rowData.elective2 ? "Elective 1" : "Elective"}</div>
                <div className="fldData">{rowData.elective1}</div>
              </div>
            ) : null}
            {rowData.elective2 ? (
              <div className="field">
                <div className="fldClm">Elective 2</div>
                <div className="fldData">{rowData.elective2}</div>
              </div>
            ) : null}
            {rowData.type==="1"&&<div className="field">
              <div className="fldClm">Mark Sheet</div>
              <div className="pdficon" onClick={()=>handleView(markSheetPath)}>
                <InsertDriveFileIcon />
                <div>View</div>
              </div>
            </div>}
            {
              !reviewed && 
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
            }
            </div>
            </Collapse>
            {remOpen && (
              <>
              <hr style={{marginBottom:"10px"}} />
              <div className="collapseDiv" >
              <div className="field">
                <div className="fldClm">Remark</div>
                <div className="remar">{rowData.remarks}</div>
              </div>
              </div>
              </>
            )}
            { 
            reviewed &&
            <div style={{ marginTop: "10px " }}>
              {" "}
              <StepperWithContent
                status={rowData.approval_status}
                data={approvalMem}
                rejection={rejectionStatus}
              />{" "}
            </div>
            }
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

    </div>
  );
};

export default BasicModal;
