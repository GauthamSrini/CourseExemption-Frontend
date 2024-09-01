import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "../styles/Facultymodal.css";
import { apiBaseUrl } from "../../../api/api";
import { useEffect, useState } from "react";
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

const BasicModal = ({
  rowData,
  open,
  handleClose,
  faculty,
  approvalMembers,
}) => {
  const [appliedFor, setAppliedFor] = useState("");
  const [remOpen, setremOpen] = useState(false);
  const [certificatePath, setCertificatePath] = useState("");
  const [approvalMem, setApprovalMem] = useState(approvalMembers);
  const [rejectionStatus, setRejectionStatus] = useState(null);

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
    setCertificatePath(rowData.certificate_path);
  }, []);

  //Function for Handling PDF view
  const handleView = () => {
    const pdfURL = `${apiBaseUrl}/api/ce/oc/onlineApply/pdfs/${certificatePath}`;
    window.open(pdfURL, "_blank");
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="BasicModal">
          <div className="modal">
            <div className="CourseTit">Course Details</div>
            <hr style={{color:'var(--Bordercolor)'}}/>
            {/* Conditional rendering for only faculty logins */}
            {faculty && (
              <>
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
              </>
            )}
            {rowData.elective ? (
              <div className="field">
                <div className="fldClm">Elective</div>
                <div className="fldData">{rowData.elective}</div>
              </div>
            ) : null}
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
              <div className="fldData"> {rowData.course_name}</div>
            </div>
            <div className="field">
              <div className="fldClm">Academic Year</div>
              <div className="fldData"> {rowData.academic_year}</div>
            </div>
            <div className="field">
              <div className="fldClm">Semester</div>
              <div className="fldData">{rowData.semester}</div>
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
              <div className="fldClm">Applied For</div>
              <div className="fldData">{appliedFor}</div>
            </div>
            <div className="field">
              <div className="fldClm">Certificate Url</div>
              <div className="fldData">
                <a
                  style={{ color: "black" }}
                  href={rowData.certificate_url}
                  target="_blank"
                >
                  {rowData.certificate_url}
                </a>
              </div>
            </div>
            <div className="field">
              <div className="fldClm">Marks</div>
              <div className="fldData">{rowData.mark}</div>
            </div>
            {rowData.type_name ? (
              <div className="field">
                <div className="fldClm">Certificate Type</div>
                <div className="fldData">{rowData.type_name}</div>
              </div>
            ) : null}
            <div className="field">
              <div className="fldClm">Certificate</div>
              <div className="pdficon" onClick={handleView}>
                <InsertDriveFileIcon />
                <div>View</div>
              </div>
            </div>
            {rowData.elective ? (
              <div className="field">
                <div className="fldClm">Elective</div>
                <div className="fldData">{rowData.elective}</div>
              </div>
            ) : null}
            {remOpen && (
              <div className="field">
                <div className="fldClm">Remark</div>
                <div className="remar">{rowData.remarks}</div>
              </div>
            )}
            <div style={{ marginTop: "10px " }}>
              {" "}
              <StepperWithContent
                status={rowData.approval_status}
                data={approvalMem}
                rejection={rejectionStatus}
              />{" "}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
