import { useEffect, useState } from "react";

// react-router components
import { Route, useLocation, Routes } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// user context
import AuthContext from "context/AuthContext";

// api call
import { getUserProfile } from "api";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import indexRoutes from "pageRoutes";
import "./App.css";

export default function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  const getCookieByName = (tokenName) => {
    let token;
    if (document.cookie) {
      token = document?.cookie
        .split(";")
        .find((row) => row.startsWith(`${tokenName}=`))
        .split("=")[1];
    }
    return token;
  };

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    (async () => {
      const data = {
        username: localStorage.getItem("fanbies-username"),
        jtoken: getCookieByName("fanbies-token") ?? "",
      };
      const res = await getUserProfile(data);
      if (res) {
        const response = res.response[0];
        // delete token key in user object
        const { token, ...dataWithoutToken } = response;
        setUser(dataWithoutToken);
      }
    })();
  }, []);

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
