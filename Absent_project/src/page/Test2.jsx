import React, { useState, useEffect } from "react";
import * as loadingData from "../Aniki Hamster.json";
import * as successData from "../Animation - 1694674251544.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Narbar from "../component/Narbar";
import axios from "axios";
import flexMessage from "../Line/flexMessage";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: successData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Test() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState(null);
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    // เมื่อหน้าโหลด ดึงค่า row_id จาก query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const flexRowId = urlParams.get("row_id");
    const encodedName = urlParams.get("name1");
    const encodedtypabsent = urlParams.get("typabsent");
    const encodedStartAbsent = urlParams.get("startabsent");
    const encodedDatillabsent = urlParams.get("datillabsent");
    const encodedEndabsent = urlParams.get("endabsent");

    setTimeout(() => {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
          axios
            .post(`${import.meta.env.VITE_API_SERVICE}/test2`, {
              id: 8,
              row_id: flexRowId,
              name1: encodedName,
              typabsent: encodedtypabsent,
              startabsent: encodedStartAbsent,
              datillabsent: encodedDatillabsent,
              endabsent: encodedEndabsent,
            })
            .then((response) => {
              setSuccess(true);
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 200);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!success ? (
        <FadeIn>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1 style={{ fontSize: "2rem", color: "#2DC598" }}>
              Please wait a moment.
            </h1>
            {!loading ? (
              <Lottie options={defaultOptions} height={240} width={240} />
            ) : (
              <Lottie options={defaultOptions2} height={240} width={240} />
            )}
          </div>
        </FadeIn>
      ) : (
        <h1 style={{ fontSize: "2rem", color: "#2DC598" }}>Success !</h1>
      )}
    </div>
  );
}

export default Test;
