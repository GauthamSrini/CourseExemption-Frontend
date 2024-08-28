import React, { useEffect, useState } from "react";
import "./horizontalNavbar.css";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CustomizedSwitches from "./toggleTheme";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BasicMenu from "../../allPages/CourseException/stuffs/BasicMenu";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';
import apiLoginHost from "../../allPages/login/LoginApi";

function HorizontalNavbar({ toggleVerticalNavbar }) {
  const [studentName,setStudentName] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiLoginHost}/api/user-data`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStudentName(data.name);
          console.log(data.name);
          
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="total-h-navbar">
      <div className="website-name">
        <h3 className="iqac-title">IQAC</h3>
        <div className="menu-open-icon" onClick={toggleVerticalNavbar}>
          <MenuRoundedIcon
            className="h-nav-menu-icon"
            sx={{ fontSize: 30 }}
          ></MenuRoundedIcon>
        </div>
      </div>

      <div>
        <nav>
          <ul className="nav-list-items">
            <li>
              <CustomizedSwitches 
              />
            </li>
            <li>
              <BasicMenu
                className="h-nav-icons"
                sx={{ fontSize: 32 }}
              ></BasicMenu>
            </li>
            {/* <li>
            <Tooltip title={studentName}>
            <Avatar sx={{margin:"5px",width:30,height:30,marginRight:"10px",backgroundColor:"var(--primaryBlue)",fontFamily:"sans-serif"}} alt={studentName} src="/static/images/avatar/1.jpg" />
            </Tooltip>
            </li> */}
            {/* <li>
              <SettingsRoundedIcon
                className="h-nav-icons"
                sx={{ fontSize: 32 }}
              ></SettingsRoundedIcon>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default HorizontalNavbar;