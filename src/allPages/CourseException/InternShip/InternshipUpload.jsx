import React, { useEffect, useState } from "react";
import InputBox from "../../../components/InputBox/inputbox";
import TextField from "@mui/material/TextField";
import excel from "/excelsheetInternship/excelIntern.xlsx";
import { apiBaseUrl } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/onlineUpload.css";
import { DatePicker } from "antd";
import Select from "react-select";
import axios from "axios";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DescriptionIcon from "@mui/icons-material/Description";
import LoadingButton from "@mui/lab/LoadingButton";
import { InputNumber } from "primereact/inputnumber";

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

const InternshipUpload = () => {
  const navigate = useNavigate();
  const [multipleOpen, setMultipleOpen] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [companyAddress, setCompanyAddress] = useState(null);
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMultipleUpload = () => {
    setMultipleOpen(!multipleOpen);
  };

  const handleCompanyName = (event) => {
    setCompanyName(event.target.value);
  };

  const handleCompanyAddress = (event) => {
    setCompanyAddress(event.target.value);
  };

  const handleCompanyPhone = (event) => {
    setCompanyPhoneNumber(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/logout`, { withCredentials: true });
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('resources');
      
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleUpload = async () => {
    if (!companyName || !companyAddress || !companyPhoneNumber) {
      alert("Fill Out All The Fields.");
      return;
    }

    if (isNaN(companyPhoneNumber) || companyPhoneNumber <= 0) {
      alert("Enter a Valid Phone Number.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/in/InternShipCompanyApply`,
        {
          companyName,
          companyAddress,
          companyPhoneNumber,
        }, { withCredentials: true }
      );
      console.log("Response:", response.data);
      if (response.status === 200) {
        console.log("Company Added Successfully");
        setResponseMessage("Company Added Successfully");
        setResponseModalOpen(true);
        setIsSuccess(true);
        setCompanyName("");
        setCompanyAddress("");
        setCompanyPhoneNumber(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
      console.log("Error in Adding the Company ", error);
      const errorMsg = error.response
        ? error.response.data.msg
        : "Error in Adding the Company";
      setResponseMessage(errorMsg);
      setResponseModalOpen(true);
      setIsSuccess(false);
      setCompanyName("");
      setCompanyAddress("");
      setCompanyPhoneNumber(null);
      }
    }
  };

  const handleSheetUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadSheet = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    setResponseModalOpen(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/in/InternExcelUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }, { withCredentials: true }
      );

      setIsLoading(false);
      if (response.status === 200) {
        console.log(response.data);
        setResponseMessage(
          response.data.message +
            " Records Added: " +
            response.data.added +
            " skipped: " +
            response.data.skip +
            " Updated: " +
            response.data.updated
        );
        setIsSuccess(true);
        setSelectedFile(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      }
      else { 
      console.error("Error uploading file", error);
      setResponseMessage("Error Uploading File");
      setIsSuccess(false);
      }
    }
  };

  return (
    <div className="updMain">
      <div className="titleBtn">
        <div className="titlehm">
          <h4>Internship Company Upload</h4>
        </div>
      </div>
      <div className="subTit">
        <div className="singleTit">
          {multipleOpen ? "Single" : "Multiple"} Upload
        </div>
        <div className="multipleDiv">
          <button className="multipleBtn" onClick={handleMultipleUpload}>
            {multipleOpen ? "Multiple" : "Single"} Upload
          </button>
        </div>
      </div>
      {multipleOpen ? (
        <div className={`frmUpload ${multipleOpen ? "Open" : ""}`}>
          <div className="DefaultUpload">
            <div className="dfinsideUpload">
              <div className="quesField">
                <div className="inp">Company Name</div>
                <div>
                  <TextField
                    className="text"
                    variant="outlined"
                    size="small"
                    value={companyName}
                    onChange={handleCompanyName}
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Company Address</div>
                <div>
                  <TextField
                    className="text"
                    variant="outlined"
                    size="small"
                    value={companyAddress}
                    onChange={handleCompanyAddress}
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Company Phone</div>
                <div>
                  <TextField
                    className="text"
                    variant="outlined"
                    size="small"
                    value={companyPhoneNumber}
                    onChange={handleCompanyPhone}
                    type="number"
                  />
                </div>
              </div>
              <div className="EXPsubmits">
                <button className="expCreateBtn" onClick={handleUpload}>
                  Create Company
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="singleMain">
          <div className="uploadDiv">
            <div className="updBtnMain">
              <div className="updBtn">
                {!selectedFile && (
                  <label htmlFor="excel-upload" className="pdf-upload-button">
                    Choose File
                    <input
                      id="excel-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleSheetUpload}
                    />
                  </label>
                )}
                {selectedFile && (
                  <div className="filename">
                    {" "}
                    <div style={{ display: "flex", gap: "5px" }}>
                      <DescriptionIcon /> {selectedFile.name}{" "}
                    </div>
                    <button
                      className="excel-upload-button"
                      onClick={uploadSheet}
                    >
                      Upload Sheet
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="rules">
              <div className="rules">
                Refer Below Link to Download the Excel Sheet Sample Format For
                Reference
              </div>
              <div className="btns">
                <div>
                  <a href={excel} download>
                    <button className="excel-upload-button">
                      Download Sample
                    </button>
                  </a>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        style={{ zIndex: 6000 }}
      >
        <Box sx={style1} className="success">
          <div>
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <LoadingButton loading variant="text">
                  submit
                </LoadingButton>
                <h4 style={{ marginTop: "5px" }}>Loading...</h4>
              </div>
            ) : (
              responseMessage
            )}
          </div>
          <div className="tick">
            {!isLoading &&
              (issuccess ? <CheckCircleIcon /> : <AnnouncementIcon />)}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default InternshipUpload;
