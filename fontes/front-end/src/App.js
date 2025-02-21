import React from "react";
import RoutesApp from "./routes";
import { AuthProvider } from "./contexts/auth";
import { LabProvider } from "./contexts/lab";
import GlobalStyle from "./styles/global";

const App = () => (
  <LabProvider>
    <AuthProvider>
      <RoutesApp />
      <GlobalStyle />
    </AuthProvider>
  </LabProvider>
);

export default App;
