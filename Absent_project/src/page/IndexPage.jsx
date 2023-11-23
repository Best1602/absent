import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import Narbar from "../component/Narbar";
//
// import Header from './header';
// import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  width: "100vw",
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
  background: "#f2f3f7",
});

const Main = styled("div")(({ theme }) => ({
  // width:'100%',
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  // backgroundColor: '#f9fafb',
  paddingTop: APP_BAR_MOBILE + 24,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  return (
    <StyledRoot>
      <Narbar />

      {/* <Nav openNav={open} onCloseNav={() => setOpen(false)} /> */}
      <Outlet />
    </StyledRoot>
  );
}
