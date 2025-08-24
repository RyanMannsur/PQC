import { useContext } from "react";

import Header from "../components/Header";
import { AuthContext } from "../contexts/auth"; 

const AppLayout = ({ children }) => {
  const { usuario } = useContext(AuthContext);

  const labName = usuario?.laboratorios?.[usuario?.indCorrente]?.nomLaboratorio || "N/A";
  return (
    <Header
      withSidebar={true}
      showSignoutIcon={true}
      usuario={usuario}
      labName={labName}
    >
      {children}
    </Header>
  );
};

export default AppLayout;