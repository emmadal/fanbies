import React from "react";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import "../../App.css";

class EmailSent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!localStorage.getItem("token")) return <Redirect to="/login" />;
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies Email Sent"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <h2>
                    This is a confirmation that your{" "}
                    <strong>{this.props.location.state.detail} </strong> is well
                    received and been processed. Thank you.
                  </h2>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(EmailSent);
