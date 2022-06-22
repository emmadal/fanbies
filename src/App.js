import { useEffect, useState, useMemo } from "react";

// react-router components
import { Route, useLocation, Routes } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// user context
import AuthContext from "context/AuthContext";

// api call
import { getUserProfile, getCookie } from "api";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import indexRoutes from "pageRoutes";
import "./App.css";

export default function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("fanbies-username");
  const jtoken = getCookie("fanbies-token");

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Check if user is authenticated
  const onAuthenticated = (tk) => {
    getUserProfile({ username, jtoken: tk }).then((res) => {
      const response = res.response[0];
      // delete token key in user object
      const { token, ...dataWithoutToken } = response;
      setUser(dataWithoutToken);
    });
  };

  useMemo(() => onAuthenticated(jtoken), [jtoken]);

  const getAllRoutes = (r) =>
    r.map((prop) => <Route exact path={prop.route} key={prop.name} element={prop.component} />);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>{getAllRoutes(indexRoutes)}</Routes>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
