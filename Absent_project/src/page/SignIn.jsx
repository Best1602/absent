import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUserName } from "../contexts/state/action";
import { useAppDispatch } from "../contexts/state";
import { useUserName } from "../contexts/state/hooks";
const defaultTheme = createTheme();

function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    console.log(import.meta.env.VITE_API_SERVICE);
    event.preventDefault();
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_SERVICE
        }/login` /*"http://192.168.1.202:3000/login"*/,
        {
          username: username,
          password: password,
        }
      );

      if (response.data.success) {
        console.log("Login success");
        dispatch(setUserName({ username, password }));
        // dispatch(setUserName(password));
        navigate("/absent", { state: { user: response.data.user } }); // ส่งข้อมูลผู้ใช้ไปพร้อมกับการเปลี่ยนเส้นทาง
      } else {
        console.log(response.data);
        console.log("Login failed");
        setError("ชื่อผู้ใช้หรือหัสผ่านผิด");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          component="p"
        >
          {error}
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
