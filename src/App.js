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
import { getUserProfile, getCookie, getInAppConfig } from "api";

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
  const [appDefinedLinks, setAppDefinedLinks] = useState([]);
  const [appVideoMessageRate, setAppVideoMessageRate] = useState(["5"]); // default
  const username = localStorage.getItem("fanbies-username");
  const jtoken = getCookie("fanbies-token");

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Check if user is authenticated
  const onAuthenticated = async () => {
    try {
      const responseProfile = await getUserProfile({ username, jtoken });
      if (!responseProfile.success) return;

      setUser(responseProfile?.response[0]);
    } catch (e) {
      console.warn("Error", e);
    }
  };

  // Get App Config Current Video Message Rate
  const getConfigVideMessageRate = async (configType) => {
    const req = await getInAppConfig(jtoken, configType);
    if (req.success) {
      setAppVideoMessageRate(req?.response[0]?.value?.split(","));
    }
  };

  // Get App Config Supported Social Links
  const getConfigSocialMedia = async (configType) => {
    const req = await getInAppConfig(jtoken, configType);
    if (req.success) {
      setAppDefinedLinks(req?.response[0]?.value?.split(","));
    }
  };

  useState(() => {
    if (jtoken && jtoken != null) {
      onAuthenticated();
      getConfigVideMessageRate("getVideoMessageRate");
      getConfigSocialMedia("getSupportedSocialMedia");
    }
    return () => null;
  }, []);

  const getAllRoutes = (r) =>
    r.map((prop) => <Route exact path={prop.route} key={prop.name} element={prop.component} />);

  return (
    <AuthContext.Provider value={{ user, setUser, appVideoMessageRate, appDefinedLinks }}>
      <SocialMediaContext.Provider value={{ socialMediaLinks, setSocialMediaLinks }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>{getAllRoutes(indexRoutes)}</Routes>
        </ThemeProvider>
      </SocialMediaContext.Provider>
    </AuthContext.Provider>
  );
}
