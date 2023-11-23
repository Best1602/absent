import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function CustomFilter({
  onFilterChange,
  searchValue,
  selectValue,
  statusValue,
}) {
  const handleSearchChange = (event) => {
    const value = event.target.value;
    onFilterChange(value, selectValue, statusValue); // ส่งค่า statusValue มาด้วย
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    onFilterChange(searchValue, value, statusValue); // ส่งค่า statusValue มาด้วย
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    onFilterChange(searchValue, selectValue, value); // ส่งค่า statusValue มาด้วย
  };
  const buttonStyle = {
    marginLeft: "8px",
    marginBottom: "8px",
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={buttonStyle}>
          <TextField
            type="text"
            placeholder="ชื่อ หรือ ชื่อเล่น"
            value={searchValue}
            onChange={handleSearchChange}
            size="small"
          />
        </div>
        <div style={buttonStyle}>
          <FormControl variant="outlined" size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={selectValue}
              onChange={handleSelectChange}
              label="Type"
              placeholder="typabsent"
              style={{ minWidth: "160px" }}
            >
              <MenuItem value="Absent Sick">Sick leave</MenuItem>
              <MenuItem value="Absent Business">Business leave</MenuItem>
              <MenuItem value="Absent Other">Other leave</MenuItem>
              <MenuItem value="Absent Take Annual">Vacation leave</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={buttonStyle}>
          <FormControl variant="outlined" size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusValue}
              onChange={handleStatusChange}
              label="Status"
              style={{ minWidth: "160px" }}
            >
              <MenuItem value="START">START</MenuItem>
              <MenuItem value="SEND TO CHIEF APPROVE">
                SEND TO CHIEF APPROVE
              </MenuItem>
              <MenuItem value="CHIEF APPROVED">CHIEF APPROVED</MenuItem>
              <MenuItem value="PERSONAL APPROVED">PERSONAL APPROVED</MenuItem>
              <MenuItem value="CEO APPROVED">CEO APPROVED</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

export default CustomFilter;
