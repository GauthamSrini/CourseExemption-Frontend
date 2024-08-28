import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import apiLoginHost from "../../login/LoginApi";
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); 
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiLoginHost}/logout`, {}, { withCredentials: true });
      // Redirect to login page or home page after successful logout
      navigate('/'); // or '/home' if you have a home page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ minWidth: 'auto'
        }} // Ensure the button size is appropriate for the icon
      >
        {/* <AccountCircleRoundedIcon
          className="h-nav-icons"
          sx={{ fontSize: 32 }}
        /> */}
        <Avatar sx={{width:30,height:30,backgroundColor:"var(--primaryBlue)",fontFamily:"sans-serif"}} alt={studentName} src="/static/images/avatar/1.jpg" />
        <div style={{marginLeft:"10px"}}>{studentName}</div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogout} className="Menu">Logout</MenuItem>
      </Menu>
    </div>
  );
}