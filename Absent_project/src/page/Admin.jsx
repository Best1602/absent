import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Narbar from "../component/Narbar";
import SignUp from "./SignUp";
import Paper from "@mui/material/Paper";
import Alluser from "../component/Alluser";
import Repost from "../page/Repost";
import Eleaving from "../component/E-leaving";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Narbar />
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Newuser" {...a11yProps(0)} />
            <Tab label="Report" {...a11yProps(1)} />
            <Tab label="User" {...a11yProps(2)} />
            <Tab label="E-leaving" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          value={value}
          index={0}
        >
          <SignUp />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Repost />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Alluser />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Eleaving />
        </CustomTabPanel>
      </Box>
    </>
  );
}
