import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import flexMessage from "../Line/flexMessage";
import DialogActions from "@mui/material/DialogActions";
import Swal from "sweetalert2";
export default function DataTable({ data }) {
  const [rows, setRows] = React.useState([]);
  const [approvedRows, setApprovedRows] = React.useState([]);
  const [cancelledRows, setCancelledRows] = React.useState([]);
  const [dataVersion, setDataVersion] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [showSecondImage, setShowSecondImage] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState([]);
  console.log(selectedImages);
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    typabsent: "",
    startabsent: "",
    endabsent: "",
    datillabsent: "",
    name: "",
    cancellationComment: "",
  });

  const showDateFormat = (dateString, timeString) => {
    const [year, month, day] = dateString.split("-");
    const [hour, min] = timeString;
    // consst [] = timeString
    return `${day}/${month}/${year.substring(2)} ${Number(hour > 10) ? hour : hour
      }:${Number(min > 10) ? min : min}`;
  };
  const location = useLocation();
  const userDataFromSignIn = location.state?.user;

  const sendLineNotify = (message) => {
    axios
      .post(`${import.meta.env.VITE_API_SERVICE}/sendLineNotify`, {
        flexMessage: message,
      })
      .then((response) => {
        console.log("LINE Notify sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending LINE Notify:", error);
      });
  };

  const handleButtonClick = (
    rowId,
    name1,
    typabsent,
    startabsent,
    endabsent,
    datillabsent,
    username,
    nickname,
    jobposition
  ) => {
    console.log("Job Position:", jobposition);
    console.log("name1", name1);
    console.log("Approved");
    console.log(startabsent);
    console.log(username);
    if (approvedRows.includes(rowId, name1, username)) {
      Swal.fire({
        icon: "info",
        title: `กดไปแล้ว`,
        text: `กดใบนี้ไปแล้ว${rowId}ของ${name1}  ${username}`,
      });
      return;
    }
    console.log(approvedRows);
    console.log(cancelledRows);
    // แสดง SweetAlert และถามผู้ใช้
    Swal.fire({
      icon: "warning",
      title: "Want to send a leave letter?",
      text: "This leave letter will be sent to the supervisor for consideration accordingly.",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // ผู้ใช้กด Confirm ให้ดำเนินการตามต้องการ
        const loggedInJobPosition = userDataFromSignIn.jobposition;
        setApprovedRows([...approvedRows, rowId]);
        let updatedId;
        let imguser;
        if (loggedInJobPosition === "Business Product Director") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Assistant Personal Manager") {
          updatedId = 4;
          const message = flexMessage(
            rowId,
            name1,
            typabsent,
            startabsent,
            endabsent,
            datillabsent,
            imguser,
            username,
            nickname,
            jobposition
          );
          sendLineNotify(message);
        } else if (loggedInJobPosition === "CEO") {
          updatedId = 5;
        } else if (loggedInJobPosition === "Audit Division Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "AI&Support  Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Assistant Digital Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Assistant Purchasing Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Sales & Marketing Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Project Manager") {
          updatedId = 3;
        } else if (loggedInJobPosition === "Financial Manager") {
          updatedId = 3;
        } else {
          updatedId = 2;
        }

        const updatedRows = rows.map((row) =>
          row.row_id === rowId ? { ...row, id: updatedId } : row
        );

        setRows(updatedRows);
        console.log(updatedId);

        axios
          .put(`${import.meta.env.VITE_API_SERVICE}/updateStatus`, {
            row_id: rowId,
            user: userDataFromSignIn,
          })
          .then((response) => {
            console.log("Data updated successfully:", response.data);

            Swal.fire({
              icon: "success",
              title: "Successfully submit leave",
              text: "Please wait for the next step.",
              timer: 1500,
            });

            setDataVersion((prevVersion) => prevVersion + 1);
          })
          .catch((error) => {
            console.error("Error updating data:", error);

            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error updating data",
            });
          });
      }
    });
  };
  const handleButtonClick1 = (rowId) => {
    console.log("Cancel button clicked for row ID:", rowId);
    if (cancelledRows.includes(rowId)) {
      {
        Swal.fire({
          icon: "info",
          title: `กดไปแล้ว`,
          text: `กดใบนี้ไปแล้ว${rowId}`,
        });
        return;
      }
    }
    const loggedInJobPosition1 = userDataFromSignIn.jobposition;
    let updatedId;

    if (loggedInJobPosition1 === "Bussineess Product Director") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Financial Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Sales & Marketing Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Assistant Purchasing Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "AI&Support  Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Assistant Digital Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Audit Division Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Project Manager") {
      updatedId = 6;
    } else if (loggedInJobPosition1 === "Assistant Personal Manager") {
      updatedId = 7;
    } else if (loggedInJobPosition1 === "CEO") {
      updatedId = 8;
    } else {
      updatedId = 9;
    }

    const updatedRows = rows.map((row) =>
      row.row_id === rowId ? { ...row, id: updatedId } : row
    );

    setRows(updatedRows);
    console.log(updatedId);

    Swal.fire({
      icon: "warning",
      title: "The system has canceled your leave application?",
      text: "Canceling leave will retain your leave request information.",
      input: "text",
      inputLabel: "Please specify a note.",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const cancellationComment = result.value;
        setCancelledRows([...cancelledRows, rowId]);
        console.log(cancellationComment);
        axios
          .put(`${import.meta.env.VITE_API_SERVICE}/cancelStatus`, {
            row_id: rowId,
            user: userDataFromSignIn,
            cancellationComment: cancellationComment,
          })
          .then((response) => {
            console.log("Data updated successfully:", response.data);

            Swal.fire({
              icon: "success",
              title: "Cancellation successful",
              text: "The system has canceled your leave application.",
              timer: 1500,
            });

            setDataVersion((prevVersion) => prevVersion + 1);
          })
          .catch((error) => {
            console.error("Error updating data:", error);

            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error updating data",
            });
          });
      }
    });
  };

  const handleImageClick = (imagePath, imagePath2) => {
    const fileExtension1 = getFileExtension(imagePath);
    const fileExtension2 = getFileExtension(imagePath2);
    console.log(imagePath);
    console.log(imagePath2);
    if (fileExtension1 !== "pdf" && fileExtension2 !== "pdf") {
      // Display the images in a dialog
      const imageUrl = `${import.meta.env.VITE_API_SERVICE
        }/uploads/${imagePath}`;
      const imageUrl1 = `${import.meta.env.VITE_API_SERVICE
        }/uploads/${imagePath2}`;
      setSelectedImages([imageUrl, imageUrl1]);
      setIsDialogOpen(true);
    } else {
      // Open a new tab to display the PDF files
      window.open(
        `${import.meta.env.VITE_API_SERVICE}/uploads/${imagePath}`,
        "_blank"
      );
      window.open(
        `${import.meta.env.VITE_API_SERVICE}/uploads/${imagePath2}`,
        "_blank"
      );
    }
  };
  const getFileExtension = (filename) => {
    if (filename) {
      return filename.split(".").pop().toLowerCase();
    }
    return ""; // Handle the case when filename is undefined or falsy
  };
  const handleFilterChange = (params, event) => {
    const { field, value } = event.target;
    setFilterModel((prevModel) => ({
      ...prevModel,
      [field]: value,
    }));
  };
  const columns = [
    {
      field: "row_id",
      headerName: "Doc No.",
      width: 80,
      headerClassName: "custom-header",
    },

    {
      field: "username",
      headerName: "Employee id",
      width: 100,
      headerClassName: "custom-header",
    },

    {
      field: "name1",
      headerName: "name",
      width: 150,
      headerClassName: "custom-header",
    },

    {
      field: "typabsent",
      headerName: "Type",
      width: 150,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("typabsent", event),
      renderCell: (params) => {
        const isSickLeave = params.value === "Absent Sick";
        const isBusinessLeave = params.value === "Absent Business";
        const isOtherLeave = params.value === "Absent Other";
        const isAnnualLeave = params.value === "Absent Take Annual";
        let displayText = params.value;
        let textColor = "#8F7DC7";
        if (isSickLeave) {
          displayText = "Sick leave";
          textColor = "#E04A6C"; // สีสำหรับ Sick Leave
        } else if (isBusinessLeave) {
          displayText = "Business leave";
          textColor = "EDA364";
        } else if (isOtherLeave) {
          displayText = "Other leave";
          textColor = "25949B";
        } else if (isAnnualLeave) {
          displayText = "Vacation leave";
          textColor = "8F7DC7";
        }
        return (
          <div
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              color: isSickLeave
                ? "#E04A6C"
                : isBusinessLeave
                  ? "#EDA364"
                  : isOtherLeave
                    ? "#25949B"
                    : isAnnualLeave
                      ? "#8F7DC7"
                      : "#8F7DC7", // Default color if none of the above conditions match
              backgroundColor: isSickLeave
                ? "#FCEEF1"
                : isBusinessLeave
                  ? "#FFEFE1"
                  : isOtherLeave
                    ? "#E1F8F8"
                    : isAnnualLeave
                      ? "#E3E1F8"
                      : "#E3E1F8", // Default color if none of the above conditions match
              borderRadius: "10px",

              padding: "4px 8px",
            }}
          >
            {displayText}
          </div>
        );
      },
    },
    {
      field: "submitDateTime",
      headerName: "Key date",
      width: 150,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("startabsent", event),
      valueFormatter: (params) => {
        if (params.value) {
          return showDateFormat(
            params.value.split("T")[0],
            params.value.split("T")[1].split(".")[0].split(":")
          );
        }
        return "";
      },
    },
    {
      field: "startabsent",
      headerName: "start",
      width: 150,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("startabsent", event),
      valueFormatter: (params) => {
        if (params.value) {
          return showDateFormat(
            params.value.split("T")[0],
            params.value.split("T")[1].split(".")[0].split(":")
          );
        }
        return "";
      },
    },
    {
      field: "endabsent",
      headerName: "end",
      width: 150,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("endabsent", event),
      valueFormatter: (params) => {
        if (params.value) {
          // ตรวจสอบค่า null ก่อน
          return showDateFormat(
            params.value.split("T")[0],
            params.value.split("T")[1].split(".")[0].split(":")
          );
        }
        return ""; // หรือค่าที่คุณต้องการเมื่อ params.value เป็น null
      },
    },
    {
      field: "datillabsent",
      headerName: "Detail",
      type: "string",
      width: 250,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("datillabsent", event),
      tooltip: (params) => {
        return `<div style="max-width: 300px; white-space: normal; color: red; font-size: 80px; cursor: pointer;">${params.value}</div>`;
      },
    },
    {
      field: "name",
      headerName: "Status ",
      type: "string",
      width: 200,
      headerClassName: "custom-header",
      onFilterChange: (event) => handleFilterChange("name", event),
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            color:
              params.value === "START"
                ? "#5DA1DD"
                : params.value === "SEND TO CHIEF APPROVE"
                  ? "#24B1C7"
                  : params.value === "CHIEF APPROVED"
                    ? "#0EC07A"
                    : params.value === "PERSONAL APPROVED"
                      ? "#0EC07A"
                      : params.value === "CEO APPROVED"
                        ? "#0EC07A"
                        : params.value === "CHIEF CANCELLED"
                          ? "#FF5052"
                          : params.value === "PERSONAL CANCELLED"
                            ? "#FF5052"
                            : params.value === "CEO CANCELLED"
                              ? "#FF5052"
                              : params.value === "EMPOPLOYEE CANCEL"
                                ? "#FF5052"
                                : "#FF5052",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "button",
      headerName: "",
      type: "string",
      width: 100,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const loggedInJobPosition = userDataFromSignIn.jobposition;
        const isSendToChiefApprove =
          (params.row.name === "SEND TO CHIEF APPROVE" ||
            params.row.name === "CEO APPROVED" ||
            params.row.name === "PERSONAL APPROVED" ||
            params.row.name === "CHIEF APPROVED" ||
            params.row.name === "PERSONAL CANCELLED" ||
            params.row.name === "CHIEF CANCELLED" ||
            params.row.name === "CEO CANCELLED" ||
            params.row.name === "EMPOPLOYEE CANCEL") &&
          !(
            (loggedInJobPosition === "Assistant Personal Manager" &&
              params.row.name === "CHIEF APPROVED") ||
            (loggedInJobPosition === "Assistant Personal Manager" &&
              params.row.name === "PERSONAL CANCELLED") ||
            (loggedInJobPosition === "Business Product Director" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Audit Division Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Sales & Marketing Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Assistant Purchasing Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Senior Purchasing" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Financial Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Assistant Personal Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Assistant Digital Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "AI&Support  Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "Project Manager" &&
              params.row.name === "SEND TO CHIEF APPROVE") ||
            (loggedInJobPosition === "CEO" &&
              params.row.name === "PERSONAL APPROVED")
          );

        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ backgroundColor: "#2DC598" }}
            onClick={() =>
              handleButtonClick(
                params.row.row_id,
                params.row.name1,
                params.row.typabsent,
                params.row.startabsent,
                params.row.endabsent,
                params.row.datillabsent,
                params.row.username,
                params.row.nickname,
                loggedInJobPosition
              )
            }
            disabled={isSendToChiefApprove}
          >
            Approved
          </Button>
        );
      },
    },
    {
      field: "button1",
      headerName: "",
      type: "string",
      width: 130,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const loggedInJobPosition1 = userDataFromSignIn.jobposition;
        const isSendToChiefApprove1 =
          (params.row.name === "EMPOPLOYEE CANCEL" ||
            params.row.name === "CHIEF CANCELLED" ||
            params.row.name === "PERSONAL CANCELLED" ||
            params.row.name === "CEO CANCELLED" ||
            params.row.name === "CEO APPROVED" ||
            params.row.name === "PERSONAL APPROVED" ||
            params.row.name === "CHIEF APPROVED") &&
          !(
            (loggedInJobPosition1 === "Assistant Personal Manager" &&
              params.row.name === "CHIEF APPROVED") ||
            (loggedInJobPosition1 === "Business Product Director" &&
              params.row.name === "CHIEF CANCELLED") ||
            (loggedInJobPosition1 === "CEO" &&
              params.row.name === "PERSONAL APPROVED")
          );
        return (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleButtonClick1(params.row.row_id)}
            disabled={isSendToChiefApprove1}
          >
            Cancel
          </Button>
        );
      },
    },
    {
      field: "buttonView",
      headerName: "",
      type: "string",
      width: 130,
      headerClassName: "custom-header",
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() =>
            handleImageClick(params.row.file_path, params.row.file_path2)
          }
        >
          View
        </Button>
      ),
    },

    {
      field: "cancellationComment",
      headerName: "annotation",
      type: "string",
      width: 150,
      headerClassName: "custom-header",
    },
  ];

  const filterDataByJobPosition = (data, jobPosition, username) => {
    switch (jobPosition) {
      case "Software Tester":
        return data.filter((row) => row.username === username);

      case "Business Product Director":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED") &&
            (row.username === "000661" ||
              row.username === "000236" ||
              row.username === "000119" ||
              row.username === "000489" ||
              row.username === "000513" ||
              row.username === "000519" ||
              row.username === "000520" ||
              row.username === "000521" ||
              row.username === "000531" ||
              row.username === "000585" ||
              row.username === "000601" ||
              row.username === "000605" ||
              row.username === "000606" ||
              row.username === "000607" ||
              row.username === "000627" ||
              row.username === "000628" ||
              row.username === "000631" ||
              row.username === "000633" ||
              row.username === "000636" ||
              row.username === "000640" ||
              row.username === "000641" ||
              row.username === "000648" ||
              row.username === "000655" ||
              row.username === "000656" ||
              row.username === "000658" ||
              row.username === "000659" ||
              row.username === "000647" ||
              row.username === "000665" ||
              row.username === "000019" ||
              row.username === "000646" ||
              row.username === "000478")
        );
      case "AI&Support  Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            (row.username === "000344" ||
              row.username === "000411" ||
              row.username === "000506" ||
              row.username === "000512" ||
              row.username === "000533" ||
              row.username === "000576" ||
              row.username === "000413" ||
              row.username === "000657" ||
              row.username === "000475")
        );

      case "Audit Division Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED") &&
            [
              "000597",
              "000649",
              "000650",
              "000292",
              "000642",
              "000664",
              "000225",
              "000323",
              "000336",
              "000619",
              "000620",
            ].includes(row.username)
        );

      case "Sales & Marketing Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            [
              "000561",
              "000645",
              "000653",
              "000660",
              "000651",
              "000668",
              "000672",
              "000673",
              "000674",
            ].includes(row.username)
        );

      case "Assistant Digital Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            ["000245", "000434", "000652", "000662"].includes(row.username)
        );

      case "Assistant Purchasing Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            (["000438", "000438"].includes(row.username) ||
              row.username === username)
        );
      case "Project Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            (["000305", "000305"].includes(row.username) ||
              row.username === username)
        );

      case "Financial Manager":
        return data.filter(
          (row) =>
            (row.name === "SEND TO CHIEF APPROVE" ||
              row.name === "CHIEF APPROVED" ||
              row.name === "CHIEF CANCELLED") &&
            (["000556", "000556"].includes(row.username) ||
              row.username === username)
        );

      case "Assistant Personal Manager":
        return data.filter(
          (row) =>
            (row.name === "CHIEF APPROVED" ||
              (row.name === "SEND TO CHIEF APPROVE" &&
                ["000486", "000560", "000621", "000635"].includes(
                  row.username
                ))) &&
            row.name !== "CHIEF CANCELLED"
        );

      case "CEO":
        return data.filter(
          (row) =>
            row.name === "PERSONAL APPROVED" ||
            row.name === "CEO APPROVED" ||
            row.name === "CEO CANCELLED"
        );

      default:
        // กรณีบทบาทงานอื่น ๆ
        return data.filter((row) => row.username === username);
    }
  };

  React.useEffect(() => {
    axios

      .get(`${import.meta.env.VITE_API_SERVICE}/table`)
      .then((response) => {
        const loggedInJobPosition = userDataFromSignIn.jobposition;
        const username = userDataFromSignIn.username;
        const filteredRows = filterDataByJobPosition(
          response.data,
          loggedInJobPosition,
          username
        );
        handleButtonClick;
        handleButtonClick1;
        setRows(filteredRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ height: 440, width: "100%", borderRadius: "8px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.row_id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        className="custom-row"
      />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          style: {
            width: "100vw",
            height: "100vh",
            padding: 0,
          },
        }}
      >
        <DialogTitle>File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              {showSecondImage ? (
                selectedImages
                  .filter((image) => image !== null)
                  .map((image, index) => (
                    <div key={index}>
                      {image.endsWith("/null") || image === "null" ? (
                        <img
                          src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_1280.jpg"
                          alt={`ไม่มีรูปภาพที่ ${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100vh",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <img
                          src={image}
                          alt={`รูปภาพที่ ${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100vh",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  ))
              ) : selectedImages.length > 0 ? (
                selectedImages.map((image, index) => (
                  <div key={index}>
                    {image.endsWith("/null") || image === "null" ? (
                      <img
                        src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_1280.jpg"
                        alt={`ไม่มีรูปภาพที่ ${index + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100vh",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        src={image}
                        alt={`รูปภาพที่ ${index + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100vh",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_1280.jpg"
                  alt={`ไม่มีรูปภาพ`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100vh",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button
            color="primary"
            onClick={() => setShowSecondImage(!showSecondImage)}
          >
            {showSecondImage ? "รูปภาพที่ 1" : "รูปภาพที่ 2"}
          </Button> */}
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
