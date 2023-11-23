import React, { useEffect } from "react";
import Userprofile from "../component/Userprofile";
import Table from "../component/Table";
import Typeabsent from "../component/Typeabsent";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Employee_absent from "../component/Employee_absent";
import Tabs from "../component/Tabs";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
function checkIsLoggedIn() {
  const isLoggedIn = useSelector((state) => state.auth.userName);

  return isLoggedIn;
}

function Absent() {
  const navigate = useNavigate();
  const isLoggedIn = checkIsLoggedIn();
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(true); // สร้าง state เพื่อควบคุมการแสดง Dialog
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login");
    } else {
      // เมื่อเข้าสู่ระบบเสร็จสามารถแสดง Dialog ได้
      setShowWelcomeDialog(true);
    }
  }, [isLoggedIn, navigate]);

  const handleCloseWelcomeDialog = () => {
    setShowWelcomeDialog(false);
  };
  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <Grid container spacing={2}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: { xl: "1", lg: "-1", md: "-1", sm: "-1", xs: "-1" },
            width: "25%",
            margin: 1,
          }}
          xs={12}
          sm={7}
          xl={3}
          lg={3.5}
          md={6.5}
          onClose={handleCloseWelcomeDialog}
          open={showWelcomeDialog}
        >
          <AlertTitle>เงื่อนไขการลา</AlertTitle>
          1.ลาป่วย :
          กรณีลาป่วยให้พนักงานโทรแจ้งผู้บังคับบัญชาและฝ่ายบริหารให้ทราบด้วยตนเองไม่เกิน
          08.00 น. ในวันที่ลาและพนักงานจะต้องคีย์ใบลา 1-2วัน นับจากวันทีลา
          ไม่เช่นนั้น จะถือว่า ขาดงาน ในวันดังกล่าว
          <br />
          2.ลากิจ : กรณีลากิจต้องลาล่วงหน้า 3 วัน
          กรณีเป็นกิจกะทันหันให้โทรแจ้งฝ่ายบริหาร
          <br />
          3.ลาพักร้อน : กรณีลาพักร้อนต้องลาล่วงหน้า 3 วัน
          และได้รับอนุมัติจากผู้บังคับบัญชาและฝ่ายบริหารพนักงานจึงลาได้
          <br />
          4.การลาไปพบแพทย์ ตามนัด/รับยา/ลาไปตรวจครรภ์ พนักงานจะต้องมีใบนัดของหมอ
          และต้องมีใบรับรองแพทย์ทุกครั้งหลังจากไปพบแพทย์ ไม่เช่นนั้น
          จะไม่อนุญาตให้ใช้ลาป่วย
        </Alert>
        <Grid
          xs={12}
          sm={10}
          xl={11.5}
          lg={8.5}
          md={6.5}
          sx={{ marginTop: 1, width: 1000, marginLeft: 5 }}
        >
          <Paper
            elevation={8}
            sx={{
              marginTop: 10,
              borderRadius: "8px",
              backgroundColor: "#FFF",
              padding: 2,
              width: (theme) => ({
                sm: "740px",
                xs: 345,
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
              height: (theme) => ({
                sm: "430px",
                xs: 650,
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
              marginLeft: (theme) => ({
                xl: "auto",
                md: "1px",
                xs: -3,
              }),
            }}
          >
            <Userprofile />
          </Paper>
        </Grid>
        <Grid xs={12} sm={7} xl={3} lg={3.5} md={6.5} sx={{ marginLeft: 5 }}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: "8px",
              marginBottom: 10,
              padding: 2,
              marginLeft: (theme) => ({
                xl: "auto",
                md: "1px",
                xs: -3,
              }),

              width: (theme) => ({
                sm: "auto",
                xs: "35%",
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
              height: (theme) => ({
                sm: "740px",
                xs: 750,
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
            }}
          >
            <Typeabsent />
          </Paper>
        </Grid>
        <Grid xs={12} sm={5.3} xl={5.5} lg={5} md={6.8}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: "8px",
              marginBottom: 10,
              marginLeft: (theme) => ({
                lg: "20px",
                xl: "auto",
                md: "40px",
                sm: "40px",
                xs: 2,
              }),
              marginTop: (theme) => ({
                lg: "3px",
                xl: "auto",
                md: "-70px",
                sm: "-50px",
                xs: -9,
              }),
              width: (theme) => ({
                sm: 750,
                xs: 350,
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
            }}
          >
            <Tabs />
          </Paper>
        </Grid>
        <Grid xs={12} sm={6.9} xl={3} lg={3.77} md={6.8} sx={{ marginTop: 1 }}>
          <Paper
            elevation={8}
            sx={{
              marginBottom: 10,
              borderRadius: "8px",
              marginLeft: (theme) => ({
                lg: "40px",
                xl: "auto",
                md: "40px",
                sm: "40px",
                xs: 2,
              }),
              marginTop: (theme) => ({
                lg: "-70px",
                xl: "auto",
                md: "-70px",
                sm: "-70px",
                xs: -9,
              }),
              width: (theme) => ({
                sm: 750,
                xs: 350,
                xl: "auto",
                lg: "auto",
                md: "auto",
              }),
            }}
          >
            <Employee_absent />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Absent;
