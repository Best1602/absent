const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const axios = require("axios");
const sanitize = require("sanitize-filename");
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),

  fileFilter: (req, file, callback) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"]; // ประเภทไฟล์ที่ยอมรับ

    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true); // ยอมรับไฟล์ประเภทที่กำหนด
    } else {
      callback(
        new Error("Only jpeg, png or pdf files are allowed to upload."),
        false
      ); // ไม่ยอมรับไฟล์ประเภทอื่น
    }
  },
}).fields([
  { name: "file1", maxCount: 1 }, // รับไฟล์จากฟิลด์ 'file1' ที่ส่งมา 1 ไฟล์
  { name: "file", maxCount: 1 }, // รับไฟล์จากฟิลด์ 'file2' ที่ส่งมา 1 ไฟล์
]);
// กำหนดการเชื่อมต่อ
const config = {
  user: "sa",
  server: "203.154.174.129",
  password: "softwaredbo",
  // server: "192.168.1.160",
  // password: "warehousedbo",
  port: 1443, // ระบุ port ของ SQL Server แยกออกมา
  database: "similan_absent",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/imguser", express.static(__dirname + "/imguser"));
// สร้างเส้นทาง API
app.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM employee");
    res.json(result.recordset);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการทำคำสั่ง SQL:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการทำคำสั่ง SQL" });
  }
});
app.get("/user-image/:username", async (req, res) => {
  try {
    const { username } = req.params; // รับค่า username จาก URL parameter
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT imguser FROM users WHERE username = @username");

    if (result.recordset.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = result.recordset[0];

    if (!user.imguser) {
      res.status(404).json({ error: "Image not found for this user" });
      return;
    }

    // ส่งรูปภาพกลับเป็น response
    res.sendFile(__dirname + "/imguser/" + user.imguser);
  } catch (err) {
    console.error("Error fetching user image:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user image" });
  }
});
app.get("/Alluser", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT *,
    CONCAT(
        DATEDIFF(YEAR, date_time_start, GETDATE()), ' years ',
        CASE
            WHEN DATEPART(DAY, GETDATE()) < DATEPART(DAY, date_time_start)
            THEN DATEDIFF(MONTH, date_time_start, GETDATE()) - 1
            ELSE DATEDIFF(MONTH, date_time_start, GETDATE())
        END % 12, ' months ',
        CASE
            WHEN DATEPART(DAY, GETDATE()) < DATEPART(DAY, date_time_start)
            THEN DATEDIFF(DAY, DATEADD(MONTH, DATEDIFF(MONTH, date_time_start, GETDATE()) - 1, date_time_start), GETDATE())
            ELSE DATEDIFF(DAY, DATEADD(MONTH, DATEDIFF(MONTH, date_time_start, GETDATE()), date_time_start), GETDATE())
        END, ' days'
    ) AS longevity1
FROM users`);
    res.json(result.recordset);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการทำคำสั่ง SQL:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการทำคำสั่ง SQL" });
  }
});
app.put("/updateFile/:rowId", upload, async (req, res) => {
  const { rowId } = req.params;
  const { files } = req; // เปลี่ยนจาก file เป็น files
  console.log("rowId", rowId);
  console.log("files", files); // เปลี่ยนจาก file เป็น files

  try {
    if (!files || !files.file) {
      throw new Error("No file uploaded"); // ตรวจสอบว่ามีไฟล์ถูกส่งมาหรือไม่
    }

    const pool = await sql.connect(config);

    // อัปเดตค่า file_path2 ในฐานข้อมูล SQL
    await pool
      .request()
      .input("rowId", sql.Int, rowId)
      .input("file_path2", sql.NVarChar, files.file[0].filename) // รับไฟล์จาก files.file
      .query(
        "UPDATE tyeabsent SET [file_path2] = @file_path2 WHERE [row_id] = @rowId"
      );

    res.json({ success: true, message: "File updated successfully" });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the file",
    });
  } finally {
    await sql.close(); // ปิดการเชื่อมต่อฐานข้อมูล
  }
});
app.get("/table", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(
      `
      SELECT
          ty.row_id,
          ty.typabsent,
          ty.datillabsent,
          ty.username,
          ty.startabsent,
          ty.endabsent,
          ty.file_path,
          ty.file_path2,
          ty.cancellationComment,  
	  ty.submitDateTime,
        u.firstname + ' ' +u.lastname as name1, 
        u.department,
        u.imguser,
          ab.name,
          u.jobposition,
          u.firstname,
          u.nickname,
          u.lastname
      FROM tyeabsent ty
      INNER JOIN absent_status ab ON ty.id = ab.id
      INNER JOIN users u ON ty.username = u.username;`
    );
    // console.log(result);
    res.json(result.recordset);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการทำคำสั่ง SQL:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการทำคำสั่ง SQL" });
  }
});

app.get("/repost", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { startDate, endDate } = req.query;

    // แปลงวันที่และเวลาให้อยู่ในรูปแบบที่ถูกต้อง
    const formattedStartDate = new Date(startDate).toISOString(); // ให้แสดงเฉพาะวันที่ (ไม่รวมเวลา)
    const formattedEndDate = new Date(endDate).toISOString(); // ให้รวมวันที่และเวลา

    console.log("formattedStartDate", formattedStartDate);
    console.log("formattedEndDate", formattedEndDate);

    const query = `SELECT 
    t.startabsent, 
    t.endabsent,
    t.typabsent, 
    t.datillabsent, 
    u.nickname, 
    u.firstname, 
    u.lastname, 
    t.id, 
    t.row_id,
    FORMAT(t.startabsent, 'dd/MM/yyyy HH:mm') AS formattedStartDate,
    FORMAT(t.endabsent, 'dd/MM/yyyy HH:mm') AS formattedEndabsent,
    t.username,
    u.jobposition,
    FORMAT(t.Approved, 'dd/MM/yyyy HH:mm') AS formattedApproved,
    FORMAT(t.submitDateTime, 'dd/MM/yyyy HH:mm') AS formattedsubmitDateTime,
    u.department,
    CONCAT(
        daysDifference,
        '-',
        hoursDifference,
        ':',
        MINUTEsDifference
    ) AS combinedDifference
FROM (
    SELECT
        t.*,
        CASE
            WHEN (CONVERT(char(8), t.endabsent, 108) = '17:30:00' OR CONVERT(char(8), t.endabsent, 108) = '16:30:00') AND (CONVERT(char(8), t.startabsent, 108) = '08:30:00' OR CONVERT(char(8), t.startabsent, 108) = '07:30:00')
            THEN DATEDIFF(MINUTE, t.startabsent, t.endabsent) + 900
            ELSE DATEDIFF(MINUTE, t.startabsent, t.endabsent)
        END / 1440 AS daysDifference,
        CASE
 WHEN (CONVERT(char(8), t.endabsent, 108) = '17:30:00' OR CONVERT(char(8), t.endabsent, 108) = '16:30:00') AND (CONVERT(char(8), t.startabsent, 108) = '08:30:00' OR CONVERT(char(8), t.startabsent, 108) = '07:30:00')
            THEN ((DATEDIFF(MINUTE, t.startabsent, t.endabsent) + 900) / 60) % 24
            ELSE FLOOR(DATEDIFF(MINUTE, t.startabsent, t.endabsent) / 60.0) % 24
        END AS hoursDifference,
        DATEDIFF(MINUTE, t.startabsent, t.endabsent) % 60 AS MINUTEsDifference
    FROM tyeabsent t
) AS t
JOIN users u ON t.username = u.username
WHERE  t.startabsent >= CAST(@startDate AS DATETIME)
            AND t.startabsent <= CAST(@endDate AS DATETIME)
            AND t.id = '5'
ORDER BY 
    CASE u.department
        WHEN 'Audit' THEN 1
        WHEN 'Sale' THEN 2
        WHEN 'Engineer' THEN 3
        WHEN 'Software' THEN 4
        WHEN 'warehouse' THEN 5
        WHEN 'Purchasing' THEN 6
        WHEN 'Personnel' THEN 7
        WHEN 'Finance' THEN 8
        ELSE 9 
    END,  
    t.username ASC, 
    formattedStartDate ASC, 
    formattedEndabsent ASC;
 `;

    const result = await pool
      .request()
      .input("startDate", sql.DateTime, startDate)
      .input("endDate", sql.DateTime, endDate)
      .query(query);

    if (result.recordset && result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.json({ error: "No data found for the provided date range" });
    }
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while executing SQL query" });
  }
});
app.get("/absent_type", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { username } = req.query; // รับค่า username จาก query parameter

    const query = `
    SELECT
    SUM(CASE 
    WHEN typabsent = 'Absent Business' AND id = 5 then
      case 
        when datediff(day,startabsent,endabsent) = 0 then 1
        else abs(datediff(day,startabsent,endabsent))				
      end
    ELSE 0 
  END
) AS TotalBusiness,
    SUM(
  CASE 
    WHEN typabsent = 'Absent Sick' AND id = 5 THEN 
      case 
        when datediff(day,startabsent,endabsent) = 0 then 1
        else abs(datediff(day,startabsent,endabsent))				
      end
    ELSE 0 
  END
) AS TotalSick,
    SUM(
  CASE 
    WHEN typabsent = 'Absent Other'AND id = 5 THEN 
      case 
        when datediff(day,startabsent,endabsent) = 0 then 1
        else abs(datediff(day,startabsent,endabsent))				
      end
    ELSE 0 
  END
) AS TotalOther,
    SUM(
  CASE 
    WHEN typabsent = 'Absent Take Annual' AND id = 5 THEN 
      case 
        when datediff(day,startabsent,endabsent) = 0 then 1
        else abs(datediff(day,startabsent,endabsent))				
      end
    ELSE 0 
  END
) AS TotalTakeAnnual
  FROM tyeabsent
  WHERE username = '${username.username}'
    `;

    const result = await pool.request().query(query);

    if (result.recordset && result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.json({ error: "No data found for the provided username" });
    }
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while executing SQL query" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query(
        `SELECT *,
        DATEDIFF(YEAR, date_time_start, GETDATE()) AS years,
        CASE
            WHEN DATEPART(DAY, GETDATE()) < DATEPART(DAY, date_time_start)
            THEN DATEDIFF(MONTH, date_time_start, GETDATE()) - 1
            ELSE DATEDIFF(MONTH, date_time_start, GETDATE())
        END % 12 AS months,
        CASE
            WHEN DATEPART(DAY, GETDATE()) < DATEPART(DAY, date_time_start)
            THEN DATEDIFF(DAY, DATEADD(MONTH, DATEDIFF(MONTH, date_time_start, GETDATE()) - 1, date_time_start), GETDATE())
            ELSE DATEDIFF(DAY, DATEADD(MONTH, DATEDIFF(MONTH, date_time_start, GETDATE()), date_time_start), GETDATE())
        END AS days
    FROM users
    WHERE username =  @username`
      );

    if (result.recordset.length === 0) {
      res.json({ success: false, message: "ชื่อผู้ใช้หรือหัสผ่านผิด" });
      return;
    }

    const user = result.recordset[0];

    if (user.password !== password) {
      res.json({ success: false, message: "ชื่อผู้ใช้หรือหัสผ่านผิด" });
      return;
    }

    const token = jwt.sign({ userId: user.user_id }, "your_secret_key", {
      expiresIn: "1h",
    });
    console.log(token);
    res.json({ success: true, token, user });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

app.post("/submitabsent", upload, async (req, res) => {
  try {
    const { username, startabsent, typabsent, datillabsent, endabsent, id } =
      req.body;

    let originalFileName = null;
    let originalFileName2 = null;

    if (req.files) {
      if (req.files.file) {
        originalFileName = req.files.file[0].originalname;
      }
      if (req.files.file1) {
        originalFileName2 = req.files.file1[0].originalname;
      }
    }

    const currentDate = new Date();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("startabsent", sql.NVarChar, startabsent)
      .input("typabsent", sql.NVarChar, typabsent)
      .input("datillabsent", sql.NVarChar, datillabsent)
      .input("endabsent", sql.NVarChar, endabsent)
      .input("id", sql.Int, id)
      .input("filePath", sql.NVarChar, originalFileName)
      .input("filePath2", sql.NVarChar, originalFileName2)
      .input("submitDateTime", sql.DateTime, currentDate)
      .query(
        "INSERT INTO tyeabsent (username, startabsent, typabsent, datillabsent, endabsent, id, file_path, file_path2, submitDateTime) VALUES (@username, @startabsent, @typabsent, @datillabsent, @endabsent, @id, @filePath, @filePath2, @submitDateTime)"
      );

    res.json({
      success: true,
      message: "Leave request submitted successfully",
    });
  } catch (err) {
    console.error("Error submitting leave request:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
app.get("/leaving", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(` SELECT
    ty.row_id,
    ty.typabsent,
    ty.datillabsent,
    ty.username,
    ty.startabsent,
    ty.endabsent,
    ty.file_path,
    ty.file_path2,
    ty.cancellationComment,
  u.firstname + ' ' +u.lastname as name1, 
  u.department,
  u.imguser,
    ab.name,
    u.jobposition,
    u.firstname,
    u.lastname,
    u.nickname
FROM tyeabsent ty
INNER JOIN absent_status ab ON ty.id = ab.id
INNER JOIN users u ON ty.username = u.username;`);
    res.json(result.recordset);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการทำคำสั่ง SQL:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการทำคำสั่ง SQL" });
  }
});
app.put("/updateStatus", async (req, res) => {
  const { row_id, user } = req.body;

  try {
    const loggedInJobPosition = user.jobposition;

    let updatedId;

    if (loggedInJobPosition === "Business Product Director") {
      updatedId = 3;
    } else if (loggedInJobPosition === "Assistant Personal Manager") {
      updatedId = 4;
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

    // console.log(updatedId);
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("row_id", sql.Int, row_id)
      .input("updatedId", sql.Int, updatedId) // เพิ่ม input parameter สำหรับ updatedId
      .query("UPDATE tyeabsent SET id = @updatedId WHERE row_id = @row_id");

    // console.log(result);

    res.json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
app.put("/cancelStatus", async (req, res) => {
  const { row_id, user, cancellationComment } = req.body; // เพิ่ม cancellationComment ในการรับข้อมูลจากร้องขอ

  try {
    const loggedInJobPosition1 = user.jobposition;

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

    // consolce.log(updatedId);
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("row_id", sql.Int, row_id)
      .input("updatedId", sql.Int, updatedId) // เพิ่ม input parameter สำหรับ updatedId
      .input("cancellationComment", sql.NVarChar, cancellationComment) // เพิ่ม input parameter สำหรับ cancellationComment
      .query(
        "UPDATE tyeabsent SET id = @updatedId, cancellationComment = @cancellationComment WHERE row_id = @row_id"
      );

    console.log(result);

    res.json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
const imgUserUpload = multer({
  storage: multer.diskStorage({
    destination: "./imguser/",
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
  // Other configuration options
});
app.post("/signup", imgUserUpload.single("file1"), async (req, res) => {
  // Handle file upload using the 'upload' middleware

  try {
    // Get user data from the request body
    const userData = req.body;

    // Get the uploaded file
    const file = req.file;

    // Create a new SQL connection pool
    const pool = await sql.connect(config);
    console.log(userData);
    console.log(file);
    // Define the SQL query to insert user data into the database
    const query = `
        INSERT INTO users (username, password, prefix, firstname, lastname, nickname, longevity, date_time_start, jobposition, department, imguser)
        VALUES (@username, @password, @prefix, @firstname, @lastname, @nickname, @longevity, @date_time_start, @jobposition, @department, @imguser);
      `;

    // Execute the INSERT query with the user data
    await pool
      .request()
      .input("username", sql.NVarChar, userData.username)
      .input("password", sql.NVarChar, userData.password)
      .input("prefix", sql.NVarChar, userData.prefix)
      .input("firstname", sql.NVarChar, userData.firstname)
      .input("lastname", sql.NVarChar, userData.lastname)
      .input("nickname", sql.NVarChar, userData.nickname)
      .input("longevity", sql.NVarChar, userData.longevity)
      .input("date_time_start", sql.Date, userData.date_time_start)
      .input("jobposition", sql.NVarChar, userData.jobposition)
      .input("department", sql.NVarChar, userData.department)
      .input("imguser", sql.NVarChar, file.filename) // Save the file name in the database
      .query(query);

    // Respond with a success message
    return res.json({
      success: true,
      message: "User signed up successfully",
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during sign up" });
  }
});




/////////////////////////////line/////////////////////////////////

app.post("/sendLineNotify", (req, res) => {
 
  const { flexMessage } = req.body;
  const lineAccessToken =
    "6WqBSP6tiF8C5VtH+/3F4AsZNQMU2sHP8mMHDIXu9UkCy2oDEy2d0TOLiZf2pTXcrDwEv+HtTrOt8bw+3hCDvT5UXExUIQci+JP64a29lDiqpZTprgwEt6uQmx3M8Zk8rFPlLSgdzhpu0jRLSA0dmAdB04t89/1O/w1cDnyilFU=";
  
  const recipients = [

   
    { lineUserId: "Ue8e1a2bbfae35c4202f7ce9f5e6efd62" },
   { lineUserId: "Ue34f1e28d623aff06ddda249c2f57916" },
    
  ];

  recipients.forEach((recipient) => {
    const messagePayload = {
      to: recipient.lineUserId,
      messages: [flexMessage],
    };

    axios
      .post("https://api.line.me/v2/bot/message/push", messagePayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineAccessToken}`,
        },
      })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  });
});

