import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "react-use-cookie";

const PrivateRoute = ({ children }) => {
  const token = getCookie("token");
  let user = getCookie("user");
  if(user){
    user = JSON.parse(user);
  }
  return <>{token ? <>{user.role === "user"? <>{children}</>:<Navigate to="/admin" />}</> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;