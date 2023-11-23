import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Box } from "@mui/material";

export default function ResponsivePickers() {
  return (
    <Box sx={{ display: "flex", margin: "9px" }}>
      {/* <Box>
        {"วันแรกที่ลา "}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker defaultValue={dayjs("2022-04-17")} />
        </LocalizationProvider>
      </Box>
      <Box>
        {"วันแรกที่ลา "}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker defaultValue={dayjs("2022-04-17")} />
        </LocalizationProvider>
      </Box> */}
    </Box>
  );
}
