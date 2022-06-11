import { useEffect } from "react";

// react-router components
import { Route, useLocation, Routes } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import indexRoutes from "pageRoutes";
import "./App.css";

// Routes
// import LandingPage from "views/landing-page";
// import SignIn from "views/signin";
// import SignUp from "views/signup";
// import NoMatch from "views/404";

export default function App() {
  const { pathname } = useLocation();
  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getAllRoutes = (r) =>
    // eslint-disable-next-line react/no-array-index-key
    r.map((prop, key) => <Route exact path={prop.route} key={key} element={prop.component} />);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>{getAllRoutes(indexRoutes)}</Routes>
    </ThemeProvider>
  );
}
