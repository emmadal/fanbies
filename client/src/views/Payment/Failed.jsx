import React from "react";
import { Redirect } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//axios
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
//import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

//import People from "@material-ui/icons/People";
import Icon from "@material-ui/core/Icon";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
//import { Divider } from "@material-ui/core";

import "../../App.css";

class Recommend extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      isLoading: true,
      error: ""
    };
    // this.renderOverlay = this.renderOverlay.bind(this);
  }

  componentDidMount() {
    //
  }

  render() {
    if (!this.props.location.hasOwnProperty("data")) return <Redirect to="/" />;
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies Successful Payment"
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
                  <div className="text-center">
                    <h2>
                      Something is Wrong!!!. <br />
                      Your Payment was not accepted; Please try again.{" "}
                    </h2>
                    <Button
                      onClick={() => window.location.replace(`/`)}
                      color="primary"
                      size="lg"
                      round
                    >
                      <Icon className={classes.inputIconsColor}>home</Icon>
                      Home
                    </Button>
                  </div>
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

export default withStyles(profilePageStyle)(Recommend);
