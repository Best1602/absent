import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
const Protected = ({ isLoggedIn, children }) => {
  const location = useLocation();

  // console.log(isLoggedIn)
  if (!isLoggedIn) {
    console.log("first");
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }
  return children;
};

export default Protected;
