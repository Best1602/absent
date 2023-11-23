import React from "react";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
Font.register({
  family: "IBMPlexSansThaiLooped-Bold",
  src: "./front/IBMPlexSansThaiLooped-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
    fontSize: 15,
    fontFamily: "IBMPlexSansThaiLooped-Bold",
  },
  headerText: {
    fontFamily: "IBMPlexSansThaiLooped-Bold",
    fontSize: 10,
    textAlign: "center",
  },
  headerText1: {
    fontFamily: "IBMPlexSansThaiLooped-Bold",
    fontSize: 10,
    textAlign: "end",
  },
  thaiText: {
    fontFamily: "IBMPlexSansThaiLooped-Bold",
    fontSize: 8,
    fontWeight: "500",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 1,
    height: 40,
  },
  tableCell: {
    padding: 3,
    borderStyle: "dashed",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },
  headerCell: {
    padding: 3,
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
    flex: 1,
    color: "#000000",
  },
});

const PDFViewerButton = ({ data, startDate, endDate }) => {
  const itemsPerPage = 11; // จำนวนข้อมูลต่อหน้า

  const createPages = (data) => {
    const pages = [];
    let currentPage = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      currentPage.push(item);

      // ตรวจสอบว่าเราต้องสร้างหน้าใหม่หรือไม่
      if (currentPage.length === itemsPerPage || i === data.length - 1) {
        pages.push(currentPage);
        currentPage = [];
      }
    }

    return pages;
  };

  const handlePrint = async () => {
    const pagesData = createPages(data);
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const blob = await pdf(
      <Document>
        {pagesData.map((page, pageIndex) => (
          <Page
            size="A4"
            orientation="landscape"
            style={styles.page}
            key={pageIndex}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.header}>บริษัท สิมิลันเทคโนโลยี จำกัด </Text>
              <Text style={styles.headerText}>รายงานสรุปใบลางาน</Text>
              <Text style={styles.headerText1}>
                ระหว่างวันที่ {dayjs(startDate).format("DD/MM/YYYY")} ถึง{" "}
                {dayjs(endDate).add(0, "day").format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.headerText1}>
                เวลาที่พิมพ์: {formattedCurrentTime}
              </Text>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.headerRow]}>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>รหัสพนักงาน</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>ชื่อ นามสกุล</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>ตำแหน่ง </Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>แผนก </Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>วันที่เข้าระบบ</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>เริ่มลาตอน</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>สินสุดการลา</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>CEO Approved</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>ประเภทลา</Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}> เวลาที่ลา </Text>
                  </View>
                  <View style={[styles.tableCell, styles.headerCell]}>
                    <Text style={styles.thaiText}>รายละเอียดการลา</Text>
                  </View>

                </View>
                {page.map((row, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>{row.username}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.firstname} {row.lastname}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>{row.jobposition}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>{row.department}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.formattedsubmitDateTime}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.formattedStartDate}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.formattedEndabsent}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.formattedApproved}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>{row.typabsent}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>
                        {row.combinedDifference}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.thaiText}>{row.datillabsent}</Text>
                    </View>

                  </View>
                ))}
              </View>
            </View>
          </Page>
        ))}
      </Document>
    ).toBlob();

    // ดาวน์โหลดไฟล์ PDF
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button variant="contained" color="primary" onClick={handlePrint}>
      พิมพ์ PDF
    </Button>
  );
};

export default PDFViewerButton;
