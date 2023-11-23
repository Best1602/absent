import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { MuiFileInput } from "mui-file-input";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const defaultTheme = createTheme();

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [prefix, setPrefix] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState("");
  const [date_time_start, setDate_time_start] = useState(null);
  const [jobposition, setJobposition] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    if (
      username === "" ||
      password === "" ||
      prefix === "" ||
      firstname === "" ||
      lastname === "" ||
      nickname === "" ||
      jobposition === "" ||
      department === "" ||
      date_time_start === null
    ) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
      return; // ออกจากฟังก์ชันหลังจากแสดง SweetAlert2
    }

    const result = await Swal.fire({
      icon: "question",
      title: "แน่ใจหรือไม่?",
      text: "คุณต้องการเพิ่มพนักงานใหม่ใช่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่",
    });

    // Append other form data
    formData.append("username", username);
    formData.append("password", password);
    formData.append("prefix", prefix);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("nickname", nickname);
    formData.append("jobposition", jobposition);
    formData.append("department", department);
    formData.append("date_time_start", date_time_start);

    // Append the file to the FormData object
    formData.append("file1", file);

    try {
      // Send a POST request with the FormData to the server
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICE}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file upload
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "เพิ่มพนักงานสำเร็จ",
          text: "คุณได้เพิ่มพนักงานใหม่เรียบร้อยแล้ว",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถเพิ่มพนักงานใหม่ได้",
          text: "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเพิ่มพนักงานใหม่ได้",
        text: "เกิดข้อผิดพลาด",
      });
    }
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
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            เพิ่มข้อมูลพนักงานใหม่
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="password"
                  name="Password"
                  autoComplete="family-name"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">prefix</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  >
                    <MenuItem value={"นาย"}>นาย</MenuItem>
                    <MenuItem value={"นางสาว"}>นางสาว</MenuItem>
                    <MenuItem value={"นาง"}>นาง</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="firstname"
                  label="firstname"
                  name="firstname"
                  autoComplete="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="lastname"
                  label="lastname"
                  type="lastname"
                  id="lastname"
                  autoComplete="new-password"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="nickname"
                  label="nickname"
                  type="nickname"
                  id="nickname"
                  autoComplete="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    jobposition
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={jobposition}
                    onChange={(e) => setJobposition(e.target.value)}
                  >
                    <MenuItem value={"Sales & Marketing Manager"}>
                      Sales & Marketing Manager
                    </MenuItem>
                    <MenuItem value={"Senior Customer Service"}>
                      Senior Customer Service
                    </MenuItem>
                    <MenuItem value={"Audit Division Manager"}>
                      Audit Division Manager
                    </MenuItem>
                    <MenuItem value={"AI&Support  Manager"}>
                      AI&Support Manager
                    </MenuItem>
                    <MenuItem value={"System Analyst"}>System Analyst</MenuItem>
                    <MenuItem value={"Assistant Project Manager"}>
                      Assistant Project Manager
                    </MenuItem>
                    <MenuItem value={"Programmer"}>Programmer</MenuItem>
                    <MenuItem value={"Software Tester"}>
                      Software Tester
                    </MenuItem>
                    <MenuItem value={"Software Engineer"}>
                      Software Engineer
                    </MenuItem>
                    <MenuItem value={"Graphic"}>Graphic</MenuItem>
                    <MenuItem value={"IT Engineer"}>IT Engineer</MenuItem>
                    <MenuItem value={"Logistics Supervisor"}>
                      Logistics Supervisor
                    </MenuItem>
                    <MenuItem value={"ธุรการคลังสินค้า"}>
                      ธุรการคลังสินค้า
                    </MenuItem>
                    <MenuItem value={"ธุรการบัญชี"}>ธุรการบัญชี</MenuItem>
                    <MenuItem value={"ประสานงานขาย"}>ประสานงานขาย</MenuItem>
                    <MenuItem value={"Sale"}>Sale</MenuItem>
                    <MenuItem value={"พนักงานขาย"}>พนักงานขาย</MenuItem>
                    <MenuItem value={"Senior Programmer"}>Senior Programmer</MenuItem>
                    <MenuItem value={"ธุรการการเงิน"}>ธุรการการเงิน</MenuItem>
                    <MenuItem value={"ธุรการบุคคล"}>ธุรการบุคคล </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      label="วันเวลาเริ่มงาน"
                      format="DD/MM/YYYY "
                      ampm={false}
                      value={
                        date_time_start ||
                        dayjs().subtract(3, "days").set({ hour: 8, minute: 30 })
                      } // ตั้งค่าค่าเริ่มต้นเป็น 08:30
                      onChange={(newDate) => setDate_time_start(newDate)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={department}
                    label="Age"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <MenuItem value={"Sale"}>Sale</MenuItem>
                    <MenuItem value={"Software"}>Software</MenuItem>
                    <MenuItem value={"Engineer"}>Engineer</MenuItem>
                    <MenuItem value={"warehouse"}>warehouse</MenuItem>
                    <MenuItem value={"Purchasing "}>Purchasing </MenuItem>
                    <MenuItem value={"Finance "}>Finance </MenuItem>
                    <MenuItem value={"personel "}>personel </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <MuiFileInput
              sx={{
                marginTop: 1,
                width: "100%", // ตรวจสอบ selectedValue
              }}
              value={file}
              onChange={handleChange}
              label="รูปพนักงาน"
              type="File"
              name="file1"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เพิ่มพนักงานใหม่
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
