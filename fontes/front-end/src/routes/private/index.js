import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";


const PrivateRoute = ({ children }) => {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!usuario) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;
