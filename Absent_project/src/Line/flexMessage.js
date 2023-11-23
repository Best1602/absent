const flexMessage = (
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
) => {
  // แปลงเวลาให้อยู่ในรูปแบบ "dd/mm/yy hh:mm"
  const formattedStartAbsent = startabsent
    ? `${startabsent.slice(8, 10)}/${startabsent.slice(
      5,
      7
    )}/${startabsent.slice(2, 4)} ${startabsent.slice(11, 16)}`
    : "";
  const formattedEndAbsent = endabsent
    ? `${endabsent.slice(8, 10)}/${endabsent.slice(5, 7)}/${endabsent.slice(
      2,
      4
    )} ${endabsent.slice(11, 16)}`
    : "";
  const encodedName = encodeURIComponent(name1);
  const encodedtypabsent = encodeURIComponent(typabsent);
  const encodedStartAbsent = encodeURIComponent(formattedStartAbsent);
  const encodedEndabsent = encodeURIComponent(formattedEndAbsent);
  const encodedDatillabsent = encodeURIComponent(datillabsent);
  const encodedUsername = encodeURIComponent(username);
  const encodednickname = encodeURIComponent(nickname);
  const encodejobposition = encodeURIComponent(jobposition);

  // สร้าง URL ด้วย template literals
  const url = `http://203.154.174.129/Similan-Absent/Approved?rowId=${rowId}&name1=${encodedName}&typabsent=${encodedtypabsent}&datillabsent=${encodedDatillabsent}&startabsent=${encodedStartAbsent}&endabsent=${encodedEndabsent}&username=${encodedUsername}&nickname=${encodednickname}&jobposition=${encodejobposition}`;

  const message = {
    type: "flex",
    altText: " Leave Request",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: " Leave Request",
            weight: "bold",
            size: "xl"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Doc.No",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1
                  },
                  {
                    type: "text",
                    text: `${rowId}`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5
                  },

                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Name",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1
                  },
                  {
                    type: "text",
                    text: `${name1}  ${nickname}`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5
                  },

                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Details",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1
                  },
                  {
                    type: "text",
                    text: `${datillabsent}`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Typa",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1
                  },
                  {
                    type: "text",
                    text: `${typabsent}`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Time",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1
                  },
                  {
                    type: "text",
                    text: `${formattedStartAbsent} - ${formattedEndAbsent}`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5
                  }
                ]
              }
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            height: "sm",
            action: {
              type: "uri",
              label: "View",
              uri: `http://203.154.174.129/Similan-Absent/Approved?rowId=${rowId}&name1=${encodedName}&typabsent=${encodedtypabsent}&datillabsent=${encodedDatillabsent}&startabsent=${encodedStartAbsent}&endabsent=${encodedEndabsent}&username=${encodedUsername}&nickname=${encodednickname}&jobposition=${encodejobposition}`
              //uri: `http://192.168.1.202:5173/Similan-Absent/Approved?rowId=${rowId}&name1=${encodedName}&typabsent=${encodedtypabsent}&datillabsent=${encodedDatillabsent}&startabsent=${encodedStartAbsent}&endabsent=${encodedEndabsent}&username=${encodedUsername}&nickname=${encodednickname}&jobposition=${encodejobposition}`
            }
          },
          {
            type: "box",
            layout: "vertical",
            contents: [],
            margin: "sm"
          }
        ],
        flex: 0
      }
    }
  };

  console.log(message);
  return message;
};

export default flexMessage;
