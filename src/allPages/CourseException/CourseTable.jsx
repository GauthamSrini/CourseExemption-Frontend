import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import "./styles/table.css";
import { Box } from "@mui/material";
import { apiBaseUrl } from "../../api/api";
import axios from 'axios';
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import BasicModal from './stuffs/BasicModal';

const CourseTable = () => {
  const [data, setData] = useState([]);
  const [student, setStudent] = useState("7376222AD156");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [approvalMembers, setApprovalMembers] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${apiBaseUrl}/api/ce/oc/registered?student=${student}`, { withCredentials: true })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    ApprovalMembers();
  }, []);

  const ApprovalMembers = async () => {
    try {
      const response1 = await axios.get(
        `${apiBaseUrl}/api/ce/oc/OnlineCourseApprovalMembers`,
        {
          withCredentials: true,
        }
      );
      const jsonData1 = response1.data;
      const members = jsonData1.map((item) => item.members);
      members.push("Approved");
      setApprovalMembers(members);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, logging out:", error);
        handleLogout(); // Call logout function
      } else {
        console.log("error in fetching approvalMembers", error);
        setError(error.message);
      }
    }
  };

  // Define table columns for the main record
  const columns = [
    {
      title: 'Course Type',
      dataIndex: 'platform_name1',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name1',
    },
    {
      title: 'Academic Year',
      dataIndex: 'academic_year1',
    },
    {
      title: 'Semester',
      dataIndex: 'semester1',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date_1',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date_1',
    },
    {
        title: 'View',
        dataIndex: 'view',
        render: (text, record) => (
          <Box
            sx={{ color: "var(--text-black)" }}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedRowData(record)} // Set the selected row data on click
          >
            <RemoveRedEyeOutlinedIcon />
          </Box>
        ),
      },
    {
        title: 'Status',
        dataIndex: 'approval_status',
        render: (status) => {
          let color;
          let text;
  
          switch (status) {
            case 0:
            case 1:
            case 2:
              color = 'grey';
              text = 'Initiated';
              break;
            case 3:
              color = 'green';
              text = 'Approved';
              break;
            case -1:
              color = 'red';
              text = 'Rejected';
              break;
            default:
              color = 'default';
              text = 'Unknown';
          }
  
          return <Tag color={color}>{text}</Tag>;
        },
      },
  ];

  // Define the expanded row content (showing Course 2 and Course 3 details)
  const expandedRowRender = (record) => {
    const expandedColumns = [
        {
            title: 'Course Type',
            dataIndex: 'platform_name2',
          },
      {
        title: 'Course Name',
        dataIndex: 'course_name2',
      },
      {
        title: 'Academic Year',
        dataIndex: 'academic_year2',
      },
      {
        title: 'Semester',
        dataIndex: 'semester2',
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date_2',
      },
      {
        title: 'End Date',
        dataIndex: 'end_date_2',
      },
    ];

    const expandedData = [];
    // If Course 2 exists, add it to the expanded data
    if (record.course_name2) {
      expandedData.push({
        key: `${record.id}-course2`,
        platform_name2: record.platform_name2,
        course_name2: record.course_name2,
        academic_year2: record.academic_year2,
        semester2: record.semester2,
        start_date_2: record.start_date_2,
        end_date_2: record.end_date_2,
      });
    }

    // If Course 3 exists, add it to the expanded data
    if (record.course_name3) {
      expandedData.push({
        key: `${record.id}-course3`,
        platform_name2: record.platform_name3,
        course_name2: record.course_name3,
        academic_year2: record.academic_year3,
        semester2: record.semester3,
        start_date_2: record.start_date_3,
        end_date_2: record.end_date_3,
      });
    }

    return <Table columns={expandedColumns} dataSource={expandedData} pagination={false} />;
  };

  return (
    <>
    <div className="tableMain">
    <div className="datagrid">
    <Table
      columns={columns}
      dataSource={data} 
      bordered
      className="custom-table"
      rowKey="id"
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.course_name2 || record.course_name3, // Only make rows expandable if there is Course 2 or Course 3
      }}
      
    />
    </div>
    </div>
    {selectedRowData && (
        <BasicModal
          open={true} // Always keep the modal open when there's selectedRowData
          handleClose={() => setSelectedRowData(null)}
          rowData={selectedRowData}
          approvalMembers={approvalMembers}
        />
      )}
    </>
  );
};

export default CourseTable;
