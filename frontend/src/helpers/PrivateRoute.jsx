import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading User data...</p>;
  } else {
    console.log(user);
  }

  return user ? element : <Navigate to="/login" />;
};

export { PrivateRoute };
