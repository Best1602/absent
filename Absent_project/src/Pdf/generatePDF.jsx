import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

// สร้างสไตล์สำหรับ PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderBottomColor: "#000",
    backgroundColor: "#f2f2f2",
    padding: 5,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
});

// สร้างคอมโพเนนต์ PDF
const MyPDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>รายงานการลางาน</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>ชื่อ</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>นามสกุล</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>วันที่ลา</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>ประเภทลา</Text>
            </View>
          </View>
          {data.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text>{row.firstname}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{row.lastname}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{row.startabsent}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{row.typabsent}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const PDFViewerComponent = ({ data }) => (
  <PDFViewer width="100%" height={600}>
    <MyPDFDocument data={data} />
  </PDFViewer>
);

export default PDFViewerComponent;
