import React, { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Navbar from "../component/Narbar";
import { Box, Button } from "@mui/material";
import { Grid } from "@mui/material";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { format } from "date-fns";
import dayjs from "dayjs";
import PDFViewerButton from "../Pdf/PDFViewerButton";
function DateRangePicker() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tableData, setTableData] = useState([]);

  console.log("start", startDate);
  console.log("end", endDate);

  const handleSearch = async () => {
    try {
      if (!startDate || !endDate) {
        // ถ้าไม่ได้เลือกวันเวลาทั้งคู่
        Swal.fire({
          icon: "warning",
          title: "กรุณาเลือกวันเริ่มและวันสิ้นสุด",
          text: "โปรดเลือกวันที่เริ่มและวันที่สิ้นสุดก่อนค้นหา",
        });
        return; // ออกจากฟังก์ชันแบบไม่ทำอะไรเพิ่ม
      }

      // Format the startDate and endDate in the desired format
      const formattedStartDate = dayjs(startDate).toISOString(); // 1 day added
      const formattedEndDate = dayjs(endDate).add(1, "day").toISOString(); // 1 day added

      // Construct the API URL with formatted date and time values
      const apiUrl = `${
        import.meta.env.VITE_API_SERVICE
      }/repost?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      // Fetch data from the API
      const response = await fetch(apiUrl);

      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        const data = await response.json();

        if (Array.isArray(data)) {
          if (data.length === 0) {
            // ไม่มีข้อมูลระหว่างวันที่เลือก แสดง SweetAlert2
            Swal.fire({
              icon: "warning",
              title: "ไม่พบข้อมูล",
              text: "ไม่มีข้อมูลระหว่างวันที่เลือก",
            });
          } else {
            // มีข้อมูล อัพเดต state ด้วยข้อมูลที่ได้จาก API
            setTableData(data);
          }
        } else {
          // ถ้าไม่ใช่อาร์เรย์ แสดง SweetAlert2 แจ้งข้อผิดพลาด
          Swal.fire({
            icon: "error",
            title: "ข้อผิดพลาด",
            text: "ไม่มีข้อมูลระหว่างวันที่เลือก",
          });
          console.error("Received data is not an array:", data);
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePrint = () => {
    // เมื่อคุณคลิกปุ่มพิมพ์
    window.print();
  };
  // const showDateFormat = (dateString, timeString) => {
  //   const [year, month, day] = dateString.split("-");
  //   const [hour, min] = timeString;
  //   // consst [] = timeString
  //   return `${day}/${month}/${year.substring(2)} ${
  //     Number(hour > 10) ? hour : hour
  //   }:${Number(min > 10) ? min : min}`;
  // };
  const columns = [
    {
      field: "row_id",
      headerName: "Doc.no",
      width: 80,
      headerClassName: "custom-header",
    },
    {
      field: "formattedsubmitDateTime",
      headerName: "submitDateTime",
      headerClassName: "custom-header",
      width: 150,

      // valueFormatter: (params) => {
      //   // Assuming params.value is a valid date string
      //   const date = new Date(params.value);
      //   return format(date, "dd/MM/yyyy");
      // },
    },
    {
      field: "username",
      headerName: "username",
      headerClassName: "custom-header",
      width: 110,
    },

    {
      field: "firstname",
      headerClassName: "custom-header",
      headerName: "Full name",
      width: 150,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname || ""}`,
    },
    {
      field: "nickname",
      headerClassName: "custom-header",
      headerName: "Nickname",
      width: 70,
    },

    {
      field: "formattedStartDate",
      headerClassName: "custom-header",
      headerName: "startDate",
      width: 150,

      // valueFormatter: (params) => {
      //   if (params.value) {
      //     return showDateFormat(
      //       params.value.split("T")[0],
      //       params.value.split("T")[1].split(".")[0].split(":")
      //     );
      //   }
      //   return "";
      //},
    },
    {
      field: "formattedEndabsent",
      headerName: "EndDate",
      headerClassName: "custom-header",
      width: 150,

      // valueFormatter: (params) => {
      //   if (params.value) {
      //     return showDateFormat(
      //       params.value.split("T")[0],
      //       params.value.split("T")[1].split(".")[0].split(":")
      //     );
      //   }
      //   return "";
      // },
    },
    {
      field: "typabsent",
      headerName: "typabsent",
      headerClassName: "custom-header",
      width: 150,

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
              // border: `1px solid ${
              //   isSickLeave
              //     ? "#D16D6A"
              //     : isBusinessLeave
              //     ? "#F29A12"
              //     : isOtherLeave
              //     ? "#92DBD6"
              //     : isAnnualLeave
              //     ? "#AC8FFD"
              //     : "#AC8FFD"
              // }`,
              padding: "4px 8px",
            }}
          >
            {displayText}
          </div>
        );
      },
    },
    {
      field: "jobposition",
      headerName: "jobposition",
      width: 120,
      headerClassName: "custom-header",
    },
    {
      field: "combinedDifference",
      headerName: "Timeleaving",
      width: 100,
      headerClassName: "custom-header",
    },
    {
      field: "department",
      headerName: "department",
      width: 200,
      headerClassName: "custom-header",
    },
    {
      field: "datillabsent",
      headerName: "datillabsent",
      width: 250,
      headerClassName: "custom-header",
    },
    {
      field: "formattedApproved",
      headerName: "ApprovedData",
      width: 160,
      headerClassName: "custom-header",
    },
  ];

  return (
    <div>
      <Box sx={{ marginTop: 1 }}>
        <Box
          sx={{
            display: "flex",

            justifyContent: "center",
          }}
        >
          <Box sx={{ m: 0.5 }}>
            {" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(props) => <TextField {...props} />}
                label="วันที่เริ่ม"
                format="DD/MM/YYYY HH:mm"
                ampm={false}
              />{" "}
            </LocalizationProvider>
          </Box>

          <Box sx={{ m: 0.5 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(props) => <TextField {...props} />}
                label="วันที่สิ้นสุด"
                format="DD/MM/YYYY HH:mm"
                ampm={false}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", m: 0.5 }}>
          <Button
            sx={{ backgroundColor: "#2DC598", marginRight: 2 }}
            color="success"
            variant="contained"
            onClick={handleSearch}
          >
            ค้นหา
          </Button>

          <PDFViewerButton
            data={tableData}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>

        <Box sx={{ width: "100%", m: 0.5 }}>
          <DataGrid
            rows={tableData.map((row) => ({
              ...row,
              id: row.row_id, // ใช้ค่า id ใน row แทนค่า key
            }))}
            columns={columns}
            className="left-aligned-datagrid"
            style={{ height: "600px" }}
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
      </Box>
    </div>
  );
}

export default DateRangePicker;
