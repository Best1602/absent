import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios"; // Import axios
import { format } from "date-fns";
import CustomFilter from "./CustomFilter";

const showDateFormat = (dateString, timeString) => {
  const [year, month, day] = dateString.split("-");
  const [hour, min] = timeString;
  // consst [] = timeString
  return `${day}/${month}/${year.substring(2)} ${Number(hour > 10) ? hour : hour
    }:${Number(min > 10) ? min : min}`;
};
const columns = [
  {
    field: "row_id",
    headerClassName: "custom-header",
    headerName: "ID",
    width: 90,
  },
  {
    field: "imguser",
    headerClassName: "custom-header",
    headerName: "img",
    width: 90,

    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={
            params.row.imguser
              ? `${import.meta.env.VITE_API_SERVICE}/user-image/${params.row.username
              }`
              : "./imges/Ellipse 24.png" // Replace with the path to your default image
          }
          alt="User"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
  },
  {
    field: "fullname",
    headerName: "Full name",
    headerClassName: "custom-header",
    sortable: false,
    editable: true,

    width: 150,
    valueGetter: (params) =>
      `${params.row.firstname || ""} ${params.row.lastname || ""}`,
  },
  {
    field: "nickname",
    headerName: "nickname",
    headerClassName: "custom-header",
    width: 100,
  },
  {
    field: "startabsent",
    headerClassName: "custom-header",
    headerName: "start",
    width: 150,

    valueFormatter: (params) => {
      if (params.value) {
        return showDateFormat(
          params.value.split("T")[0],
          params.value.split("T")[1].split(".")[0].split(":")
        );
      }
      return "";
    },
  },
  {
    field: "endabsent",
    headerClassName: "custom-header",
    headerName: "end",

    width: 150,

    valueFormatter: (params) => {
      if (params.value) {
        // ตรวจสอบค่า null ก่อน
        return showDateFormat(
          params.value.split("T")[0],
          params.value.split("T")[1].split(".")[0].split(":")
        );
      }
      return ""; // หรือค่าที่คุณต้องการเมื่อ params.value เป็น null
    },
  },
  {
    field: "typabsent",
    headerName: "Type",
    width: 200,
    headerClassName: "custom-header",
    renderCell: (params) => {
      const isSickLeave = params.value === "Absent Sick";
      const isBusinessLeave = params.value === "Absent Business";
      const isOtherLeave = params.value === "Absent Other";
      const isAnnualLeave = params.value === "Absent Take Annual";
      let displayText = params.value;
      let textColor = "#8F7DC7";
      if (isSickLeave) {
        displayText = "Sick leave";
        textColor = "#E04A6C"; // สีสำหรับ Sick Leave
      } else if (isBusinessLeave) {
        displayText = "Business leave";
        textColor = "EDA364";
      } else if (isOtherLeave) {
        displayText = "Other leave";
        textColor = "25949B";
      } else if (isAnnualLeave) {
        displayText = "Vacation leave";
        textColor = "8F7DC7";
      }
      return (
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            color: isSickLeave
              ? "#E04A6C"
              : isBusinessLeave
                ? "#EDA364"
                : isOtherLeave
                  ? "#25949B"
                  : isAnnualLeave
                    ? "#8F7DC7"
                    : "#8F7DC7", // Default color if none of the above conditions match
            backgroundColor: isSickLeave
              ? "#FCEEF1"
              : isBusinessLeave
                ? "#FFEFE1"
                : isOtherLeave
                  ? "#E1F8F8"
                  : isAnnualLeave
                    ? "#E3E1F8"
                    : "#E3E1F8", // Default color if none of the above conditions match
            borderRadius: "10px",

            padding: "4px 8px",
          }}
        >
          {displayText}
        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Status ",
    headerClassName: "custom-header",
    type: "string",
    width: 200,
    filterOperators: ["contains"],
    onFilterChange: (event) => handleFilterChange("name", event),
    renderCell: (params) => (
      <div
        style={{
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          color:
            params.value === "START"
              ? "#5DA1DD"
              : params.value === "SEND TO CHIEF APPROVE"
                ? "#24B1C7"
                : params.value === "CHIEF APPROVED"
                  ? "#0EC07A"
                  : params.value === "PERSONAL APPROVED"
                    ? "#0EC07A"
                    : params.value === "CEO APPROVED"
                      ? "#0EC07A"
                      : params.value === "CHIEF CANCELLED"
                        ? "#FF5052"
                        : params.value === "PERSONAL CANCELLED"
                          ? "#FF5052"
                          : params.value === "CEO CANCELLED"
                            ? "#FF5052"
                            : params.value === "EMPOPLOYEE CANCEL"
                              ? "#FF5052"
                              : "#FF5052",
        }}
      >
        {params.value}
      </div>
    ),
  },

  {
    field: "datillabsent",
    headerName: "datillabsent",
    width: 150,
    editable: true,

    headerClassName: "custom-header",
  },

  {
    field: "jobposition",
    headerName: "jobposition",
    headerClassName: "custom-header",
    width: 250,
  },
  {
    field: "department",
    headerName: "department",
    headerClassName: "custom-header",
    width: 150,
  },

  {
    field: "cancellationComment",
    headerClassName: "custom-header",
    headerName: "cancellationComment",
    width: 180,
  },
];

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); // สร้าง state เพื่อเก็บข้อมูลแถวที่ถูกกรอง
  const [filterValue, setFilterValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  useEffect(() => {

    fetchUserData();
  }, []);
  useEffect(() => {

    filterRows();
  }, [filterValue, rows]);

  useEffect(() => {

    filterRows();
  }, [selectValue]);
  useEffect(() => {

    filterRows();
  }, [statusValue]);
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE}/leaving`
      );

      if (response.status === 200) {
        const data = response.data.map((row, index) => ({
          ...row,
          id: index + 1, // Assign a unique id based on the index
        }));

        setRows(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleFilterChange = (searchValue, selectValue, statusValue) => {
    // เพิ่มการรับค่า statusValue
    setFilterValue(searchValue);
    setSelectValue(selectValue);
    setStatusValue(statusValue); // ต้องรับค่า statusValue เข้ามา
  };
  const filterRows = () => {
    // กรองข้อมูลแถวตามค่าตัวกรองและค่า Select และค่า Status
    const filtered = rows.filter((row) => {
      const nameMatches =
        (row.firstname &&
          row.firstname.toLowerCase().includes(filterValue.toLowerCase())) ||
        (row.lastname &&
          row.lastname.toLowerCase().includes(filterValue.toLowerCase())) ||
        (row.nickname &&
          row.nickname.toLowerCase().includes(filterValue.toLowerCase())) ||
        (row.name &&
          row.name.toLowerCase().includes(filterValue.toLowerCase()));

      const typeMatches =
        !selectValue || // ถ้าไม่ได้เลือก selectValue
        (row.typabsent &&
          row.typabsent.toLowerCase() === selectValue.toLowerCase());

      const statusMatches =
        !statusValue || // ถ้าไม่ได้เลือก statusValue
        (row.name && row.name.toLowerCase() === statusValue.toLowerCase());

      return nameMatches && typeMatches && statusMatches;
    });

    setFilteredRows(filtered); // อัปเดตข้อมูลแถวที่ถูกกรอง
  };

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      {" "}
      <CustomFilter
        onFilterChange={handleFilterChange}
        searchValue={filterValue}
        selectValue={selectValue}
        statusValue={statusValue}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        className="left-aligned-datagrid"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
