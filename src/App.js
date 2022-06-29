import { useEffect, useState } from "react";

// react-router components
import { Route, useLocation, Routes } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// App Context
import AuthContext from "context/AuthContext";
import SocialMediaContext from "context/SocialMediaContext";

// api call
import { getUserProfile, getCookie, getVideoMessageRates } from "api";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import indexRoutes from "pageRoutes";
import "./App.css";

// fake data
import social from "data";

export default function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState(social);
  const [appVideoMessageRate, setAppVideoMessageRate] = useState("5"); // default
  const username = localStorage.getItem("fanbies-username");
  const jtoken = getCookie("fanbies-token");

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Check if user is authenticated
  const onAuthenticated = () => {
    getUserProfile({ username, jtoken }).then((res) => {
      const response = res.response[0];
      // delete token key in user object
      const { token, ...dataWithoutToken } = response;
      setUser(dataWithoutToken);
    });
  };

  // Get App Config Current Video Message Rate
  const getConfigVideMessageRate = async () => {
    const configType = "getVideoMessageRate";
    const configSection = "value";
    const req = await getVideoMessageRates(jtoken, configType, configSection);
    if (req.success) {
      setAppVideoMessageRate(req?.response[0]?.value?.split(","));
    }
  };

  useState(() => {
    if (jtoken && jtoken != null) {
      onAuthenticated();
      getConfigVideMessageRate();
    }
    return () => null;
  }, []);

  const getAllRoutes = (r) =>
    r.map((prop) => <Route exact path={prop.route} key={prop.name} element={prop.component} />);

  return (
    <AuthContext.Provider value={{ user, setUser, appVideoMessageRate }}>
      <SocialMediaContext.Provider value={{ socialMediaLinks, setSocialMediaLinks }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>{getAllRoutes(indexRoutes)}</Routes>
        </ThemeProvider>
      </SocialMediaContext.Provider>
    </AuthContext.Provider>
  );
}
