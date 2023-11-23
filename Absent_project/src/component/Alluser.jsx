import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@mui/material";
import Swal from "sweetalert2";

export default function DataGridDemo() {
  const columns = [
    {
      field: "row_id",
      headerName: "ID",
      width: 90,
      headerClassName: "custom-header",
    },
    {
      field: "imguser",
      headerName: "imguser",
      headerClassName: "custom-header",
      width: 90,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={
              params.row.imguser
                ? `${import.meta.env.VITE_API_SERVICE}/user-image/${
                    params.row.username
                  }`
                : "./imges/Ellipse 24.png" // Replace with the path to your default image
            }
            alt="User"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
    },
    {
      field: "prefix",
      headerName: "prefix",
      headerClassName: "custom-header",
      width: 90,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "firstname",
      headerName: "firstname",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "lastname",
      headerName: "lastname",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "nickname",
      headerName: "Nickname",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "username",
      headerName: "Username",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "password",
      headerName: "Password",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "longevity1",
      headerClassName: "custom-header",
      headerName: "longevity",
      width: 220,
    },
    {
      field: "date_time_start",
      headerName: "date_time_start",
      headerClassName: "custom-header",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      field: "jobposition",
      headerName: "Jobposition",
      headerClassName: "custom-header",
      width: 200,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "department",
      headerClassName: "custom-header",
      headerName: "Department",
      width: 150,
      editable: true,
      onEditCellChange: (params) => handleEdit(params),
    },
    {
      field: "save",
      headerName: "Save",
      headerClassName: "custom-header",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(params.row)}
        >
          Save
        </Button>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  const [editedRow, setEditedRow] = useState(null);
  const [page, setPage] = useState(1); // หน้าปัจจุบัน
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    fetchUserData(page, pageSize); // เรียกใช้เมื่อคอมโพเนนต์ถูกโหลด
  }, [page, pageSize]); // ให้เรียกใช้เมื่อ page หรือ pageSize เปลี่ยน

  const fetchUserData = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE}/Alluser`,
        {
          params: {
            page: page,
            pageSize: pageSize,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.map((row, index) => ({
          ...row,
          id: row.row_id,
        }));

        setRows(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleEdit = (params) => {
    setEditedRow(params.row);

    // ตรวจสอบว่าปุ่ม Enter ถูกกด
    if (params.key === "Enter") {
      confirmAndEdit(); // แสดง sweetalert2 และแก้ไขหากยืนยัน
    }
  };

  const handleSave = async (rowData) => {
    try {
      // แสดงข้อความแจ้งเตือนก่อนส่ง API

      // สร้างออบเจ็กต์ที่จะส่งไปยัง API
      const dataToSend = {
        row_id: rowData.row_id,
        prefix: rowData.prefix,
        nickname: rowData.nickname,
        username: rowData.username,
        password: rowData.password,
        date_time_start: rowData.date_time_start,
        jobposition: rowData.jobposition,
        department: rowData.department,
      };

      // ทำ HTTP POST request ไปยัง API
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICE}/updateUser`,
        dataToSend
      );

      if (response.status === 200) {
        // ถ้าบันทึกสำเร็จ ปิด SweetAlert
        Swal.close();

        // แจ้งเตือนบันทึกสำเร็จ
        Swal.fire({
          title: "บันทึกสำเร็จ",
          text: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
          icon: "success",
        });
      } else {
        // ถ้าเกิดข้อผิดพลาดในการส่ง API
        Swal.close();

        // แจ้งเตือนข้อผิดพลาด
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating user data:", error);

      // ปิด SweetAlert แสดงข้อความแจ้งเตือน
      Swal.close();

      // แจ้งเตือนข้อผิดพลาด
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        icon: "error",
      });
    }

    // ล้างข้อมูลที่ถูกแก้ไข
    setEditedRow(null);
  };

  const confirmAndEdit = () => {
    // แสดงข้อความแจ้งเตือน
    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูล",
      text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนี้?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "แก้ไข",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave(editedRow);
      }
    });
  };

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        pageSize={pageSize}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 11 },
          },
        }}
        pagination={true}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchUserData(newPage, pageSize);
        }}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          fetchUserData(page, newPageSize);
        }}
        editMode="row"
        editOnClick={true}
        onCellKeyDown={(params, event) => handleEdit(params, event)}
      />
    </Box>
  );
}
