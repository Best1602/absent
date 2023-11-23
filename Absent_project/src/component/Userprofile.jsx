import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { color, motion } from "framer-motion";

function UserProfile() {
  const location = useLocation();
  const userDataFromSignIn = location.state?.user;

  const showDateFormat = (date) => {
    let layout = date.split("-");
    return `${layout[2]}/${layout[1]}/${layout[0]}`;
  };

  const [userData, setUserData] = useState(userDataFromSignIn || {});

  return (
    <Box
      sx={{
        display: "inline-block",
        fontFamily: "IBM Plex Sans Thai",
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          <AccountCircleIcon
            sx={{
              fontSize: 40,
              color: "#91C6F2",
              fontFamily: "IBM Plex Sans Thai",
              fontWeight: "500",
            }}
          />
          <div
            style={{
              marginTop: "-35px",
              marginLeft: 50,
              fontFamily: "IBM Plex Sans Thai",
              fontWeight: "500",
            }}
          >
            <b>Profile information</b>
          </div>

          {userData.imguser ? (
            <div
              style={{
                display: "flex",
                marginLeft: "25px",
                height: "160px",
                width: "160px",
              }}
            >
              <img
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={`${import.meta.env.VITE_API_SERVICE}/user-image/${
                  userData.username
                }`}
                alt="Profile Image"
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                marginLeft: "25px",
                height: "160px",
                width: "160px",
              }}
            >
              {" "}
              <img
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src="./imges/Ellipse 24.png"
                alt="Profile Image"
              />
            </div>
          )}
        </Grid>
        <Grid item>
          <FormControl
            sx={{
              display: {
                xs: "grid",
                sm: "flex", // ขนาดหน้าจออื่น ๆ ให้ใช้ flex
              },
              flexDirection: "row",
              marginTop: {
                lg: 5,
              },
              marginLeft: 2,
              minWidth: 150,
              textDecoration: "none",
              justifyContent: {
                xs: "start", // ใน xs ให้ใช้ start
              },
            }}
            size="small"
          >
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px",
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Employee ID"
              id="prefix"
              value={userData.username || ""}
              size="small"
            />

            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px",
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="First name Last name"
              id="prefix"
              value={
                userData.prefix +
                  " " +
                  userData.firstname +
                  "    " +
                  userData.lastname || ""
              }
              size="small"
            />
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px", // เปลี่ยนสีขอบเป็น green หรือสีที่คุณต้องการ
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Nickname"
              id="prefix"
              value={userData.nickname || ""}
              size="small"
            />
          </FormControl>
          <FormControl
            sx={{
              display: {
                xs: "grid",
                sm: "flex", // ขนาดหน้าจออื่น ๆ ให้ใช้ flex
              },
              flexDirection: "row",
              m: 1,
              marginLeft: 2,
              zIndex: 3,
              minWidth: 150,
              textDecoration: "none",
              justifyContent: {
                xs: "start", // ใน xs ให้ใช้ start
              },
            }}
            size="small"
          >
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px", // เปลี่ยนสีขอบเป็น green หรือสีที่คุณต้องการ
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Jobposition"
              id="prefix"
              value={userData.jobposition || ""}
              size="small"
            />
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px", // เปลี่ยนสีขอบเป็น green หรือสีที่คุณต้องการ
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Department"
              id="prefix"
              value={userData.department || ""}
              size="small"
            />
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px", // เปลี่ยนสีขอบเป็น green หรือสีที่คุณต้องการ
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Work start date"
              id="prefix"
              value={
                userData.date_time_start
                  ? new Date(userData.date_time_start).toLocaleDateString(
                      "en-GB"
                    )
                  : ""
              }
              size="small"
            />
            <TextField
              sx={{
                m: 1,
                minWidth: 140,
                border: "3px ",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E9E9E9",
                  borderWidth: "2px", // เปลี่ยนสีขอบเป็น green หรือสีที่คุณต้องการ
                },
                "& label": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#B7B7B7",
                  fontSize: "15px",
                },
                "& input": {
                  fontFamily: "IBM Plex Sans Thai",
                  color: "#6C737B",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                },
              }}
              label="Working period"
              id="prefix"
              value={
                userData.years +
                  " Year " +
                  userData.months +
                  " Month " +
                  userData.days +
                  "  Day " || " "
              }
              size="small"
            />
          </FormControl>
          <Box
            sx={{
              position: "absolute",
              zIndex: { xl: "1", lg: "-1", md: "-1", sm: "-1", xs: "-1" },
              top: 89,
              right: {
                xs: "40px",
                sm: "60px",
                md: "80px",
                lg: 160,
                xl: "40px",
              },
            }}
          >
            <Box>
              <img
                style={{
                  width: "600px",
                  height: "228px",
                  borderRadius: "8px",
                  backgroundSize: "cover",
                }}
                src="./imges/Vector 1.png"
                alt="sad"
              />
            </Box>
          </Box>
          <motion.div className="loop-animation">
            <Box
              sx={{
                position: "absolute",
                zIndex: { xl: "1", lg: "-1", md: "-1", sm: "-1", xs: "-1" },
                Top: {
                  xs: "40px",
                  sm: "60px",
                  md: "80px",
                  lg: 160,
                  xl: "40px",
                },
                right: {
                  xs: "40px",
                  sm: "60px",
                  md: "80px",
                  lg: 160,
                  xl: "20px",
                },
              }}
            >
              <img
                style={{ width: "495px", height: "300px" }}
                src="./imges/7753427 1.png"
                alt="sad"
              />
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserProfile;
