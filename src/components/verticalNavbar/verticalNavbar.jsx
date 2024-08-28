
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import './verticalNavbar.css';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BookIcon from '@mui/icons-material/Book';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ListIcon from '@mui/icons-material/List';
import BentoIcon from '@mui/icons-material/Bento';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';

const VerticalNavbar = ({ onClose }) => {
  const [resources, setResources] = useState([]);
  const [activeLink, setActiveLink] = useState(null);
  const [divOpen, setDivOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [addOnOpen, setAddOnOpen] = useState(false);
  const [internOpen, setInternOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles-resources', {
          withCredentials: true, // Important to send cookies
        });
        setResources(response.data || []); // Ensure resources is always an array
        console.log('Resources fetched:', response.data); // Debugging line to see the fetched resources
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const handleLinkClick = (pathname) => {
    onClose();
    setActiveLink(pathname);
  };

  const handleOpen = () => setDivOpen(!divOpen);
  const handleCreditOpen = () => setCreditOpen(!creditOpen);
  const handleAddOnOpen = () => setAddOnOpen(!addOnOpen);
  const handleInternOpen = () => setInternOpen(!internOpen);

  // Define paths for each category
  const onlineCoursePaths = [
    '/courseApproval', '/OnlineReports', '/OnlineRejected', '/OnlineUpload', '/OnlineCourseList'
  ];
  const oneCreditPaths = [
    '/OneCreditPending', '/OneCreditApproved', '/OneCreditRejected', '/OneCreditUpload', '/OneCreditMappings'
  ];
  const addOnPaths = [
    '/AddonPending', '/AddonApproved', '/AddonRejected', '/AddOnUpload', '/HonorMinorUpload', '/ListOfStudentsMappings'
  ];
  const internshipPaths = [
    '/InternPending', '/InternApproved', '/InternRejected', '/InternUpload', '/InternCompanyList'
  ];

  // Helper function to check if any resource path is accessible
  const hasAccess = (paths) => resources.some(resource => paths.includes(resource.path));

  return (
    <div className="vertical-navbar">
      <div>
      <ul>
        <p className='subtitle'>Home</p>
        <li className={`menu-items ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={() => handleLinkClick('/dashboard')}>
          <Link to="/dashboard" className="link-style">
            <DashboardRoundedIcon className='nav-icons' />
            Dashboard
          </Link>
        </li>
        <p className='subtitle'>Course Exemption</p>
        {hasAccess(['/courseExcp']) && (
          <li className={`menu-items ${activeLink === '/courseExcp' ? 'active' : ''}`} onClick={() => handleLinkClick('/courseExcp')}>
            <Link to="/courseExcp" className="link-style">
              <DashboardRoundedIcon className='nav-icons' />
              Course Exemption
            </Link>
          </li>
        )}
       
       {hasAccess(onlineCoursePaths) && (
          <>
            <li className={`menu-item ${divOpen ? 'active' : ''}`} onClick={handleOpen}>
              <Link className="link-style">
              <BookIcon className='nav-icons' />
                Online Course{divOpen ? <KeyboardArrowUpIcon sx={{marginLeft:"22%",color:"var(--navIconDefault)"}} /> : <KeyboardArrowDownIcon sx={{marginLeft:"22%",color:"var(--navIconDefault)"}} />}
              </Link>
            </li>
            {divOpen && (
              <div className='options'>
                {onlineCoursePaths.map(path => {
                  const resource = resources.find(resource => resource.path === path);
                  return resource && (
                    <div key={resource.path} className={`menu-items ${activeLink === resource.path ? 'active' : ''}`} onClick={() => handleLinkClick(resource.path)}>
                      <Link to={resource.path} className="link-style-down">
                        {activeLink === resource.path ? <FiberManualRecordIcon  sx={{width:"18px",height:"18px"}} className='nav-icons'/>:<FiberManualRecordOutlinedIcon sx={{width:"18px",height:"18px"}} className='nav-icons' />}
                        {resource.resource_name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {hasAccess(oneCreditPaths) && (
          <>
            <li className={`menu-item ${creditOpen ? 'active' : ''}`} onClick={handleCreditOpen}>
              <Link className="link-style">
                <LocalLibraryRoundedIcon className='nav-icons' />
                One Credit {creditOpen ? <KeyboardArrowUpIcon sx={{marginLeft:"32%",color:"var(--navIconDefault)"}}  /> : <KeyboardArrowDownIcon sx={{marginLeft:"32%",color:"var(--navIconDefault)"}} />}
              </Link>
            </li>
            {creditOpen && (
              <div className='options'>
                {oneCreditPaths.map(path => {
                  const resource = resources.find(resource => resource.path === path);
                  return resource && (
                    <div key={resource.path} className={`menu-items ${activeLink === resource.path ? 'active' : ''}`} onClick={() => handleLinkClick(resource.path)}>
                      <Link to={resource.path} className="link-style-down">
                      {activeLink === resource.path ? <FiberManualRecordIcon  sx={{width:"18px",height:"18px"}} className='nav-icons'/>:<FiberManualRecordOutlinedIcon sx={{width:"18px",height:"18px"}} className='nav-icons' />}
                        {resource.resource_name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {hasAccess(addOnPaths) && (
          <>
            <li className={`menu-item ${addOnOpen ? 'active' : ''}`} onClick={handleAddOnOpen}>
              <Link className="link-style">
                <AutoStoriesIcon className='nav-icons' />
                Add-On/HonorMinor {addOnOpen ? <KeyboardArrowUpIcon sx={{marginLeft:"2%",color:"var(--navIconDefault)"}} /> : <KeyboardArrowDownIcon sx={{marginLeft:"2%",color:"var(--navIconDefault)"}} />}
              </Link>
            </li>
            {addOnOpen && (
              <div className='options'>
                {addOnPaths.map(path => {
                  const resource = resources.find(resource => resource.path === path);
                  return resource && (
                    <div key={resource.path} className={`menu-items ${activeLink === resource.path ? 'active' : ''}`} onClick={() => handleLinkClick(resource.path)}>
                      <Link to={resource.path} className="link-style-down">
                      {activeLink === resource.path ? <FiberManualRecordIcon  sx={{width:"18px",height:"18px"}} className='nav-icons'/>:<FiberManualRecordOutlinedIcon sx={{width:"18px",height:"18px"}} className='nav-icons' />}
                        {resource.resource_name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {hasAccess(internshipPaths) && (
          <>
            <li className={`menu-item ${internOpen ? 'active' : ''}`} onClick={handleInternOpen}>
              <Link className="link-style">
                <Diversity3RoundedIcon className='nav-icons' />
                Internships {internOpen ? <KeyboardArrowUpIcon sx={{marginLeft:"32%",color:"var(--navIconDefault)"}}/> : <KeyboardArrowDownIcon sx={{marginLeft:"32%",color:"var(--navIconDefault)"}}/>}
              </Link>
            </li>
            {internOpen && (
              <div className='options'>
                {internshipPaths.map(path => {
                  const resource = resources.find(resource => resource.path === path);
                  return resource && (
                    <div key={resource.path} className={`menu-items ${activeLink === resource.path ? 'active' : ''}`} onClick={() => handleLinkClick(resource.path)}>
                      <Link to={resource.path} className="link-style-down">
                      {activeLink === resource.path ? <FiberManualRecordIcon  sx={{width:"18px",height:"18px"}} className='nav-icons'/>:<FiberManualRecordOutlinedIcon sx={{width:"18px",height:"18px"}} className='nav-icons' />}
                        {resource.resource_name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
         {hasAccess(['/OveralReports']) && (
          <li className={`menu-items ${activeLink === '/OveralReports' ? 'active' : ''}`} onClick={() => handleLinkClick('/OveralReports')}>
            <Link to="/OveralReports" className="link-style">
              <AssessmentIcon className='nav-icons' />
              Overall Reports
            </Link>
          </li>
        )}
      </ul>
      </div>
      <div>
       <img src='/logo.svg' width={245} height={200}></img>
       </div>
    </div>
  );
};

export default VerticalNavbar;

