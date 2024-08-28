import React, { useEffect, useState } from "react";
import "./styles/home.css";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../../api/api";
import apiLoginHost from "../login/LoginApi";
import HomeCard from "../../components/homecard/HomeCard";
import axios from "axios";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import rules from "/rules.png";
import TreeStructure from "./stuffs/TreeStructure";

const Home = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [student, setStudent] = useState("7376222AD156");
  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [approvedAddon, setApprovedAddon] = useState(null);
  const [approvedNptel, setApprovedNptel] = useState(null);
  const [approvedOneCredit, setApprovedOncredit] = useState(null);
  const [approvedIntern, setApprovedIntern] = useState(null);
  const [totalApproved, setTotalApproved] = useState(null);
  const [approvedHonor, setApprovedHonor] = useState(null);
  const [approvedMinor, setApprovedMinor] = useState(null);

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

  // Function to fetch the current user name , register number etc form logged in details
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
          // need to set the setStudent state ------ final setting process
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // fetching all the main routes as main blocks (online course, one credit, internship, addon)
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/ce`, {
        withCredentials: true,
      })
      .then((response) => {
        setCourseData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized, logging out:", error);
          handleLogout(); // Call logout function
        } else {
          console.error("Error fetching course data:", error);
        }
      });
  }, []);

  useEffect(() => {
    fetchApprovedStatus();
  }, []);

  // function to fetch approved status
  const fetchApprovedStatus = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/ce/oc/ApprovedStatusAll?student=${student}`,
        {
          withCredentials: true,
        }
      );
      const jsonData = response.data;
      setApprovedAddon(jsonData.approved_addon);
      setApprovedIntern(jsonData.approved_internship);
      setApprovedOncredit(jsonData.approved_oneCredit);
      setApprovedNptel(jsonData.approved_nptel);
      setTotalApproved(jsonData.approved_total);
      setApprovedHonor(jsonData.approved_honor);
      setApprovedMinor(jsonData.approved_minor);
      console.log(jsonData);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.log("Error while fetching approved Students", error);
      }
    }
  };

  return (
    <div className="homeMainDiv">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="MainTit">Course Exemption</div>
        <div>
          <div className="content-cards">
            {courseData.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/${course.id}`)}
                style={{ cursor: "pointer" }}
              >
                <HomeCard
                  title={course.name}
                  image={`${apiBaseUrl}/${course.image_path}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="divPart2">
        <div className="douhnutMainDiv">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="button">Exeption Details</div>
            <div className="doughnut">
              <div className="gauge">
                <Gauge
                  value={totalApproved}
                  valueMax={4}
                  startAngle={0}
                  endAngle={360}
                  height={245}
                  cornerRadius="50%"
                  className="gaugeComponent"
                  
                  text={({ value, valueMax }) => `${value} / ${valueMax}`}
                  sx={(theme) => ({
                    // [`& .${gaugeClasses.valueText}`]: {
                    //   fontFamily:"cursive"
                    // },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill:'var(--secondaryBlue)'
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: 'var(--Bordercolor)',
                    },
                    [`& .${gaugeClasses.valueText}`]: {
                      fontFamily: 'cursive',
                      fill:'var(--secondaryBlue)',
                    },
                  })}
                />
              </div>
              <div className="expStatus">
                <div className="titExempted">Exempted in The Following..</div>
                <div className="expOptions">
                  <div>
                    <div className="NptelExp">NPTEL - {approvedNptel}</div>
                    <div className="OneCreditExp">
                      One Credit - {approvedOneCredit}
                    </div>
                  </div>
                  <div>
                    <div className="addOnExp">
                      AddOn - {approvedAddon + approvedHonor + approvedMinor}
                    </div>
                    <div className="addOnExp">
                      Internship - {approvedIntern}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="button">Rules And Regulations</div>
            <div className="rulesMainDiv">
              <div className="treeHome">
                <TreeStructure />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
