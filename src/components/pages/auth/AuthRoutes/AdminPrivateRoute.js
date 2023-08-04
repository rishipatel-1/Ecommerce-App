import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "react-use-cookie";

const AdminPrivateRoute = ({ children }) => {
  const token = getCookie("token");
  let user = getCookie("user");
  if(user){
    user = JSON.parse(user);
  }
  return <>{token ? <>{user.role === "admin"? children:<Navigate to="/" />}</> : <Navigate to="/login" />}</>;
};

export default AdminPrivateRoute;