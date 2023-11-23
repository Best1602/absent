import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from "axios";
import Swal from "sweetalert2";
import { MuiFileInput } from "mui-file-input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useLocation, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
export default function Checkboxes() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValue1, setSelectedValue1] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const loggedInUser = useSelector((state) => state.auth.userName); // ค่า username ที่ login เข้ามา
  const [file, setFile] = useState("");
  const [file1, setFile1] = useState("");
  const [id, setId] = useState(2);
  const [startAbsenceDate, setStartAbsenceDate] = useState(null);
  const [endAbsenceDate, setEndAbsenceDate] = useState(null);
  const [absentTypes, setAbsentTypes] = useState({
    TotalBusiness: 0,
    TotalSick: 0,
    TotalOther: 0,
    TotalTakeAnnual: 0,
  });
  console.log(file);
  console.log(file1);
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.user;
  useEffect(() => {
    if (username) {
      axios
        .get(`${import.meta.env.VITE_API_SERVICE}/absent_type`, {
          params: { username }, // Use loggedInUser here
        })
        .then((response) => {
          // ตรวจสอบและแปลงค่า null เป็น 0 สำหรับแต่ละฟิลด์
          const data = response.data;
          const updatedAbsentTypes = {
            TotalBusiness: data.TotalBusiness || 0,
            TotalSick: data.TotalSick || 0,
            TotalOther: data.TotalOther || 0,
            TotalTakeAnnual: data.TotalTakeAnnual || 0,
          };

          setAbsentTypes(updatedAbsentTypes);
        })
        .catch((error) => {
          console.error("Error fetching absent types:", error);
        });
    }
  }, [username]);
  const handleCheckboxChange = (event) => {
    setSelectedValue(event.target.name);
    setOtherReason("");
  };

  const handleOtherReasonChange = (event) => {
    setOtherReason(event.target.value);
  };

  const handleChange = (newFile) => {
    if (newFile) {
      // Check if the file is not jpg or png
      if (
        !newFile.type.startsWith("image/jpeg") &&
        !newFile.type.startsWith("image/png") &&
        !newFile.type.startsWith("application/pdf")
      ) {
        Swal.fire({
          icon: "error",
          title: "The picture is not correct.",
          text: "Please select the image file in jpg or png format only.",
        });
        return; // Prevent setting an invalid file
      }
      // Set the selected file
      setFile(newFile);
    } else {
      // No file selected, clear the current file
      setFile("");
    }
  };
  const handleChange1 = (newFile) => {
    if (newFile) {
      // Check if the file is not jpg or png
      if (
        !newFile.type.startsWith("image/jpeg") &&
        !newFile.type.startsWith("image/png") &&
        !newFile.type.startsWith("application/pdf")
      ) {
        Swal.fire({
          icon: "error",
          title: "The picture is not correct.",
          text: "Please select the image file in jpg or png format only.",
        });
        return; // Prevent setting an invalid file
      }
      // Set the selected file
      setFile1(newFile);
    } else {
      // No file selected, clear the current file
      setFile1("");
    }
  };

  const handleSubmit = async () => {
    // console.log(dayjs(startAbsenceDate).format().split("+")[0]);
    // const { $D, $H, $M, $m, $y } = startAbsenceDate;
    const startabsent = dayjs(startAbsenceDate)
      .format()
      .split("+")[0]
      .replace("T", " ");
    const endabsent = dayjs(endAbsenceDate)
      .format()
      .split("+")[0]
      .replace("T", " ");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file1", file1);
    formData.append("username", loggedInUser);
    formData.append("startabsent", startabsent);
    formData.append("typabsent", selectedValue);
    formData.append("endabsent", endabsent);
    formData.append("datillabsent", otherReason);
    formData.append("id", id);

    try {
      if (!loggedInUser) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Leave request submission failed",
        });
        return;
      }
      if (!selectedValue) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select leave type",
        });
        return;
      }
      if (!startabsent) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select leave Startdate",
        });
        return;
      }
      if (!endabsent) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select leave Enddate",
        });
        return;
      }
      if (!otherReason) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please choose to tell the details of your leave.",
        });
        return;
      }

      const shouldRedirect = await Swal.fire({
        icon: "question",
        title: "Want to create a leave letter?",
        text: "When you have finished creating the leave form, please click send the leave form in the table as well.",
        showCancelButton: true,
        confirmButtonText: "sudmin",
        cancelButtonText: "cancel",
      });

      if (shouldRedirect.isConfirmed) {
        // ผู้ใช้กด Confirm ให้ดำเนินการ Redirect

        // ส่งคำขอลา...
        const response = await axios.post(
          `${import.meta.env.VITE_API_SERVICE}/submitabsent`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Successfully created leave form",
            text: "Collect leave information successfully",
          });

          // Delay before redirection (in milliseconds)
          const redirectionDelay = 1300;

          setTimeout(() => {
            window.location.href = "/Similan-Absent/absent"; // เปลี่ยน URL ตามที่คุณต้องการ
            // navigate("absent");
          }, redirectionDelay);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Leave request submission failed",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting leave request",
      });
    }
  };

  const isTimeDisabled = (time) => {
    const startTime = dayjs(time).format("HH:mm");
    // Define the start and end times for the disabled period (e.g., 17:30 to 07:30)
    const startTimeDisabled = "17:31";
    const endTimeDisabled = "07:31";

    // Check if the selected time is within the disabled range
    if (
      (startTime >= startTimeDisabled && startTime <= "23:59") ||
      (startTime >= "00:00" && startTime <= endTimeDisabled)
    ) {
      return true; // Disable the time
    }
    return false; // Enable the time
  };
  const handleCheckboxChange1 = (event) => {
    const selectedType1 = event.target.name;
    setSelectedValue1(selectedType1);
    setOtherReason("");

    // ตรวจสอบว่าถ้าถูกเลือก "ลาทั้งวัน" ให้ตั้งค่าเวลาใน startAbsenceDate เป็น 08:30 และ endAbsenceDate เป็น 17:30
    if (selectedType1 === "Leave all day") {
      setStartAbsenceDate(dayjs().set("hour", 8).set("minute", 30)); // ตั้งเวลาเริ่มต้นเป็น 08:30
      setEndAbsenceDate(dayjs().set("hour", 17).set("minute", 30)); // ตั้งเวลาสิ้นสุดเป็น 17:30
    } else if (selectedType1 === "Afternoon leave") {
      setStartAbsenceDate(dayjs().set("hour", 13).set("minute", 0)); // ตั้งเวลาเริ่มต้นเป็น 08:30
      setEndAbsenceDate(dayjs().set("hour", 17).set("minute", 30)); // ตั้งเวลาสิ้นสุดเป็น 17:30
    } else if (selectedType1 === "Morning leave") {
      setStartAbsenceDate(dayjs().set("hour", 8).set("minute", 30)); // ตั้งเวลาเริ่มต้นเป็น 08:30
      setEndAbsenceDate(dayjs().set("hour", 13).set("minute", 0)); // ตั้งเวลาสิ้นสุดเป็น 17:30
    }
  };
  return (
    <Box style={{ padding: "5px", marginTop: "-5px" }}>
      <Box
        sx={{
          display: { lg: "flex", xs: "grid", md: "flex" },
          marginTop: 0.5,
          height: 96,
        }}
      >
        <Box sx={{ margin: 0.5, width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Leave start date"
              ampm={false}
              sx={{ width: 200 }}
              format="DD/MM/YYYY HH:mm"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              value={startAbsenceDate}
              onChange={setStartAbsenceDate}
              shouldDisableTime={isTimeDisabled}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ margin: 0.5, width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Leave end date"
              ampm={false}
              sx={{ width: 200 }}
              format="DD/MM/YYYY HH:mm"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              value={endAbsenceDate}
              onChange={setEndAbsenceDate}
              shouldDisableTime={isTimeDisabled}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      {loggedInUser ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            flexFlow: "wrap",
            marginTop: "5px",
            padding: "5px",
          }}
        >
          <Box sx={{ marginTop: { xs: 3, lg: -5 } }}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckboxChange1}
                    checked={selectedValue1 === "Leave all day"}
                    name="Leave all day"
                  />
                }
                sx={{
                  marginRight: 3.5,
                  "& .MuiTypography-root": {
                    fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                  },
                }}
                label="Leave all day "
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckboxChange1}
                    checked={selectedValue1 === "Afternoon leave"}
                    name="Afternoon leave"
                  />
                }
                sx={{
                  marginRight: 3.5,
                  width: 200,
                  "& .MuiTypography-root": {
                    fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                  },
                }}
                label="Afternoon leave "
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckboxChange1}
                    checked={selectedValue1 === "Morning leave"}
                    name="Morning leave"
                  />
                }
                sx={{
                  marginRight: 3.5,
                  width: 200,
                  "& .MuiTypography-root": {
                    fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                  },
                }}
                label="Morning leave "
              />
            </Box>
            <Box>-----------------------------------------</Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue === "Absent Sick"}
                  onChange={handleCheckboxChange}
                  name="Absent Sick"
                  disabled={absentTypes.TotalSick >= 30}
                />
              }
              sx={{
                marginRight: 3.5,
                "& .MuiTypography-root": {
                  fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                },
              }}
              label="Sick leave"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue === "Absent Business"}
                  onChange={handleCheckboxChange}
                  name="Absent Business"
                  disabled={absentTypes.TotalBusiness >= 3}
                />
              }
              sx={{
                "& .MuiTypography-root": {
                  fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                },
              }}
              label="Business leave "
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue === "Absent Other"}
                  onChange={handleCheckboxChange}
                  name="Absent Other"
                  disabled={absentTypes.TotalOther >= 30}
                />
              }
              sx={{
                "& .MuiTypography-root": {
                  fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                },
              }}
              label="Other leave"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue === "Absent Take Annual"}
                  onChange={handleCheckboxChange}
                  name="Absent Take Annual"
                  disabled={absentTypes.TotalTakeAnnual >= 6}
                />
              }
              sx={{
                "& .MuiTypography-root": {
                  fontFamily: "IBM Plex Sans Thai", // ตัวอย่างการใช้ Arial font
                },
              }}
              label="Vacation leave"
            />
          </Box>

          <TextField
            id="outlined-multiline-static"
            label="Leave Detail"
            multiline
            rows={2}
            value={otherReason}
            onChange={handleOtherReasonChange}
            sx={{
              width: "100%",
              marginTop: 2,
              marginBottom: 2,
              "& label": {
                fontFamily: "IBM Plex Sans Thai",
              },
            }}
          />
          {selectedValue === "Absent Sick" && (
            <MuiFileInput
              sx={{ marginTop: 1, width: "45%", margin: 1 }}
              value={file}
              onChange={handleChange}
              // value={file1}
              // onChange={handleChange1}
              label="File1"
              type="File"
              name="file1"
            />

          )}
          <MuiFileInput
            sx={{
              marginTop: 1,
              width: selectedValue !== "Absent Sick" ? "100%" : "50%", // ตรวจสอบ selectedValue
            }}
            // value={file}
            // onChange={handleChange}
            value={file1}
            onChange={handleChange1}
            label="File"
            type="File"
            name="file"
          />
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                marginTop: 2,
              }}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="success"
                sx={{ backgroundColor: "#2DC598" }}
                disabled={
                  !(
                    selectedValue === "Absent Sick" &&
                    file &&
                    startAbsenceDate &&
                    endAbsenceDate
                  ) &&
                  !(
                    selectedValue === "Absent Business" &&
                    file &&
                    startAbsenceDate &&
                    endAbsenceDate
                  ) &&
                  !(selectedValue === "Absent Other" && startAbsenceDate) &&
                  !(selectedValue === "Absent Take Annual" && endAbsenceDate)
                }
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <p>Please log in to submit a leave request.</p>
      )}
    </Box>
  );
}