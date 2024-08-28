import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import excel from "/excelSheetAddOn/ExcelsheetFormatAddon.xlsx";
import "../styles/onlineUpload.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiBaseUrl } from "../../../api/api";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DescriptionIcon from "@mui/icons-material/Description";
import LoadingButton from "@mui/lab/LoadingButton";
import DownloadIcon from "@mui/icons-material/Download";

const AddOnUpload = () => {
  const navigate = useNavigate();
  const [multipleOpen, setMultipleOpen] = useState(false);
  const [courseCode, setCourseCode] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rollNumberData, setRollNumberData] = useState([]);
  const [student, setStudent] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [academicYearData, setAcademicYearData] = useState([]);
  const [selectedAcademicYear, SetSelectedAcademicYear] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([]);

  // purposely declared inside funcntion as it uses issuccss state
  const style1 = {
    position: "absolute",
    top: "5%",
    left: "50%",
    bottom: "90%",
    transform: "translate(-50%, -50%)",
    width: 280,
    bgcolor: "background.paper",
    boxShadow: issuccess ? "green 0px 3px 2px" : "rgb(250, 41, 41) 0px 3px 2px",
    borderRadius: "10px",
    p: 4,
  };

  // fetching Register Number and Academic Year
  useEffect(() => {
    const fetchRegisterNumbers = async () => {
      try {
        const type = await axios.get(
          `${apiBaseUrl}/api/ce/availableRollNumbers`,
          { withCredentials: true }
        );
        setRollNumberData(type.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching RegisterNumbers:", error);
        }
      }
    };
    const fetchAcademicYear = async () => {
      try {
        const yearPromise = await axios.get(
          `${apiBaseUrl}/api/ce/AvailableAcademicYears`,
          { withCredentials: true }
        );
        setAcademicYearData(yearPromise.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching Academic Years:", error);
        }
      }
    };
    fetchRegisterNumbers();
    fetchAcademicYear();
  }, []);

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

  // setting up the dropdown options
  const RollNumberList = rollNumberData.map((types) => ({
    value: types.register_number,
    label: types.register_number,
  }));

  const AcademicYearList = academicYearData.map((year) => ({
    value: year.id,
    label: year.academic_year,
  }));

  // swifting state 
  const handleMultipleUpload = () => {
    setMultipleOpen(!multipleOpen);
  };

  // other handling functions
  const handleCourseCode = (event) => {
    setCourseCode(event.target.value);
  };

  const handleCourseName = (event) => {
    setCourseName(event.target.value);
  };

  const handleSheetUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRegisterNumber = (selectedOption) => {
    setStudent(selectedOption.value);
  };

  const handleSem = (selectedOption) => {
    setSelectedSem(selectedOption.value);
  };

  const handleResponseClose = () => {
    setResponseModalOpen(false)
    window.location.reload();
  }

  // Main Function for Single Upload
  const handleUpload = async () => {
    try {
      if (
        !courseCode ||
        !courseName ||
        !student ||
        !selectedSem ||
        !selectedAcademicYear
      ) {
        alert("Fill Out All The Fields..");
      } else {
        const response = await axios.post(
          `${apiBaseUrl}/api/ce/AddHm/AddOnSingleUpload`,
          {
            courseCode,
            courseName,
            student,
            selectedSem,
            selectedAcademicYear,
          },
          { withCredentials: true }
        );
        console.log("Response:", response.data);
        if (response.status === 200) {
          console.log("Course Added Successfully");
          setResponseMessage("Course Added Successfully");
          setResponseModalOpen(true);
          setIsSuccess(true);
          setCourseCode("");
          setCourseName("");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.log("Error in Adding the Course ", error);
        const errorMsg =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.response && error.response.data.msg
            ? error.response.data.msg
            : "Error in Adding the Course";
        setResponseMessage(errorMsg);
        setResponseModalOpen(true);
        setIsSuccess(false);
        setCourseCode("");
        setCourseName("");
      }
    }
  };

  // Main Function for Sheet Upload
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
        `${apiBaseUrl}/api/ce/AddHm/AddOnExcelUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
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
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error uploading file", error);
        setResponseMessage("Error Uploading File");
        setIsSuccess(false);
      }
    }
  };

  // getting the academic year and setting up the semester option based on the academic Years
  const handleAcademicYear = async (selectedOption) => {
    SetSelectedAcademicYear(selectedOption.value);
    setSelectedSem(null);
    setSemesterOptions([]);
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/ce/AvailableSemester?id=${selectedOption.value}`,
        { withCredentials: true }
      );
      const semesterData = response.data[0];

      const newSemesterOptions = [
        { value: semesterData.sem1, label: `Semester ${semesterData.sem1}` },
        { value: semesterData.sem2, label: `Semester ${semesterData.sem2}` },
        { value: semesterData.sem3, label: `Semester ${semesterData.sem3}` },
      ];
      setSemesterOptions(newSemesterOptions);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error fetching semester data:", error);
      }
    }
  };

  return (
    <div className="updMain">
      <div className="titleBtn">
        <div className="titlehm">
          <h4>Add-On Uploads</h4>
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
                <div className="inp">Register Number</div>
                <div>
                  <Select
                    className="textFieldUpload"
                    onChange={handleRegisterNumber}
                    options={RollNumberList}
                    placeholder=""
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Academic Year</div>
                <div>
                  <Select
                    onChange={handleAcademicYear}
                    placeholder=""
                    className="textFieldUpload"
                    options={AcademicYearList}
                    isSearchable={false}
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Semester</div>
                <div>
                  <Select
                    value={{
                      value: selectedSem,
                      label: selectedSem ? `Semester ${selectedSem}` : "",
                    }}
                    onChange={handleSem}
                    className="textFieldUpload"
                    options={semesterOptions}
                    isSearchable={false}
                    placeholder=""
                  />
                  {/* {selectedSem && <div> Semester : {selectedSem} </div>} */}
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Course Code</div>
                <div>
                  <TextField
                    className="text"
                    variant="outlined"
                    size="small"
                    value={courseCode}
                    onChange={handleCourseCode}
                  />
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Course Name</div>
                <div>
                  <TextField
                    className="text"
                    variant="outlined"
                    size="small"
                    value={courseName}
                    onChange={handleCourseName}
                  />
                </div>
              </div>
              <div className="EXPsubmits">
                <button className="expCreateBtn" onClick={handleUpload}>
                  Create Course
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
                  <label
                    htmlFor="excel-upload"
                    className="single-upload-button"
                  >
                    Choose File
                    <input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx"
                      style={{ display: "none" }}
                      onChange={handleSheetUpload}
                    />
                  </label>
                )}
                {selectedFile && (
                  <div className="filename">
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
                  <a href={excel} download style={{ textDecoration: "none" }}>
                    <button className="excel-upload-button">
                      <DownloadIcon />
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

      {/* Response Modal*/}
      <Modal
        open={responseModalOpen}
        onClose={handleResponseClose}
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
              (issuccess ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <AnnouncementIcon style={{ color: "rgb(250, 41, 41)" }} />
              ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddOnUpload;
