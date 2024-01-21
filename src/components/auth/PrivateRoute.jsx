import React from "react";
import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const hasToken = Cookies.get("token") !== undefined;
  return <>{hasToken ? <Outlet /> : <Navigate to="/login" />};</>;
}
