import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, roleLoading] = useRole();

  // 🔥 Full page centered loader
  if (loading || roleLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="loading loading-bars loading-xl text-blue-500"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
