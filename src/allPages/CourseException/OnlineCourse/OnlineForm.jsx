import React, { useState, useEffect } from "react";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import pdf from "../../../assets/courseExceptionPdf/Online.pdf";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import axios from "axios";
import InputBox from "../../../components/InputBox/inputbox";
import { DatePicker } from "antd";
import { apiBaseUrl } from "../../../api/api";
import Collapse from "@mui/material/Collapse";
import apiLoginHost from "../../login/LoginApi";
import dayjs from "dayjs";
import Select from "react-select";
import "../styles/nptel.css";
import Box from "@mui/material/Box";
import StepperWithContent from "../stuffs/StepperWithContent";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { Navigate, useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 290,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 3,
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

const style3 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%", // Adjusted width for larger screens
  maxWidth: "650px", // Maximum width for smaller screens
  maxHeight: "85%",
  bgcolor: "var(--background)",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  p: 4,
  borderRadius: "10px",
  overflowY: "auto",
};

const OnlineForm = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [course, setCourse] = useState("");
  const [courseStatus, setCourseStatus] = useState(null);
  const [selectedSem, setSelectedSem] = useState("");
  const [student, setStudent] = useState("7376222AD156");
  const [studentName, setStudentName] = useState(""); // login details
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [examDate, setExamDate] = useState(null);
  const [fmtStartDate, setFmtStartDate] = useState(null);
  const [fmtEndDate, setFmtEndDate] = useState(null);
  const [fmtExamDate, setFmtExamDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [opinion, setOpinion] = useState(null);
  const [creditOpen, setCreditOpen] = useState(null);
  const [selectedCredits, setSelectedCredits] = useState(null);
  const [openings, setOpenings] = useState(false);
  const [courseType, setCourseType] = useState([]);
  const [crname, setCrname] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [certificateUrlExp, setCertificateUrlExp] = useState("");
  const [certificateUrlRp, setCertificateUrlRp] = useState("");
  const [validWeek, setValidWeek] = useState(null); // valid week credit and semester for validation
  const [validCredit, setValidCredit] = useState(null);
  const [validSemester, setValidSemester] = useState(null);
  const [excemption, setExcemption] = useState("");
  const [selectedPdfExp, setSelectedPdfExp] = useState(null);
  const [selectedPdfRp, setSelectedPdfRp] = useState(null);
  const [reportPdf, setReportPdf] = useState(null);
  const [weekList, setWeekList] = useState([]);
  const [creditList, setCreditList] = useState([]);
  const [marks, setMarks] = useState(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [dataRespModal, setDataRespModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [approvalStatusFromDb, setApprovalStatusFromDb] = useState([]);
  const [restrictModal, setRestrictModal] = useState(false);
  const [certificateType, setCertificateType] = useState(null);
  const [nptelActive, setNptelActive] = useState(null);
  const [onecreditActive, setOneCreditActive] = useState(null);
  const [totalActive, setTotalActive] = useState(null);
  const [approvedNptel, setApprovedNptel] = useState(null);
  const [totalExemption, setTotalExemption] = useState(null);
  const [academicYearData, setAcademicYearData] = useState([]);
  const [selectedAcademicYear, SetSelectedAcademicYear] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [electiveData, setElectiveData] = useState([]);
  const [electiveId, setElectiveId] = useState(null);
  const [exemptionType, setExemptionType] = useState(null);
  const [typeOptionDisabled, setTypeOptionDisabled] = useState(false);
  const [multiStepModalOpen, setMultiStepModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [switchingStages, setSwitchingStages] = useState(null);
  const [mark_sheet_12_week,set_mark_sheet_12_week] = useState(null)
  // mostly the below usestates everything will runs only at the selection of the special case of exemption
  /// the below useStates is added based on the new added feature for two 8 weeks course and three 8 weeks course

  /// usestate to handle the course selection in three steps in multistep modal
  const [courseId_1, setCourseId_1] = useState(null);
  const [courseId_2, setCourseId_2] = useState(null);
  const [courseId_3, setCourseId_3] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courselist, setCourselist] = useState([]); // common

  // special case useStates
  const [elective1_id,setElective1_id] = useState(null)
  const [elective2_id,setElective2_id] = useState(null)
  const [marksheet,setMarksheet] = useState(null)

  /// in depth details of the course 1 selection (special case)
  const [academic_year_course_1, setAcademic_year_course_1] = useState(null);
  const [semester_course_1, setSemester_course_1] = useState(null);
  const [semester_options_course_1, set_semester_options_course_1] = useState(null);
  const [start_date_course_1, set_start_date_course_1] = useState(null);
  const [end_date_course_1, set_end_date_course_1] = useState(null);
  const [exam_date_course_1, set_exam_date_course_1] = useState(null);
  const [fmt_start_date_course_1, set_fmt_start_date_course_1] = useState(null);
  const [fmt_end_date_course_1, set_fmt_end_date_course_1] = useState(null);
  const [fmt_exam_date_course_1, set_fmt_exam_date_course_1] = useState(null);
  const [marks_course_1, set_marks_course_1] = useState(null);
  const [cerf_type_course_1, set_cerf_type_course_1] = useState(null);
  const [selectedPdfC1, setSelectedPdfC1] = useState(null);
  const [cerf_url_course_1,set_cerf_url_course_1] = useState(null)

  /// in depth details of the course 2 selection (special case)
  const [academic_year_course_2, setAcademic_year_course_2] = useState(null);
  const [semester_course_2, setSemester_course_2] = useState(null);
  const [semester_options_course_2, set_semester_options_course_2] = useState(null);
  const [start_date_course_2, set_start_date_course_2] = useState(null);
  const [end_date_course_2, set_end_date_course_2] = useState(null);
  const [exam_date_course_2, set_exam_date_course_2] = useState(null);
  const [fmt_start_date_course_2, set_fmt_start_date_course_2] = useState(null);
  const [fmt_end_date_course_2, set_fmt_end_date_course_2] = useState(null);
  const [fmt_exam_date_course_2, set_fmt_exam_date_course_2] = useState(null);
  const [marks_course_2, set_marks_course_2] = useState(null);
  const [cerf_type_course_2, set_cerf_type_course_2] = useState(null);
  const [selectedPdfC2, setSelectedPdfC2] = useState(null);
  const [cerf_url_course_2,set_cerf_url_course_2] = useState(null)

  /// in depth details of the course 3 selection (special case)
  const [academic_year_course_3, setAcademic_year_course_3] = useState(null);
  const [semester_course_3, setSemester_course_3] = useState(null);
  const [semester_options_course_3, set_semester_options_course_3] = useState(null);
  const [start_date_course_3, set_start_date_course_3] = useState(null);
  const [end_date_course_3, set_end_date_course_3] = useState(null);
  const [exam_date_course_3, set_exam_date_course_3] = useState(null);
  const [fmt_start_date_course_3, set_fmt_start_date_course_3] = useState(null);
  const [fmt_end_date_course_3, set_fmt_end_date_course_3] = useState(null);
  const [fmt_exam_date_course_3, set_fmt_exam_date_course_3] = useState(null);
  const [marks_course_3, set_marks_course_3] = useState(null);
  const [cerf_type_course_3, set_cerf_type_course_3] = useState(null);
  const [selectedPdfC3, setSelectedPdfC3] = useState(null);
  const [cerf_url_course_3,set_cerf_url_course_3] = useState(null)

  // created for the multistep modal
  const stages1 = ["Course 1", "Course 2", "Elective"];
  const stages2 = ["Course 1", "Course 2", "Course 3", "Elective"];

  const slides = [
    { title: "First item", description: "Lorem ipsum" },
    { title: "Second item", description: "Lorem ipsum" },
  ];

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

  // Function to fetch the necessary stuffs
  const fetchUsers = async () => {
    try {
      const typePromise = await axios.get(
        `${apiBaseUrl}/api/ce/oc/platform`,
        { withCredentials: true } // getting up the available platforms as NPTEL etc..
      );
      const validPromise = await axios.get(
        `${apiBaseUrl}/api/ce/oc/courseExpValidation`,
        { withCredentials: true } // getting up the validation week for exemptin as 12 weeks and 3 credits
      );
      const decisionStatusPromise = await axios.get(
        `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
        { withCredentials: true } // All Active application in all domains
      );
      const respPromise = await axios.get(
        `${apiBaseUrl}/api/ce/oc/ApprovedStatusAll?student=${student}`,
        { withCredentials: true } // approved status of respective student
      );
      const yearPromise = await axios.get(
        `${apiBaseUrl}/api/ce/AvailableAcademicYears`,
        { withCredentials: true } // available Academic Years
      );
      const electivePromise = await axios.get(
        `${apiBaseUrl}/api/ce/AvailableElectives?student=${student}`,
        { withCredentials: true } // Available Electives
      );

      const results = await Promise.allSettled([
        typePromise,
        validPromise,
        decisionStatusPromise,
        respPromise,
        yearPromise,
        electivePromise,
      ]);

      const [
        typeResult,
        validResult,
        decisionStatusResult,
        respResult,
        yearResult,
        electiveResult,
      ] = results;

      if (typeResult.status === "fulfilled") {
        setCourseType(typeResult.value.data);
      } else {
        console.error("Error fetching type:", typeResult.reason);
      }

      if (validResult.status === "fulfilled") {
        const { week, credit, semester } = validResult.value.data[0];
        setValidWeek(week);
        setValidCredit(credit);
        setValidSemester(semester);
      } else {
        console.error("Error fetching validation data:", validResult.reason);
      }

      if (decisionStatusResult.status === "fulfilled") {
        const { nptel, oneCredit, total } = decisionStatusResult.value.data;
        setNptelActive(nptel);
        setOneCreditActive(oneCredit);
        setTotalActive(total);
        setApprovalStatusFromDb(decisionStatusResult.value.data);
      } else {
        console.error(
          "Error fetching All the Active Applcations",
          decisionStatusResult.reason
        );
      }

      if (respResult.status === "fulfilled") {
        const { approved_nptel, approved_total } = respResult.value.data;
        setApprovedNptel(approved_nptel);
        setTotalExemption(approved_total);
      } else {
        console.error("Error fetching approved status:", respResult.reason);
      }

      if (yearResult.status === "fulfilled") {
        setAcademicYearData(yearResult.value.data);
      } else {
        console.error("Error fetching academic years:", yearResult.reason);
      }

      if (electiveResult.status === "fulfilled") {
        setElectiveData(electiveResult.value.data);
      } else {
        console.error("Error fetching academic years:", electiveResult.reason);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error fetching users:", error);
      }
    }
  };

  // Function to get the login Details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiLoginHost}/api/user-data`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStudentName(data.name);
          setRegisterNumber(data.register_number);
          setDepartment(data.department);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  //Loading the PDF from the utils folder
  useEffect(() => {
    const loadPdf = async () => {
      const response = await fetch(pdf);
      const pdfBlob = await response.blob();
      setReportPdf(pdfBlob);
    };
    loadPdf();
    fetchUsers();
  }, []);

  //function to trigger the pdf download after submission of the application
  const modifyPdf = async () => {
    if (!reportPdf) {
      alert("Failed to load PDF");
      return;
    }
    const existingPdfBytes = await reportPdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesNewRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText("B.TECH IT", {
      x: 190,
      y: 440,
      size: 12,
      font: timesNewRomanFont,
    });
    firstPage.drawText(course, {
      x: 190,
      y: 414,
      size: 12,
      font: timesNewRomanFont,
    });
    firstPage.drawText("14/02/2024", {
      x: 720,
      y: 455,
      size: 12,
      font: timesNewRomanFont,
    });
    firstPage.drawText("7376222IT137", {
      x: 35,
      y: 280,
      size: 12,
      font: timesNewRomanFont,
    });
    firstPage.drawText("Gautham S", {
      x: 125,
      y: 280,
      size: 12,
      font: timesNewRomanFont,
    });
    firstPage.drawText("Frontend Developer", {
      x: 300,
      y: 280,
      size: 12,
      font: timesNewRomanFont,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified_pdf.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Function to handle week selection
  const handleWeek = (selectedOption) => {
    setSelectedWeek(selectedOption.value);
  };
  // Function to handle Course Selection
  const handleCourse = async (course) => {
    if (course) {
      const selectedCourse = course.value;
      console.log(selectedCourse);
      console.log(approvalStatusFromDb);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/ce/oc/platform/excemption?id=${selectedCourse}`,
          { withCredentials: true }
        );
        const res = response.data[0].excemption;
        setExcemption(res);
        if (res === "1") {
          setCreditOpen(true);
          setCourse(course.label);
          setCourseStatus(course.value);
        } else {
          setCourse(course.label);
          setCreditOpen(false);
          setCourseStatus(course.value);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching course names:", error);
        }
      }
    } else {
      // Handle case where selectedOption is null (e.g., clearing selection)
      setCourse("");
    }
  };

  // Function to handle Type of the Option Selected
  const handleTypeOfApplicationSelected = async (type) => {
    setTypeOptionDisabled(true);
    setWeekList([]);
    setCreditList([]);
    setSelectedWeek(null);
    setSelectedCredits(null);
    setCrname(null);
    setCourseName(null);
    if (type.value === 4) {
      setSwitchingStages(1);
      if (nptelActive <= 1 && totalActive < 4) setMultiStepModalOpen(true);
      else setRestrictModal(true);
    }
    if (type.value === 5) {
      setSwitchingStages(2);
      if (nptelActive === 0 && totalActive < 3) setMultiStepModalOpen(true);
      else setRestrictModal(true);
    }
    const resp = await axios.get(
      `${apiBaseUrl}/api/ce/oc/courselist?platform=${courseStatus}&student=${student}&type=${type.value}`,
      { withCredentials: true }
    );
    setCourselist(resp.data);
  };

  // function to handle semester Selection
  const handleSem = (selectedOption, setSelectedSem) => {
    setSelectedSem(selectedOption.value);
  };

  const handleCertificateType = (selectedOption,setCertificateType) => {
    setCertificateType(selectedOption.value);
  };

  // Function to handle Start Date
  const handleStartDateChange = (
    date,
    setStartDate,
    setFmtStartDate,
    endDate
  ) => {
    if (endDate && date && date > endDate) {
      // If start date is after end date, show error message
      alert(
        "Start date cannot be after the end date. Please select a valid start date."
      );
      setStartDate(null); // Reset start date
    } else {
      setStartDate(date);
      // if (endDate && date) {
      //   const diffTime = Math.abs(endDate - date);
      //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //   setNumberOfDays(diffDays);
      // }
      if (date && typeof date === "object" && date.$isDayjsObject) {
        const nativeDate = date.toDate();
        const formatdate = formatDate(nativeDate);
        console.log(formatdate);
        setFmtStartDate(formatdate);
      }
    }
  };

  // Function to handle End Date
  const handleEndDateChange = (date, setEndDate, setFmtEndDate, startDate) => {
    if (startDate && date && date < startDate) {
      // If end date is before start date, show error message
      alert(
        "End date cannot be before the start date. Please select a valid end date."
      );
      setEndDate(null); // Reset end date
    } else {
      // If end date is valid, update the state and calculate the number of days
      setEndDate(date);
      // if (startDate && date) {
      //   const diffTime = Math.abs(date - startDate);
      //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //   setNumberOfDays(diffDays);
      // }
      if (date && typeof date === "object" && date.$isDayjsObject) {
        // Extract the native Date object from the Day.js object
        const nativeDate = date.toDate();
        const formatdate = formatDate(nativeDate);
        console.log(formatdate);
        setFmtEndDate(formatdate);
      }
    }
  };

  const handleExamDate = (date, setExamDate, setFmtExamDate, startDate) => {
    // Check if start date is selected
    if (!startDate) {
      alert("Please select the start date first.");
      return; // Exit the function if start date is not selected
    }

    // Check if exam date is before start date
    if (date && date.isBefore(startDate, "day")) {
      // If exam date is before start date, show error message
      alert(
        "Exam date cannot be before the start date. Please select a valid exam date."
      );
      setExamDate(null); // Reset exam date
    } else {
      // Set the exam date
      setExamDate(date);
      // Format the exam date if it's a Day.js object
      if (date && typeof date === "object" && date.$isDayjsObject) {
        const nativeDate = date.toDate();
        const formatdate = formatDate(nativeDate);
        setFmtExamDate(formatdate);
      }
    }
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Function to handle selected opinion for Course Exception
  const handleOpinion = (selectedOption) => {
    setOpinion(selectedOption.value);
    if (selectedOption.value === 1) {
      setOpenings(true);
    } else {
      setOpenings(false);
    }
  };

  const hanldeDisableOfTypeOfApplication = () => {
    if (course != "") {
      return false;
    } else {
      return true;
    }
  };

  // Function to handle Credits
  const handleCredits = (selectedOption) => {
    setSelectedCredits(selectedOption.value);
  };

  // Function for exception validation
  const handleValidation = () => {
    // if((excemption && selectedCredits && selectedSem && selectedWeek)&&(excemption !="1" && ( selectedCredits < validCredit ) && (selectedSem < validSemester) && (selectedWeek < validWeek))){
    //   setGiveAlert(true);
    // }
    if (
      excemption === "1" &&
      selectedCredits >= validCredit &&
      // selectedSem >= validSemester &&
      selectedWeek >= validWeek &&
      !restrictingUser()
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Function for Alerting the User
  const alertingUser = () => {
    if (
      excemption &&
      selectedCredits &&
      // selectedSem &&
      selectedWeek &&
      (excemption != "1" ||
        selectedCredits < validCredit ||
        // selectedSem < validSemester ||
        selectedWeek < validWeek)
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Function for Restricting the user based on validation condition
  const restrictingUser = () => {
    if (excemption && selectedCredits && selectedWeek) {
      if (totalActive < 4 && nptelActive < 2) {
        return false;
      } else {
        return true;
      }
    }
  };

  // Function for setting loaded PDF
  const handleFileChangeExp = (event) => {
    setSelectedPdfExp(event.target.files[0]);
  };

  const handleMarkSheet = (event) => {
    set_mark_sheet_12_week(event.target.files[0]);
  }

  const handleFileChangeRp = (event) => {
    setSelectedPdfRp(event.target.files[0]);
  };

  const handleSpcialCoursesPdf = (event, setSelectedPdf) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedPdf(event.target.files[0]);
    console.log(event);
  };

  //To Handle the selection of the Course Name
  const handleCourseName = (crname) => {
    setCrname(crname.value);
    const selectedCourse = courselist.find(
      (course) => course.id === crname.value
    );
    const duration_info = [
      {
        value: selectedCourse.duration,
        label: `${selectedCourse.duration} Weeks`,
      },
    ];
    const credit_info = [
      {
        value: selectedCourse.credit,
        label: `${selectedCourse.credit} Credits`,
      },
    ];
    setCourseName(selectedCourse.name);
    setWeekList(duration_info);
    setCreditList(credit_info);
    setSelectedWeek(duration_info[0].value);
    setSelectedCredits(credit_info[0].value);
    console.log(duration_info[0].value, credit_info[0].value);
  };

  // handling the Marks Change restrcting to type the string data in number component
  const handleMarksChange = (e, setMarks) => {
    const input = e.target.value;
    if (!input || /^\d+$/.test(input)) {
      setMarks(input);
    }
  };

  // Hnadling the certificate urls

  const handleCerfUrls = (event,setCertificateUrl)=>{
    setCertificateUrl(event.target.value);
  }

  // Handling the Selected Elective
  const handleElective = (selectedOption,setElectiveId) => {
    setElectiveId(selectedOption.value);
  };

  // Main Function to Handle the Submission of the Rp
  const sendDataToBackendRp = async () => {
    try {
      if (
        !student ||
        !crname ||
        !selectedSem ||
        !fmtStartDate ||
        !fmtEndDate ||
        !fmtExamDate ||
        !marks ||
        !certificateUrlRp ||
        !selectedPdfRp ||
        !selectedAcademicYear||
        !certificateType
      ) {
        alert("Fill out all the Fields");
      } else {
        const formData = new FormData();
        const type = 0;
        const approval_status = 0;
        formData.append("course", crname);
        formData.append("student", student);
        formData.append("type", type);
        formData.append("academic_year", selectedAcademicYear);
        formData.append("semester", selectedSem);
        formData.append("start_date", fmtStartDate);
        formData.append("end_date", fmtEndDate);
        formData.append("exam_date", fmtExamDate);
        formData.append("mark", marks);
        formData.append("certificate_url", certificateUrlRp);
        formData.append("certificateFile", selectedPdfRp);
        formData.append("certficate_type", certificateType);
        formData.append("approval_status", approval_status);

        console.log(formData);

        const response = await axios.post(
          `${apiBaseUrl}/api/ce/oc/onlineApply/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        console.log("Response:", response.data);
        if (response.status === 200) {
          console.log("Data successfully sent to the backend");
          setDataRespModal(true);
          setIsSuccess(true);
          setResponseMessage("Course Applied Successfully");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error sending data to the backend:", error);
        setDataRespModal(true);
        setIsSuccess(false);
        setResponseMessage("Error While Applying the course");
      }
    }
  };

  // Main Function to send the Data to Backend on Submission of Exemption
  const sendDataToBackendExp = async () => {
    try {
      if (
        !student ||
        !crname ||
        !selectedSem ||
        !fmtStartDate ||
        !fmtEndDate ||
        !fmtExamDate ||
        !marks ||
        !certificateUrlExp ||
        !selectedPdfExp ||
        !selectedAcademicYear ||
        !electiveId ||
        !certificateType ||
        !mark_sheet_12_week
      ) {
        alert("Fill out all the Fields");
        return;
      }

      // Fetch active applications
      const activeApplicationsResponse = await axios.get(
        `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
        { withCredentials: true }
      );

      const { total } = activeApplicationsResponse.data;

      // Check if total applications are less than 4
      if (total >= 4) { 
        alert("You have reached the maximum number of applications allowed.");
        return;
      }

      // need to modify 

      // Check if the student-course mapping exists in active status
      // const checkMappingResponse = await axios.get(
      //   `${apiBaseUrl}/api/ce/oc/ActiveApplicationOnlineForValidation?student=${student}&course_code=${crname}`,
      //   { withCredentials: true }
      // );
      // const { exists } = checkMappingResponse.data;

      // if (exists) {
      //   alert(
      //     "The student is already registered for this course with an active status."
      //   );
      //   return;
      // }

      const formData = new FormData();
      const type = 1;
      const approval_status = 0;
      formData.append("course", crname);
      formData.append("student", student);
      formData.append("type", type);
      formData.append("academic_year", selectedAcademicYear);
      formData.append("semester", selectedSem); 
      formData.append("start_date", fmtStartDate);
      formData.append("end_date", fmtEndDate);
      formData.append("exam_date", fmtExamDate);
      formData.append("mark", marks);
      formData.append("certificate_url", certificateUrlExp);
      formData.append("certificateFile", selectedPdfExp);
      formData.append("approval_status", approval_status);
      formData.append("certficate_type", certificateType);
      formData.append("electiveId", electiveId);
      formData.append("marksheet",mark_sheet_12_week)
      console.log(formData);

      const response = await axios.post(
        `${apiBaseUrl}/api/ce/oc/onlineApply/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Response:", response.data);
      if (response.status === 200) {
        console.log("Data successfully sent to the backend");
        setDataRespModal(true);
        setIsSuccess(true);
        setResponseMessage("Course Applied Successfully");
        modifyPdf();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.error("Error sending data to the backend:", error);
        setDataRespModal(true);
        setIsSuccess(false);
        setResponseMessage("Error While Applying the course");
      }
    }
  };

  // Function to Allow only numeric keys and certain special keys
  const handleInputKeyDown = (event) => {
    if (
      !(
        // Allow numeric keys
        (
          (event.keyCode >= 48 && event.keyCode <= 57) || // 0-9 (top row)
          (event.keyCode >= 96 && event.keyCode <= 105) || // 0-9 (numpad)
          // Allow special keys: backspace, delete, arrow keys, tab, home, end
          [8, 46, 37, 39, 9, 36, 35].includes(event.keyCode)
        )
      )
    ) {
      // Prevent the default action for non-numeric keys
      event.preventDefault();
    }
  };

  // Function to handle the input of text ----- just for test
  const handleInputKeyDownMultiModal = (event) => {
    // Log the key pressed (for debugging or tracking purposes)
    console.log(`Key pressed: ${event.key} (KeyCode: ${event.keyCode})`);
    
    // Do nothing to restrict input; all keys are allowed.
    // You can add custom logic here if you want to handle specific key events.
  };

  // handling the close of response modal
  const handleRespModalClose = () => {
    setDataRespModal(false);
    // {
    //   isSuccess ? navigate("/courseExcp") : navigate("/Online Course");
    // }
  };

  // setting up the dropdowon options
  const ElectiveList = electiveData.map((types) => ({
    value: types.id,
    label: types.elective,
  }));

  const AcademicYearList = academicYearData.map((year) => ({
    value: year.id,
    label: year.academic_year,
  }));

  const CourseList = courseType.map((types) => ({
    value: types.id,
    label: types.name,
  }));

  const CourseNameList = courselist.map((name) => ({
    value: name.id,
    label: name.name,
  }));

  // Function to Handle the Change of the Academic Year
  const handleAcademicYear = async (
    selectedOption,
    SetSelectedAcademicYear,
    setSelectedSem,
    setSemesterOptions
  ) => {
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

  // Function to increase the step of the multi step form
  const handleStepIncrease = () => {
    const ins = step + 1;
    setStep(ins);
  };

  // Function to Decrease the step of the multi step form
  const handleStepDecrease = () => {
    const des = step - 1;
    setStep(des);
  };

  // custom styles for select component
  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: "var(--Bordercolor)",
      backgroundColor: "var(--textFieldBackground)",
      // fontFamily: "sans-serif",
      // backgroundColor: "var(--secondaryBlue)",
      // marginRight: "20px",
      color: "white",
      // borderRadius: "8px",
      // border: "none",
      // boxShadow: state.isFocused ? "none" : base.boxShadow,
      // borderColor: state.isFocused ? "transparent" : base.borderColor,
      // "&:hover": {
      //   borderColor: state.isFocused ? "transparent" : base.borderColor,
      // },
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--text-black)",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--background-2)", // Custom background color for the menu
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "var(--Bordercolor)" // Background color for hovered option
        : state.isSelected
        ? "var(--secondaryBlue)"
        : null, // Default background color for options
    }),
  };

  // Function to handle the closing of the Multi step
  const handleCloseMultiStepModal = () => {
    setMultiStepModalOpen(false);
    setStep(0);
    setCourseId_1(null);
    setCourseId_2(null);
    setCourseId_3(null);
    setSelectedCourses([]);
  };

  // Function to handlle the course selection in the multiStep modal
  const handleCourseSelect = (selectedCourseId, setCourseId) => {
    const selectedCourse = courselist.find(
      (course) => course.id === selectedCourseId
    );
    const duration_info = [
      {
        value: selectedCourse.duration,
        label: `${selectedCourse.duration} Weeks`,
      },
    ];
    const credit_info = [
      {
        value: selectedCourse.credit,
        label: `${selectedCourse.credit} Credits`,
      },
    ];
    setWeekList(duration_info);
    setCreditList(credit_info);
    setSelectedWeek(duration_info[0].value);
    setSelectedCredits(credit_info[0].value);

    setCourseId(selectedCourseId);
    const updatedSelectedCourses = [courseId_1, courseId_2, courseId_3].filter(
      (id) => id !== null
    );
    if (!updatedSelectedCourses.includes(selectedCourseId)) {
      updatedSelectedCourses.push(selectedCourseId);
    }
    setSelectedCourses(updatedSelectedCourses);
  };

  // Filter options based on selected courses in multistep modal
  const filterOptions = (courseId) => {
    return courselist
      .filter(
        (course) =>
          !selectedCourses.includes(course.id) || course.id === courseId
      )
      .map((course) => ({
        value: course.id,
        label: course.name,
      }));
  };

  // Final submission function for the multi course --- part 1 --- two 8 week courses
  const handleApplicationMultiCoursepart1 = async () => {
    try {
      if (
        !courseId_1 ||
        !courseId_2 ||
        !academic_year_course_1 ||
        !academic_year_course_2 ||
        !semester_course_1 ||
        !semester_course_2 ||
        !fmt_start_date_course_1 ||
        !fmt_end_date_course_1 ||
        !fmt_exam_date_course_1 ||
        !fmt_start_date_course_2 ||
        !fmt_end_date_course_2 ||
        !fmt_exam_date_course_2 ||
        !marks_course_1 ||
        !marks_course_2 ||
        !elective1_id ||
        !selectedPdfC1 ||
        !selectedPdfC2 ||
        !cerf_type_course_1 ||
        !cerf_type_course_2 ||
        !marksheet ||
        !cerf_url_course_1 ||
        !cerf_url_course_2
      ) {
        alert("Fill out all the Fields");
        return;
      }
      // Fetch active applications
      const activeApplicationsResponse = await axios.get(
        `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
        { withCredentials: true }
      );

      const { total, nptel } = activeApplicationsResponse.data;

      // Check if total applications are less than 4
      if (total >= 4 || nptel>=2) {
        alert("You have reached the maximum number of applications allowed.");
        return;
      }

      // need to reframe this as the databse is changed
      
      // Check if the student-course mapping exists in active status
      // const checkMappingResponse = await axios.get(
      //   `${apiBaseUrl}/api/ce/oc/ActiveApplicationOnlineForValidation?student=${student}&course_code=${crname}`,
      //   { withCredentials: true }
      // );
      // const { exists } = checkMappingResponse.data;

      // if (exists) {
      //   alert(
      //     "The student is already registered for this course with an active status."
      //   );
      //   return;
      // }

      const formData = new FormData();
      const type = 1;
      const approval_status = 0;
      formData.append("course_1", courseId_1);
      formData.append("course_2", courseId_2);
      formData.append("student", student);
      formData.append("type", type);
      formData.append("academic_year_1", academic_year_course_1);
      formData.append("academic_year_2", academic_year_course_2);
      formData.append("semester_1", semester_course_1);
      formData.append("semester_2", semester_course_2);
      formData.append("start_date_1", fmt_start_date_course_1);
      formData.append("start_date_2", fmt_start_date_course_2);
      formData.append("end_date_1", fmt_end_date_course_1);
      formData.append("end_date_2", fmt_end_date_course_2);
      formData.append("exam_date_1", fmt_exam_date_course_1);
      formData.append("exam_date_2", fmt_exam_date_course_2);
      formData.append("mark_1", marks_course_1);
      formData.append("mark_2", marks_course_2);
      formData.append("certificate_url_1", cerf_url_course_1);
      formData.append("certificate_url_2", cerf_url_course_2);
      formData.append("certificateFile_1", selectedPdfC1);
      formData.append("certificateFile_2", selectedPdfC2);
      formData.append("marksheet",marksheet)
      formData.append("approval_status", approval_status);
      formData.append("certficate_type_1", cerf_type_course_1);
      formData.append("certficate_type_2", cerf_type_course_2);
      formData.append("electiveId_1", elective1_id);
      console.log( courseId_1,
        courseId_2,
        academic_year_course_1,
        academic_year_course_2,
        semester_course_1,
        semester_course_2,
        fmt_start_date_course_1,
        fmt_end_date_course_1,
        fmt_exam_date_course_1,
        fmt_start_date_course_2,
        fmt_end_date_course_2,
        fmt_exam_date_course_2,
        marks_course_1,
        marks_course_2,
        elective1_id,
        selectedPdfC1,
        selectedPdfC2,
        cerf_type_course_1,
        cerf_type_course_2,
        marksheet,
        cerf_url_course_1,
        cerf_url_course_2);
        const response = await axios.post(
          `${apiBaseUrl}/api/ce/oc/onlineApply/special/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
  
        console.log("Response:", response.data);
        if (response.status === 200) {
          console.log("Data successfully sent to the backend");
          setDataRespModal(true);
          setIsSuccess(true);
          setResponseMessage("Course Applied Successfully");
          // modifyPdf();
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error sending data to the backend:", error);
          setDataRespModal(true);
          setIsSuccess(false);
          setResponseMessage("Error While Applying the course");
        }
      }
  };

  // Final submission function for the multi course --- part 2 --- three 8 week courses
  const handleApplicationMultiCoursepart2 = async () => {
    try{
      if (
        !courseId_1 ||
        !courseId_2 ||
        !courseId_3 ||
        !academic_year_course_1 ||
        !academic_year_course_2 ||
        !academic_year_course_3 ||
        !semester_course_1 ||
        !semester_course_2 ||
        !semester_course_3 ||
        !fmt_start_date_course_1 ||
        !fmt_end_date_course_1 ||
        !fmt_exam_date_course_1 ||
        !fmt_start_date_course_2 ||
        !fmt_end_date_course_2 ||
        !fmt_exam_date_course_2 ||
        !fmt_start_date_course_3 ||
        !fmt_end_date_course_3 ||
        !fmt_exam_date_course_3 ||
        !marks_course_1 ||
        !marks_course_2 ||
        !marks_course_3 ||
        !elective1_id ||
        !elective2_id ||
        !selectedPdfC1 ||
        !selectedPdfC2 ||
        !selectedPdfC3 ||
        !cerf_type_course_1 ||
        !cerf_type_course_2 ||
        !cerf_type_course_3 ||
        !marksheet ||
        !cerf_url_course_1 ||
        !cerf_url_course_2 ||
        !cerf_url_course_3
      ) {
        alert("Fill out all the Fields");
        return;
      }
      // Fetch active applications
      const activeApplicationsResponse = await axios.get(
        `${apiBaseUrl}/api/ce/oc/AllActiveApplications?student=${student}`,
        { withCredentials: true }
      );

      const { total, nptel } = activeApplicationsResponse.data;

      // Check if total applications are less than 4
      if (total >= 3 || nptel>=1) {
        alert("You have reached the maximum number of applications allowed.");
        return;
      }

      const formData = new FormData();
      const type = 2;
      const approval_status = 0;
      formData.append("course_1", courseId_1);
      formData.append("course_2", courseId_2);
      formData.append("course_3", courseId_3);
      formData.append("student", student);
      formData.append("type", type);
      formData.append("academic_year_1", academic_year_course_1);
      formData.append("academic_year_2", academic_year_course_2);
      formData.append("academic_year_3", academic_year_course_3);
      formData.append("semester_1", semester_course_1);
      formData.append("semester_2", semester_course_2);
      formData.append("semester_3", semester_course_3);
      formData.append("start_date_1", fmt_start_date_course_1);
      formData.append("start_date_2", fmt_start_date_course_2);
      formData.append("start_date_3", fmt_start_date_course_3);
      formData.append("end_date_1", fmt_end_date_course_1);
      formData.append("end_date_2", fmt_end_date_course_2);
      formData.append("end_date_3", fmt_end_date_course_3);
      formData.append("exam_date_1", fmt_exam_date_course_1);
      formData.append("exam_date_2", fmt_exam_date_course_2);
      formData.append("exam_date_3", fmt_exam_date_course_3);
      formData.append("mark_1", marks_course_1);
      formData.append("mark_2", marks_course_2);
      formData.append("mark_3", marks_course_3);
      formData.append("certificate_url_1", cerf_url_course_1);
      formData.append("certificate_url_2", cerf_url_course_2);
      formData.append("certificate_url_3", cerf_url_course_3);
      formData.append("certificateFile_1", selectedPdfC1);
      formData.append("certificateFile_2", selectedPdfC2);
      formData.append("certificateFile_3", selectedPdfC3);
      formData.append("marksheet",marksheet)
      formData.append("approval_status", approval_status);
      formData.append("certficate_type_1", cerf_type_course_1);
      formData.append("certficate_type_2", cerf_type_course_2);
      formData.append("certficate_type_3", cerf_type_course_3);
      formData.append("electiveId_1", elective1_id);
      formData.append("electiveId_2", elective2_id);

      console.log( courseId_1,
        courseId_2,
        courseId_3,
        academic_year_course_1,
        academic_year_course_2,
        academic_year_course_3,
        semester_course_1,
        semester_course_2,
        semester_course_3,
        fmt_start_date_course_1,
        fmt_end_date_course_1,
        fmt_exam_date_course_1,
        fmt_start_date_course_2,
        fmt_end_date_course_2,
        fmt_exam_date_course_2,
        fmt_start_date_course_3,
        fmt_end_date_course_3,
        fmt_exam_date_course_3,
        marks_course_1,
        marks_course_2,
        marks_course_3,
        elective1_id,
        elective2_id,
        selectedPdfC1,
        selectedPdfC2,
        selectedPdfC3,
        cerf_type_course_1,
        cerf_type_course_2,
        cerf_type_course_3,
        marksheet,
        cerf_url_course_1,
        cerf_url_course_2,
        cerf_url_course_3,
      );
        const response = await axios.post(
          `${apiBaseUrl}/api/ce/oc/onlineApply/special/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
  
        console.log("Response:", response.data);
        if (response.status === 200) {
          console.log("Data successfully sent to the backend");
          setDataRespModal(true);
          setIsSuccess(true);
          setResponseMessage("Course Applied Successfully");
          // modifyPdf();
        }
    }
     catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error sending data to the backend:", error);
          setDataRespModal(true);
          setIsSuccess(false);
          setResponseMessage("Error While Applying the course");
        }
      }
  };

  return (
    <div className="frm">
      <div>
        <div className="nptelTextFields">
          <div>
            <div className="titdefault">
              <h4>Default Details</h4>
            </div>
            <div className="Default">
              <div className="dfinside">
                <div className="quesField">
                  <div className="inp">Student Name</div>
                  <div>
                    <Select
                      styles={customStyles}
                      className="textField"
                      value={[{ value: studentName, label: studentName }]}
                      isDisabled={true}
                    ></Select>
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Register Number</div>
                  <div>
                    <Select
                      className="textField"
                      styles={customStyles}
                      value={[{ value: registerNumber, label: registerNumber }]}
                      placeholder=""
                      isDisabled={true}
                    ></Select>
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Department</div>
                  <div>
                    <Select
                      className="textField"
                      styles={customStyles}
                      value={[{ value: department, label: department }]}
                      isDisabled={true}
                    ></Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="titdefault">
              <h4>Course Details</h4>
            </div>
            <div className="Default">
              <div className="dfinside">
                <div className="quesField">
                  <div className="inp">Course Platform</div>
                  <div>
                    <Select
                      onChange={handleCourse}
                      placeholder=""
                      styles={customStyles}
                      isSearchable={false}
                      className="textField"
                      options={CourseList}
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Type Of Application</div>
                  <div>
                    <Select
                      onChange={handleTypeOfApplicationSelected}
                      placeholder=""
                      isSearchable={false}
                      styles={customStyles}
                      className="textField"
                      // isDisabled={typeOptionDisabled}
                      isOptionDisabled={hanldeDisableOfTypeOfApplication}
                      options={[
                        {
                          value: 1,
                          label: "12 weeks course(Valid For 1 Exemption)",
                        },
                        { value: 2, label: "8 weeks course(Only Rewards)" },
                        { value: 3, label: "4 weeks course(Only Rewards)" },
                        {
                          value: 4,
                          label: "Two 8 weeks course(Valid For 1 Exemption)",
                        },
                        {
                          value: 5,
                          label: "Three 8 weeks course(Valid For 2 Exemption)",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Course Name</div>
                  <div>
                    <Select
                      onChange={handleCourseName}
                      styles={customStyles}
                      value={{
                        value: crname,
                        label: crname ? courseName : null,
                      }}
                      isSearchable={true}
                      className="textField"
                      options={CourseNameList}
                      placeholder=""
                    />
                  </div>
                </div>
                {creditOpen ? (
                  <>
                    <div className="quesField">
                      <div className="inp">Duration in Weeks</div>
                      <div>
                        <Select
                          onChange={handleWeek}
                          className="textField"
                          options={weekList}
                          placeholder=""
                          isSearchable={false}
                          styles={customStyles}
                          value={
                            weekList.length > 0
                              ? {
                                  value: weekList[0].value,
                                  label: weekList[0].label,
                                }
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="quesField">
                      <div className="inp">No.of.Credits</div>
                      <div>
                        <Select
                          onChange={handleCredits}
                          className="textField"
                          options={creditList}
                          isSearchable={false}
                          styles={customStyles}
                          placeholder=""
                          value={
                            creditList.length > 0
                              ? {
                                  value: creditList[0].value,
                                  label: creditList[0].label,
                                }
                              : null
                          }
                        />
                      </div>
                    </div>{" "}
                  </>
                ) : null}
                <div className="quesField">
                  <div className="inp">Academic Year</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleAcademicYear(
                          option,
                          SetSelectedAcademicYear,
                          setSelectedSem,
                          setSemesterOptions
                        )
                      }
                      placeholder=""
                      styles={customStyles}
                      isSearchable={false}
                      className="textField"
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
                      onChange={(option) => handleSem(option, setSelectedSem)}
                      styles={customStyles}
                      className="textField"
                      options={semesterOptions}
                      isSearchable={false}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Start Date</div>
                  <div>
                    <DatePicker
                      className="textField"
                      value={startDate}
                      onChange={(date) =>
                        handleStartDateChange(
                          date,
                          setStartDate,
                          setFmtStartDate,
                          endDate
                        )
                      }
                      styles={customStyles}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">End Date</div>
                  <div>
                    <DatePicker
                      className="textField"
                      styles={customStyles}
                      value={endDate}
                      onChange={(date) =>
                        handleEndDateChange(
                          date,
                          setEndDate,
                          setFmtEndDate,
                          startDate
                        )
                      }
                      isSearchable={false}
                      inputReadOnly={true}
                      height={50}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Exam Date</div>
                  <div>
                    <DatePicker
                      className="textField"
                      value={examDate}
                      styles={customStyles}
                      onChange={(date) =>
                        handleExamDate(
                          date,
                          setExamDate,
                          setFmtExamDate,
                          startDate
                        )
                      }
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Marks in Certificate</div>
                  <div>
                    <InputBox
                      type="number"
                      value={marks}
                      styles={customStyles}
                      className="inputbox"
                      onKeyDown={handleInputKeyDown}
                      onchange={(e) => handleMarksChange(e, setMarks)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Type Of Certificate</div>
                        <div>
                          <Select
                            onChange={(option)=>handleCertificateType(option,setCertificateType)}
                            className="textField"
                            styles={customStyles}
                            options={[
                              { value: 1, label: "Elite And Gold" },
                              { value: 2, label: "Elite" },
                              { value: 3, label: "Successfully Completed" },
                            ]}
                            isSearchable={false}
                            placeholder=""
                          />
                        </div>
                </div>
                {handleValidation() ? (
                  <div className="quesField">
                    <div className="inp">Do You Want Course Exemption</div>
                    <div>
                      <Select
                        value={{
                          value: opinion,
                          label:
                            opinion === 1 ? "Yes" : opinion === 0 ? "No" : "",
                        }}
                        onChange={handleOpinion}
                        className="textField"
                        styles={customStyles}
                        options={[
                          { value: 1, label: "Yes" },
                          { value: 0, label: "No" },
                        ]}
                        placeholder=""
                        isSearchable={false}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div></div>
            {openings && handleValidation() ? (
              <div>
                <div className="titdefault">
                  <h4>Apply For Course Exemption</h4>
                </div>
                <div className="Default">
                  <div className="dfinside">
                    <div className="exp">
                      <div className="quesField">
                        <div className="inp">Certificate URL</div>
                        <InputBox
                          type="text"
                          className="inputbox"
                          value={certificateUrlExp}
                          onchange={(event)=>handleCerfUrls(event,setCertificateUrlExp)}
                        />
                      </div>
                      <div className="quesField">
                        <div className="inp">Elective</div>
                        <Select
                          className="textField"
                          onChange={(option)=>handleElective(option,setElectiveId)}
                          options={ElectiveList}
                          styles={customStyles}
                          placeholder=""
                          menuPlacement="top"
                          isSearchable={false}
                        />
                      </div>
                      <div className="quesDoc">
                        <div className="inp">Upload Certificate </div>
                        <div className="Rp-btn-and-selected-file">
                          <label
                            htmlFor="pdf-upload"
                            className="pdf-upload-button"
                          >
                            Upload PDF
                            <input
                              id="pdf-upload"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChangeExp}
                              style={{ display: "none" }}
                            />
                          </label>
                          <div style={{ margin: "5px", marginRight: "50px" }}>
                            {" "}
                            {selectedPdfExp && (
                              <p className="selectedFileName">
                                {selectedPdfExp.name}
                              </p>
                            )}{" "}
                          </div>
                        </div>
                      </div>
                      <div className="quesDoc">
                        <div className="inp">Upload Marksheet</div>
                        <div className="Rp-btn-and-selected-file">
                          <label
                            htmlFor="pdf-upload-mark-sheet"
                            className="pdf-upload-button"
                          >
                            Upload As PDF
                            <input
                              id="pdf-upload-mark-sheet"
                              type="file"
                              accept=".pdf"
                              onChange={handleMarkSheet}
                              style={{ display: "none" }}
                            />
                          </label>
                          <div style={{ margin: "5px", marginRight: "50px" }}>
                            {" "}
                            {mark_sheet_12_week && (
                              <p className="selectedFileName">
                                {mark_sheet_12_week.name}
                              </p>
                            )}{" "}
                          </div>
                        </div>
                      </div>
                      <div className="EXPsubmits">
                        <button
                          className="expCancelBtn"
                          onClick={() => navigate("/1")}
                        >
                          Cancel
                        </button>
                        <button
                          className="expCreateBtn"
                          onClick={sendDataToBackendExp}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="titdefault">
                  <h4>Apply For Rewards</h4>
                  {/* <div> { alertingUser() && <div>You are not eligible for Course Excemption <button className='ReasonBtn' onClick={() => setReasonOpen(true)} >View Reason</button> </div>}</div> */}
                  <div>
                    {restrictingUser() ? (
                      <div>
                        You are Restricted to apply Course Exemption{" "}
                        <button
                          className="ReasonBtn"
                          onClick={() => setRestrictModal(true)}
                        >
                          View Reason
                        </button>{" "}
                      </div>
                    ) : alertingUser() ? (
                      <div>
                        You are not eligible for Course Exemption{" "}
                        <button
                          className="ReasonBtn"
                          onClick={() => setReasonOpen(true)}
                        >
                          View Reason
                        </button>{" "}
                      </div>
                    ) : null}{" "}
                  </div>
                </div>
                <div className="Default">
                  <div className="dfinside">
                    <div className="rp">
                      <div className="quesField">
                        <div className="inp">Certificate URL</div>
                        <div>
                          <InputBox
                            type="text"
                            className="inputbox"
                            value={certificateUrlRp}
                            onchange={(event)=>handleCerfUrls(event,setCertificateUrlRp)}
                          />
                        </div>
                      </div>
                      <div className="quesDoc">
                        <div className="inp">Upload Certificate </div>
                        <div className="Rp-btn-and-selected-file">
                          <label
                            htmlFor="pdf-upload"
                            className="pdf-upload-button"
                          >
                            Upload PDF
                            <input
                              id="pdf-upload"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChangeRp}
                              style={{ display: "none" }}
                            />
                          </label>
                          <div style={{ margin: "5px", marginRight: "50px" }}>
                            {" "}
                            {selectedPdfRp && (
                              <p className="selectedFileName">
                                {selectedPdfRp.name}
                              </p>
                            )}{" "}
                          </div>
                        </div>
                      </div>
                      <div className="RPsubmits">
                        <button
                          className="expCancelBtn"
                          onClick={() => navigate("/1")}
                        >
                          Cancel
                        </button>
                        <button
                          className="expCreateBtn"
                          onClick={sendDataToBackendRp}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Alerting the user */}
      <Modal open={reasonOpen} onClose={() => setReasonOpen(false)}>
        <Box sx={style}>
          <div className="reasonModal">
            <div className="DelTit">
              Warning{" "}
              <WarningIcon
                className="warningIcon"
                style={{ color: "rgb(250, 41, 41)" }}
              />
            </div>
            <hr style={{ marginBottom: "10px" }} />
            <div>
              {selectedCredits < validCredit && (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "5px" }}
                >
                  <div style={{ marginTop: "8px" }}>
                    <FiberManualRecordOutlinedIcon />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    You are not Having Sufficient Credits
                  </div>
                </div>
              )}
              {/* {selectedSem < validSemester && (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "5px" }}
                >
                  <div style={{ marginTop: "8px" }}>
                    <FiberManualRecordOutlinedIcon />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    Excemption is valid only above 4th semester
                  </div>
                </div>
              )} */}
              {selectedWeek < validWeek && (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "5px" }}
                >
                  <div style={{ marginTop: "8px" }}>
                    <FiberManualRecordOutlinedIcon />
                  </div>
                  <div style={{ marginTop: "5px" }}>
                    Your Course is not a 12 week course
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>

      {/* Response Modal for Displaying failure or success*/}
      <Modal open={dataRespModal} onClose={handleRespModalClose}>
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

      {/* Modal for Restricting the user */}
      <Modal open={restrictModal} onClose={() => setRestrictModal(false)}>
        <Box sx={style}>
          <div>
            {nptelActive === 2 && nptelActive === approvedNptel ? (
              <div className="success">
                <CheckCircleIcon
                  style={{ color: "green", marginRight: "2px" }}
                />
                <div style={{ marginTop: "10px" }}>
                  You have completed 2 Course Excemption in Online Course
                </div>
              </div>
            ) : nptelActive === 2 && !(nptelActive === approvedNptel) ? (
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
                  until completion of your approval status you cannot able to
                  apply again for excemption...
                </div>
                <div style={{ marginTop: "10px" }}>
                  <button className="btnApprove" onClick={() => navigate("/1")}>
                    View Status
                  </button>
                </div>
              </div>
            ) : totalActive === 4 && totalActive === totalExemption ? (
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
                  You have Already completed the 4 Course Exemption check the
                  Dashboard
                </div>
              </div>
            ) : (
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

      {/* Multi Step Modal*/}
      <Modal open={multiStepModalOpen} onClose={handleCloseMultiStepModal} >
        <Box sx={style3}>
          <div>
            <div className="DelTit">Course Details</div>
            <hr style={{ marginTop: "20px" }} />
            <div className="stepperDivInMultiForm">
              <StepperWithContent
                status={step}
                data={switchingStages === 1 ? stages1 : stages2}
              />
            </div>

            {/* Course 1 */}
            <Collapse in={step === 0} collapsedSize={0}>
              <div className="multiStepFormContent">
                <div className="quesField">
                  <div className="inp">Course Name</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleCourseSelect(option.value, setCourseId_1)
                      }
                      styles={customStyles}
                      value={
                        courseId_1
                          ? {
                              value: courseId_1,
                              label: courselist.find(
                                (course) => course.id === courseId_1
                              )?.name,
                            }
                          : null
                      }
                      isSearchable={true}
                      className="textFieldMultiForm"
                      options={filterOptions(courseId_1)}
                      placeholder="Select Course 1"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Duration in Weeks</div>
                  <div>
                    <Select
                      onChange={handleWeek}
                      className="textFieldMultiForm"
                      options={weekList}
                      placeholder=""
                      isSearchable={false}
                      value={
                        weekList.length > 0
                          ? {
                              value: weekList[0].value,
                              label: weekList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">No.of.Credits</div>
                  <div>
                    <Select
                      onChange={handleCredits}
                      className="textFieldMultiForm"
                      options={creditList}
                      isSearchable={false}
                      placeholder=""
                      value={
                        creditList.length > 0
                          ? {
                              value: creditList[0].value,
                              label: creditList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Academic Year</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleAcademicYear(
                          option,
                          setAcademic_year_course_1,
                          setSemester_course_1,
                          set_semester_options_course_1
                        )
                      }
                      placeholder=""
                      isSearchable={false}
                      className="textFieldMultiForm"
                      options={AcademicYearList}
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Semester</div>
                  <div>
                    <Select
                      value={{
                        value: semester_course_1,
                        label: semester_course_1
                          ? `Semester ${semester_course_1}`
                          : "",
                      }}
                      onChange={(option) =>
                        handleSem(option, setSemester_course_1)
                      }
                      className="textFieldMultiForm"
                      options={semester_options_course_1}
                      isSearchable={false}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Start Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={start_date_course_1}
                      onChange={(date) =>
                        handleStartDateChange(
                          date,
                          set_start_date_course_1,
                          set_fmt_start_date_course_1,
                          end_date_course_1
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">End Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={end_date_course_1}
                      onChange={(date) =>
                        handleEndDateChange(
                          date,
                          set_end_date_course_1,
                          set_fmt_end_date_course_1,
                          start_date_course_1
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      height={50}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Exam Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={exam_date_course_1}
                      onChange={(date) =>
                        handleExamDate(
                          date,
                          set_exam_date_course_1,
                          set_fmt_exam_date_course_1,
                          start_date_course_1
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Type Of Certificate</div>
                        <div>
                          <Select
                            onChange={(option)=>handleCertificateType(option,set_cerf_type_course_1)}
                            className="textFieldMultiForm"
                            styles={customStyles}
                            options={[
                              { value: 1, label: "Elite And Gold" },
                              { value: 2, label: "Elite" },
                              { value: 3, label: "Successfully Completed" },
                            ]}
                            isSearchable={false}
                            placeholder=""
                          />
                        </div>
                      </div>
                <div className="quesField">
                  <div className="inp">Marks in Certificate</div>
                  <div>
                    <InputBox
                      type="number"
                      className="inputNumberMultiForm"
                      value={marks_course_1}
                      onKeyDown={handleInputKeyDown}
                      onchange={(e) => handleMarksChange(e, set_marks_course_1)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Certificate URL</div>
                        <div>
                          <InputBox
                            type="text"
                            className="inputNumberMultiForm"
                            value={cerf_url_course_1}
                            onchange={(e)=>handleCerfUrls(e,set_cerf_url_course_1)}
                          />
                        </div>
                      </div>
                <div className="quesField">
                  <div className="inp">Upload Certificate </div>
                  <div className="Rp-btn-and-selected-file-specialCourse">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(event) =>
                          handleSpcialCoursesPdf(event, setSelectedPdfC1)
                        }
                      />
                    {/* <div style={{ margin: "5px", marginRight: "50px" }}>
                      {" "}
                      {selectedPdfC1 ? (
                        <p className="selectedFileName">{selectedPdfC1.name}</p>
                      ) : (
                        <p className="selectedFileName">No file selected</p>
                      )}{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </Collapse>

            {/* Course 2 */}
            <Collapse in={step === 1} collapsedSize={0}>
              <div className="multiStepFormContent">
                <div className="quesField">
                  <div className="inp">Course Name</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleCourseSelect(option.value, setCourseId_2)
                      }
                      styles={customStyles}
                      value={
                        courseId_2
                          ? {
                              value: courseId_2,
                              label: courselist.find(
                                (course) => course.id === courseId_2
                              )?.name,
                            }
                          : null
                      }
                      isSearchable={true}
                      className="textFieldMultiForm"
                      options={filterOptions(courseId_2)}
                      placeholder="Select Course 2"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Duration in Weeks</div>
                  <div>
                    <Select
                      onChange={handleWeek}
                      className="textFieldMultiForm"
                      options={weekList}
                      placeholder=""
                      isSearchable={false}
                      value={
                        weekList.length > 0
                          ? {
                              value: weekList[0].value,
                              label: weekList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">No.of.Credits</div>
                  <div>
                    <Select
                      onChange={handleCredits}
                      className="textFieldMultiForm"
                      options={creditList}
                      isSearchable={false}
                      placeholder=""
                      value={
                        creditList.length > 0
                          ? {
                              value: creditList[0].value,
                              label: creditList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Academic Year</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleAcademicYear(
                          option,
                          setAcademic_year_course_2,
                          setSemester_course_2,
                          set_semester_options_course_2
                        )
                      }
                      placeholder=""
                      isSearchable={false}
                      className="textFieldMultiForm"
                      options={AcademicYearList}
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Semester</div>
                  <div>
                    <Select
                      value={{
                        value: semester_course_2,
                        label: semester_course_2
                          ? `Semester ${semester_course_2}`
                          : "",
                      }}
                      onChange={(option) =>
                        handleSem(option, setSemester_course_2)
                      }
                      className="textFieldMultiForm"
                      options={semester_options_course_2}
                      isSearchable={false}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Start Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={start_date_course_2}
                      onChange={(date) =>
                        handleStartDateChange(
                          date,
                          set_start_date_course_2,
                          set_fmt_start_date_course_2,
                          end_date_course_2
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">End Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={end_date_course_2}
                      onChange={(date) =>
                        handleEndDateChange(
                          date,
                          set_end_date_course_2,
                          set_fmt_end_date_course_2,
                          start_date_course_2
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      height={50}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Exam Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={exam_date_course_2}
                      onChange={(date) =>
                        handleExamDate(
                          date,
                          set_exam_date_course_2,
                          set_fmt_exam_date_course_2,
                          start_date_course_2
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Type Of Certificate</div>
                        <div>
                          <Select
                            onChange={(option)=>handleCertificateType(option,set_cerf_type_course_2)}
                            className="textFieldMultiForm"
                            styles={customStyles}
                            options={[
                              { value: 1, label: "Elite And Gold" },
                              { value: 2, label: "Elite" },
                              { value: 3, label: "Successfully Completed" },
                            ]}
                            isSearchable={false}
                            placeholder=""
                          />
                        </div>
                      </div>
                <div className="quesField">
                  <div className="inp">Marks in Certificate</div>
                  <div>
                    <InputBox
                      type="number"
                      className="inputNumberMultiForm"
                      value={marks_course_2}
                      onKeyDown={handleInputKeyDown}
                      onchange={(e) => handleMarksChange(e, set_marks_course_2)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Certificate URL</div>
                        <div>
                          <InputBox
                            type="text"
                            className="inputNumberMultiForm"
                            value={cerf_url_course_2}
                            onchange={(event)=>handleCerfUrls(event,set_cerf_url_course_2)}
                          />
                        </div>
                      </div>
                <div className="quesField">
                  <div className="inp">Upload Certificate </div>
                  <div className="Rp-btn-and-selected-file-specialCourse">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(event) =>
                          handleSpcialCoursesPdf(event, setSelectedPdfC2)
                        }
                      />
                    {/* <div style={{ margin: "5px", marginRight: "50px" }}>
                      {" "}
                      {selectedPdfC2 ? (
                        <p className="selectedFileName">{selectedPdfC2.name}</p>
                      ) : (
                        <p className="selectedFileName">No file selected</p>
                      )}{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </Collapse>

            {/* Course 3 */}
            <Collapse in={switchingStages != 1 && step === 2}>
              <div className="multiStepFormContent">
                <div className="quesField">
                  <div className="inp">Course Name</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleCourseSelect(option.value, setCourseId_3)
                      }
                      styles={customStyles}
                      value={
                        courseId_3
                          ? {
                              value: courseId_3,
                              label: courselist.find(
                                (course) => course.id === courseId_3
                              )?.name,
                            }
                          : null
                      }
                      isSearchable={true}
                      className="textFieldMultiForm"
                      options={filterOptions(courseId_3)}
                      placeholder="Select Course 3"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Duration in Weeks</div>
                  <div>
                    <Select
                      onChange={handleWeek}
                      className="textFieldMultiForm"
                      options={weekList}
                      placeholder=""
                      isSearchable={false}
                      value={
                        weekList.length > 0
                          ? {
                              value: weekList[0].value,
                              label: weekList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">No.of.Credits</div>
                  <div>
                    <Select
                      onChange={handleCredits}
                      className="textFieldMultiForm"
                      options={creditList}
                      isSearchable={false}
                      placeholder=""
                      value={
                        creditList.length > 0
                          ? {
                              value: creditList[0].value,
                              label: creditList[0].label,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Academic Year</div>
                  <div>
                    <Select
                      onChange={(option) =>
                        handleAcademicYear(
                          option,
                          setAcademic_year_course_3,
                          setSemester_course_3,
                          set_semester_options_course_3
                        )
                      }
                      placeholder=""
                      isSearchable={false}
                      className="textFieldMultiForm"
                      options={AcademicYearList}
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Semester</div>
                  <div>
                    <Select
                      value={{
                        value: semester_course_3,
                        label: semester_course_3
                          ? `Semester ${semester_course_3}`
                          : "",
                      }}
                      onChange={(option) =>
                        handleSem(option, setSemester_course_3)
                      }
                      className="textFieldMultiForm"
                      options={semester_options_course_3}
                      isSearchable={false}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Start Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={start_date_course_3}
                      onChange={(date) =>
                        handleStartDateChange(
                          date,
                          set_start_date_course_3,
                          set_fmt_start_date_course_3,
                          end_date_course_3
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">End Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={end_date_course_3}
                      onChange={(date) =>
                        handleEndDateChange(
                          date,
                          set_end_date_course_3,
                          set_fmt_end_date_course_3,
                          start_date_course_3
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      height={50}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                  <div className="inp">Exam Date</div>
                  <div>
                    <DatePicker
                      className="textFieldMultiForm"
                      value={exam_date_course_3}
                      onChange={(date) =>
                        handleExamDate(
                          date,
                          set_exam_date_course_3,
                          set_fmt_exam_date_course_3,
                          start_date_course_3
                        )
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                      isSearchable={false}
                      inputReadOnly={true}
                      size="large"
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Type Of Certificate</div>
                        <div>
                          <Select
                            onChange={(option)=>handleCertificateType(option,set_cerf_type_course_3)}
                            className="textFieldMultiForm"
                            styles={customStyles}
                            options={[
                              { value: 1, label: "Elite And Gold" },
                              { value: 2, label: "Elite" },
                              { value: 3, label: "Successfully Completed" },
                            ]}
                            isSearchable={false}
                            placeholder=""
                          />
                        </div>
                </div>
                <div className="quesField">
                  <div className="inp">Marks in Certificate</div>
                  <div>
                    <InputBox
                      type="number"
                      className="inputNumberMultiForm"
                      value={marks_course_3}
                      onKeyDown={handleInputKeyDown}
                      onchange={(e) => handleMarksChange(e, set_marks_course_3)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="quesField">
                        <div className="inp">Certificate URL</div>
                        <div>
                          <InputBox
                            type="text"
                            className="inputNumberMultiForm"
                            value={cerf_url_course_3}
                            onchange={(event)=>handleCerfUrls(event,set_cerf_url_course_3)}
                          />
                        </div>
                      </div>
                <div className="quesField">
                  <div className="inp">Upload Certificate </div>
                  <div className="Rp-btn-and-selected-file-specialCourse">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(event) =>
                          handleSpcialCoursesPdf(event, setSelectedPdfC3)
                        }
                      />
                    {/* <div style={{ margin: "5px", marginRight: "50px" }}>
                      {" "}
                      {selectedPdfC3 ? (
                        <p className="selectedFileName">{selectedPdfC3.name}</p>
                      ) : (
                        <p className="selectedFileName">No file selected</p>
                      )}{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </Collapse>

            {/* Elctive Selection */}
            <Collapse
              in={
                switchingStages === 1
                  ? stages1.length - 1 === step
                  : stages2.length - 1 === step
              }
              collapsedSize={0}
            >
              <div className="multiStepFormContent">
                <div className="quesField">
                  <div className="inp">Elective 1</div>
                  <Select
                    className="textFieldMultiForm"
                    onChange={(option)=>handleElective(option,setElective1_id)}
                    options={ElectiveList}
                    placeholder=""
                    isSearchable={false}
                  />
                </div>
                {switchingStages != 1 && (
                  <div className="quesField">
                    <div className="inp">Elective 2</div>
                    <Select
                      className="textFieldMultiForm"
                      onChange={(option)=>handleElective(option,setElective2_id)}
                      options={ElectiveList}
                      placeholder=""
                      isSearchable={false}
                    />
                  </div>
                )}
                <div className="quesField">
                  <div className="inp">Upload Proof</div>
                  <div className="Rp-btn-and-selected-file-specialCourse">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(event) =>
                          handleSpcialCoursesPdf(event, setMarksheet)
                        }
                      />
                    {/* <div style={{ margin: "5px", marginRight: "50px" }}>
                      {" "}
                      {selectedPdfC3 ? (
                        <p className="selectedFileName">{selectedPdfC3.name}</p>
                      ) : (
                        <p className="selectedFileName">No file selected</p>
                      )}{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </Collapse>

            <hr style={{ marginTop: "30px" }} />
            <div className="MultiFormButtonDiv">
              {step > 0 ? (
                <button
                  className="MultiFormBackBUtton"
                  onClick={handleStepDecrease}
                >
                  Go Back
                </button>
              ) : (
                <button
                  className="MultiFormBackBUtton"
                  onClick={handleStepDecrease}
                  disabled={true}
                >
                  Go Back
                </button>
              )}
              {!(switchingStages === 1
                ? stages1.length - 1 === step
                : stages2.length - 1 === step) && (
                <button
                  className="MultiFormNextButton"
                  onClick={handleStepIncrease}
                >
                  Next
                </button>
              )}
              {switchingStages === 1 && stages1.length - 1 === step && (
                <button
                  className="MultiFormNextButton"
                  onClick={handleApplicationMultiCoursepart1}
                >
                  Apply 2 courses
                </button>
              )}
              {switchingStages != 1 && stages2.length - 1 === step && (
                <button
                  className="MultiFormNextButton"
                  onClick={handleApplicationMultiCoursepart2}
                >
                  Apply 3 courses
                </button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OnlineForm;
