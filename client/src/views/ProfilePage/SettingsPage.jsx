import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import classNames from "classnames";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import ProfileSetting from "views/ProfilePage/ProfileSetting.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`
//   };
// }

function SettingsPage() {
  const [value, setValue] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setTimeout(setIsLoaded(true), 700);
  }, []);

  return (
    <div>
      <Header
        color="transparent"
        brand="Fanbies"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
      />
      <div
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        {!isLoaded ? (
          <div className="min-height-sm text-center">
            <div className="overlay transparent">
              <div className="lds-ripple pos-ab top-0">
                <div />
                <div />
              </div>
            </div>
          </div>
        ) : (
          <Box sx={{ width: "100%", margin: "100px 0 0" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example"
            >
              <LinkTab label="Page One" href="/claim" />
              <LinkTab label="Page Two" href="/login" />
              <LinkTab label="Page Three" href="/spam" />
            </Tabs>
          </Box>
        )}
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default withStyles(loginPageStyle)(SettingsPage);
