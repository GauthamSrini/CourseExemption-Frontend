import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import excel from "/excelSheetHonorMinor/sampleFormatforHonorMinor.xlsx";
import "../styles/onlineUpload.css";
import { apiBaseUrl } from "../../../api/api";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DescriptionIcon from "@mui/icons-material/Description";
import LoadingButton from "@mui/lab/LoadingButton";
import DownloadIcon from "@mui/icons-material/Download";

const HonorMinorUpload = () => {
  const navigate = useNavigate();
  const [multipleOpen, setMultipleOpen] = useState(false);
  const [courseCode, setCourseCode] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [issuccess, setIsSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modeOfExemption, setModeOfExemption] = useState(null);
  const [rollNumberData, setRollNumberData] = useState([]);
  const [student, setStudent] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [modeOfExemptionData, setModeOfExemptionData] = useState([]);
  const [electiveData, setElectiveData] = useState([]);
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

  // fetching the needed stuffs as rollnumbersabd available mode of exemp as honor/Minor and academic years
  useEffect(() => {
    const fetchData = async () => {
      try {
        const type = await axios.get(
          `${apiBaseUrl}/api/ce/availableRollNumbers`,
          { withCredentials: true }
        );
        const type1 = await axios.get(
          `${apiBaseUrl}/api/ce/AddHM/AvailableModeOfExemption`,
          { withCredentials: true }
        );
        setRollNumberData(type.data);
        setModeOfExemptionData(type1.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching users:", error);
        }
      }
    };
    const fetchAcademicYear = async () => {
      const yearPromise = await axios.get(
        `${apiBaseUrl}/api/ce/AvailableAcademicYears`,
        { withCredentials: true }
      );
      setAcademicYearData(yearPromise.data);
    };
    fetchData();
    fetchAcademicYear();
  }, []);

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

  // setting up the Dropdown Options
  const RollNumberList = rollNumberData.map((types) => ({
    value: types.register_number,
    label: types.register_number,
  }));

  const ModeOfExemptions = modeOfExemptionData.map((data, index) => ({
    value: data.id,
    label: data.mode_of_exemption,
    isDisabled: index === 0,
  }));

  const AcademicYearList = academicYearData.map((year) => ({
    value: year.id,
    label: year.academic_year,
  }));

  // function to switch to single and multiple upload button
  const handleMultipleUpload = () => {
    setMultipleOpen(!multipleOpen);
  };

  // all functions to handle the change in input
  const handleModeOfexemption = (selectedOption) => {
    setModeOfExemption(selectedOption.value);
  };

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

  // Main Function to Upload the Sheet
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
        `${apiBaseUrl}/api/ce/AddHm/HonorMinorExcelUpload`,
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
            response.data.skip
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

  // Main Function for handling the single Upload
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !student ||
      !selectedSem ||
      !modeOfExemption ||
      !courseCode ||
      !courseName ||
      !selectedAcademicYear
    ) {
      alert("Please fill all the fields");
      return;
    }

    const formData = {
      student: student,
      semester: selectedSem,
      modeOfExemption: modeOfExemption,
      courseCode: courseCode,
      courseName: courseName,
      selectedAcademicYear: selectedAcademicYear,
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/ce/AddHm/HonorMinorSingleUpload`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setResponseMessage("Course Added Successfully");
        setResponseModalOpen(true);
        setIsSuccess(true);
        // Clear form fields
        setStudent("");
        setSelectedSem(null);
        // setDepartment( );
        setModeOfExemption(null);
        setCourseCode("");
        setCourseName("");
      } else {
        alert("Form submission failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error submitting form:", error);
        const errorMsg = "Error in Adding the Course";
        setResponseMessage(errorMsg);
        setResponseModalOpen(true);
        setIsSuccess(false);
      }
    }
  };

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
          <h4>Honor Minor Uploads</h4>
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
          <form onSubmit={handleSubmit} className="DefaultUpload">
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
                    value={{
                      value: selectedAcademicYear,
                      label: selectedAcademicYear
                        ? `Semester ${selectedAcademicYear}`
                        : "",
                    }}
                    onChange={handleAcademicYear}
                    placeholder=""
                    isSearchable
                    className="textFieldUpload"
                    options={AcademicYearList}
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
                </div>
              </div>
              <div className="quesField">
                <div className="inp">Honor/Minor</div>
                <div>
                  <Select
                    className="textFieldUpload"
                    onChange={handleModeOfexemption}
                    options={ModeOfExemptions}
                    placeholder=""
                  />
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
                <button type="submit" className="expCreateBtn">
                  Create Course
                </button>
              </div>
            </div>
          </form>
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
      {/* Response modal for displaying the message as failure or success */}
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

export default HonorMinorUpload;
