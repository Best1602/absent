import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Table from "../component/Table";
import TableApproved from "../component/TableApproved";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useLocation } from "react-router-dom";
export default function LabTabs() {
  const [value, setValue] = React.useState("1");
  const location = useLocation();
  const userDataFromSignIn = location.state?.jobposition;
  const [userData, setUserData] = useState(userDataFromSignIn || {});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              sx={{ fontFamily: "IBM Plex Sans Thai" }}
              label="employee"
              value="1"
            />
            <Tab
              sx={{ fontFamily: "IBM Plex Sans Thai" }}
              label="Approved"
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="2">
          <TableApproved />
        </TabPanel>
        <TabPanel value="1">
          <Table />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
