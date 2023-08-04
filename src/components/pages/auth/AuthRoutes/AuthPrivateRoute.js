import { getCookie } from "react-use-cookie";
import React from "react";
import { Navigate } from "react-router-dom";

const AuthPrivateRoute = ({ children }) => {
  const token = getCookie("token");
  return <>{!token ? <>{children}</> : <Navigate to="/" />}</>;
};

export default AuthPrivateRoute;