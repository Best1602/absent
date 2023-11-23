import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SickOutlinedIcon from "@mui/icons-material/SickOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import HouseIcon from "@mui/icons-material/House";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function InsetDividers() {
  const location = useLocation();
  const username = location.state?.user;

  const [absentTypes, setAbsentTypes] = useState({
    TotalBusiness: 0,
    TotalSick: 0,
    TotalOther: 0,
    TotalTakeAnnual: 0,
  });

  useEffect(() => {
    if (username) {
      axios
        .get(`${import.meta.env.VITE_API_SERVICE}/absent_type`, {
          params: { username },
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
          console.log(updatedAbsentTypes);
        })
        .catch((error) => {
          console.error("Error fetching absent types:", error);
        });
    }
  }, [username]);

  const getIconByType = (type) => {
    if (type === "Absent Sick") return <SickOutlinedIcon />;
    if (type === "Absent Business") return <BusinessCenterIcon />;
    if (type === "Absent Other") return <HouseIcon />;
    return <KitesurfingIcon />;
  };

  return (
    <List
      sx={{
        width: "100%",
        m: -1,
        marginLeft: 1,
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: "#97B8F8" }}>
            {getIconByType("Absent Sick")}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              fontFamily="IBM Plex Sans Thai"
              textTransform={"uppercase"}
              color={"#000"}
              fontStyle={"normal"}
              fontWeight={"500"}
              lineHeight={"normal"}
            >
              Sick leave
            </Typography>
          }
          secondary={`Total: ${absentTypes.TotalSick} / 30 `}
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: "#97B8F8" }}>
            {getIconByType("Absent Business")}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              fontFamily="IBM Plex Sans Thai"
              color={"#000"}
              textTransform={"uppercase"}
              fontStyle={"normal"}
              fontWeight={"500"}
              lineHeight={"normal"}
            >
              Business leave
            </Typography>
          }
          secondary={`Total: ${absentTypes.TotalBusiness} / 3`}
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            sx={{
              backgroundColor: "#97B8F8",
            }}
          >
            {getIconByType("Absent Other")}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              fontFamily="IBM Plex Sans Thai"
              color={"#000"}
              textTransform={"uppercase"}
              fontStyle={"normal"}
              fontWeight={"500"}
              lineHeight={"normal"}
            >
              Other leave
            </Typography>
          }
          secondary={`Total: ${absentTypes.TotalOther} / 30`}
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: "#97B8F8" }}>
            {getIconByType("Absent Take Annual")}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              fontFamily="IBM Plex Sans Thai"
              color={"#000"}
              textTransform={"uppercase"}
              fontStyle={"normal"}
              fontWeight={"500"}
              lineHeight={"normal"}
            >
              Vacation leave
            </Typography>
          }
          secondary={`Total: ${absentTypes.TotalTakeAnnual} / 6`}
        />
      </ListItem>
    </List>
  );
}
