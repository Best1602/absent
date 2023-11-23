const message = {
  type: "flex",
  altText: "Leave Request",
  contents: {
    type: "bubble",
    hero: {
      type: "image",
      url: `https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png`, // Use the imagePath argument passed to the function
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
          text: "Leave Request",
          weight: "bold",
          size: "xl",
        },
        {
          type: "text",
          text: `Absent Doc.: ${rowId}`,
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
          text: `Start Date: ${formattedStartAbsent.slice(0, 16)}`,
          size: "md",
          margin: "sm",
        },
        {
          type: "text",
          text: `End Date: ${formattedEndAbsent.slice(0, 16)}`,
          size: "md",
          margin: "sm",
        },
        {
          type: "text",
          text: `Detail: ${datillabsent}`,
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
