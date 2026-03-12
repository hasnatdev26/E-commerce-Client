import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* =====================
     LOADING (FULL PAGE CENTER)
  ===================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="loading loading-bars loading-xl text-blue-500"></span>
      </div>
    );
  }

  /* =====================
     AUTHORIZED
  ===================== */
  if (user) {
    return children;
  }

  /* =====================
     NOT AUTHORIZED
  ===================== */
  return (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;

