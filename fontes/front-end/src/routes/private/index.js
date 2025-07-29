import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/auth/service";

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;