/////////////////////////////////////////////////////////////////////
app.post("/test", async (req, res) => {
  try {
    const {
      id,
      row_id,
      name1,
      typabsent,
      startabsent,
      endabsent,
      datillabsent,
    } = req.body; // รับข้อมูล POST จาก Axios

    const pool = await sql.connect(config);
    console.log("rowid", row_id);
    console.log("id", id);
    const currentDate = new Date();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("row_id", sql.Int, row_id)
      .input("Approved", sql.DateTime, currentDate)
      .query(
        "UPDATE tyeabsent SET id = @id,  Approved = GETDATE() WHERE row_id = @row_id;"
      );
    // await sendLineMessageApproved(
    //   row_id,
    //   name1,
    //   typabsent,
    //   startabsent,
    //   endabsent,
    //   datillabsent
    // );
    // console.log("Received name1:", name1);
    // console.log("Received typabsent:", typabsent);
    // console.log("Received startabsent:", startabsent);
    // console.log("Received endabsent:", endabsent);
    // console.log("Received datillabsents:", datillabsent);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
async function sendLineMessageApproved(
  row_id,
  name1,
  typabsent,
  startabsent,
  endabsent,
  datillabsents
) {
  const message = {
    type: "flex",
    altText: "Leave Request",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: `https://cdn.pic.in.th/file/picinth/images0a65312a6098160d.png`, // Use the imagePath argument passed to the function
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "Approved Leave Request",
            weight: "bold",
            size: "xl",
          },
          {
            type: "text",
            text: `Absent Doc.: ${row_id}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Name: ${name1}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Type: ${typabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",

            text: `Start Date: ${startabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `End Date: ${endabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Detail: ${datillabsents}`,
            size: "md",
            margin: "sm",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "xxl",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [],
            margin: "sm",
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: "U6e5d8abc6c27cfc2fd27273cc29c8be9", // รหัสผู้รับข้อความ (UserID)
        messages: [message],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer /Ks9NpWf1vBdrA1EHe5UYZOSpp1geVaNoSKYx6vWZfXnP7FatrWOp7dDhDzBwLuYLiWloezWIu8fpHfOQ0wXPhwIO0Z0Aut9Ce7biuDtxjyRo4Fu/rY9XtdyMadAeJjKLnVzQthpkLLAXWMpJGg0MwdB04t89/1O/w1cDnyilFU=", // ใส่ Channel Access Token ของคุณที่นี่
        },
      }
    );

    console.log("LINE Message sent successfully", response.data);
  } catch (error) {
    console.error("Error sending LINE Message:", error);
  }
}
async function sendLineMessageCancel1(
  row_id,
  name1,
  typabsent,
  startabsent,
  endabsent,
  datillabsents
) {
  const message1 = {
    type: "flex",
    altText: "Cancel Leave Request",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: `https://cdn.pic.in.th/file/picinth/images0a65312a6098160d.png`, // Use the imagePath argument passed to the function
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: " Cancel Leave Request",
            weight: "bold",
            size: "xl",
          },
          {
            type: "text",
            text: `Absent Doc.: ${row_id}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Name: ${name1}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Type: ${typabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Start Date: ${startabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `End Date: ${endabsent}`,
            size: "md",
            margin: "sm",
          },
          {
            type: "text",
            text: `Detail: ${datillabsents}`,
            size: "md",
            margin: "sm",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "xxl",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [],
            margin: "sm",
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: "U6e5d8abc6c27cfc2fd27273cc29c8be9", // รหัสผู้รับข้อความ (UserID)
        messages: [message1],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer /Ks9NpWf1vBdrA1EHe5UYZOSpp1geVaNoSKYx6vWZfXnP7FatrWOp7dDhDzBwLuYLiWloezWIu8fpHfOQ0wXPhwIO0Z0Aut9Ce7biuDtxjyRo4Fu/rY9XtdyMadAeJjKLnVzQthpkLLAXWMpJGg0MwdB04t89/1O/w1cDnyilFU=", // ใส่ Channel Access Token ของคุณที่นี่
        },
      }
    );

    console.log("LINE Message sent successfully", response.data);
  } catch (error) {
    console.error("Error sending LINE Message:", error);
  }
}
app.post("/test2", async (req, res) => {
  try {
    const {
      id,
      row_id,
      name1,
      typabsent,
      startabsent,
      endabsent,
      datillabsent,
    } = req.body; // รับข้อมูล POST จาก Axios

    const pool = await sql.connect(config);
    console.log("rowid", row_id);
    console.log("id", id);
    const currentDate = new Date();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("row_id", sql.Int, row_id)
      .input("Approved", sql.DateTime, currentDate)
      .query(
        "UPDATE tyeabsent SET id = @id,  Approved = GETDATE() WHERE row_id = @row_id;"
      );
    // await sendLineMessageCancel1(
    //   row_id,
    //   name1,
    //   typabsent,
    //   startabsent,
    //   endabsent,
    //   datillabsent
    // );
    // console.log("Received name1:", name1);
    // console.log("Received typabsent:", typabsent);
    // console.log("Received startabsent:", startabsent);
    // console.log("Received endabsent:", endabsent);
    // console.log("Received datillabsents:", datillabsent);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});


app.get("/table1/:rowId", async (req, res) => {
  const { rowId } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('rowId', sql.Int, rowId)
      .query(
        `SELECT * FROM tyeabsent WHERE row_id = @rowId;`
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
