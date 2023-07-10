import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ checkIsLoggedIn }) => {
  return checkIsLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
