import React from "react";
import RoutesApp from "./routes";
import { AuthProvider } from "./contexts/auth";
import { LocalProvider } from "./contexts/local";
import GlobalStyle from "./styles/global";

const App = () => (
  <LocalProvider>
    <AuthProvider>
      <RoutesApp />
      <GlobalStyle />
    </AuthProvider>
  </LocalProvider>
);

export default App;
