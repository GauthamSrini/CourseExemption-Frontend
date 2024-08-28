import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import '../styles/Facultymodal.css';
import { useEffect, useState } from 'react';
import { apiBaseUrl } from "../../../api/api";
import StepperWithContent from './StepperWithContent';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%', // Adjusted width for larger screens
  maxWidth: '450px', // Maximum width for smaller screens
  maxHeight: '85%',
  bgcolor: 'background.paper',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
  p: 4,
  borderRadius:'10px',
  overflowY: 'auto',
};

const InternBasicModal = ({ rowData, open, handleClose, faculty, approvalMembers}) => {
  const [status, setStatus] = useState("");
  const [appliedFor, setAppliedFor] = useState("");
  const [remOpen, setRemOpen] = useState("");
  const [certificatePath, setCertificatePath] = useState("");
  const [reportPath, setReportPath] = useState("");
  const [rejectedBy,setRejectedBy] = useState(null)

  useEffect(() => {
    if (rowData.approval_status === 1) {
      setStatus("Approved");
    } else if (rowData.approval_status === -1) {
      setStatus("Rejected");
      setRejectedBy(rowData.rejected_by)
      setRemOpen(true);
    } else {
      setStatus("Initiated");
    }

    if (rowData.type === "1") {
      setAppliedFor("Exemption");
    } else {
      setAppliedFor("Rewards");
    }
    setCertificatePath(rowData.certificate_path);
    setReportPath(rowData.report_path);
  }, [rowData]);

  const handleView = (filePath) => {
    const fileURL = `${apiBaseUrl}/api/ce/in/InternApply/pdfs/${filePath}`;
    window.open(fileURL, '_blank');
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className='BasicModal'>
          <div className='modal'>
            <div className="CourseTit">Internship Details</div>
            {faculty && <>
              <div className='field'>
                <div className='fldClm'>Student</div>
                <div className='fldData'>{rowData.student_name}</div>
              </div>
              <div className='field'>
                <div className='fldClm'>Register Number</div>
                <div className='fldData'>{rowData.register_number}</div>
              </div>
              <div className='field'>
                <div className='fldClm'>Year</div>
                <div className='fldData'>{rowData.year === 1 ? "1st Year" : rowData.year === 2 ? "2nd Year" : rowData.year === 3 ? "3rd Year" : "4th Year"}</div>
              </div>
              <div className='field'>
                <div className='fldClm'>Department</div>
                <div className='fldData'>{rowData.branch}</div>
              </div>
            </>}
            <div className='field'>
              <div className='fldClm'>Industry</div>
              <div className='fldData'>{rowData.company_name + '-' + rowData.company_address}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>Academic Year</div>
              <div className='fldData'>{rowData.academic_year}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>Semester</div>
              <div className='fldData'>{rowData.semester}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>Duration</div>
              <div className='fldData'>{rowData.duration + " Days"}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>Mode</div>
              <div className='fldData'>{rowData.mode}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>Start Date</div>
              <div className='fldData'>{rowData.start_date}</div>
            </div>
            <div className='field'>
              <div className='fldClm'>End Date</div>
              <div className='fldData'>{rowData.end_date}</div>
            </div>
            {rowData.stipend==="Yes" && 
            <div className='field'>
              <div className='fldClm'>Stipend Amount</div>
              <div className='fldData'>{rowData.amount}</div>
            </div>}
            <div className='field'>
              <div className='fldClm'>Applied For</div>
              <div className='fldData'>{appliedFor}</div>
            </div>
            {rowData.elective?<div className='field'>
                <div className='fldClm'>Elective</div>
                <div className='fldData'>{rowData.elective}</div>
          </div>:null}
            <div className='field'>
              <div className='fldClm'>Certificate</div>
              <div className='pdficon' onClick={() => handleView(certificatePath)}><InsertDriveFileIcon /><div>View certificate</div></div>
            </div>
            <div className='field'>
              <div className='fldClm'>Report</div>
              <div className='pdficon' onClick={() => handleView(reportPath)}><InsertDriveFileIcon /><div>View report</div></div>
            </div>
            {remOpen &&
            <div className='field'>
              <div className='fldClm'>Remark</div>
              <div className='remar'>{rowData.remarks}</div>
            </div>}
            <div style={{marginTop:"10px "}} > <StepperWithContent status={rowData.approval_status} data={approvalMembers} rejection={rejectedBy}/> </div>
            {/* <div className='field'>
              <div className='fldClm'>Status</div>
              <div className='fldData'><button className={rowData.approval_status === 1 ? "btnApprove" : rowData.approval_status === -1 ? "btnRemove" : "btnInitiated"}>{status}</button></div>
            </div> */}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default InternBasicModal;