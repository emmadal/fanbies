import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import Footer from "components/Footer/Footer.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Header from "components/Header/Header.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import "../../App.css";

const Articles = props => {
const { classes, ...rest } = props;
const [cardAnimaton, SetCardAnimaton] = useState("cardHidden");

useEffect(() => {
    setTimeout(
        function() {
        SetCardAnimaton("");
        }.bind(this),
        700
    );
}, []);

const illustratorSvg = "undraw-bg undraw-bg-profile";

    return(
        <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Request direct video message from your favourite - Fanbies
        </title>
        <meta
          name="description"
          content={`Why Influencers Should Offer 1:1 Calls with Their Fans`}
        />
        <meta
          property="og:title"
          content="Why Influencers Should Offer 1:1 Calls with Their Fans"
        />
        <meta
          property="og:description"
          content="The influencer influx. These days, anyone with a hint of talent, charisma or even shock value can become an influencer."
        />
        <meta
          name="twitter:card"
          content="Why Influencers Should Offer 1:1 Calls with Their Fans"
        />
      </Helmet>
      <Header
        color="transparent"
        brand="Fanbies"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div
        className={classNames(classes.main, classes.mainRaised, illustratorSvg)}
      >
        <div className={`${classes.container}`}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card className={classes[cardAnimaton]}>
                <CardHeader>
                  <h2 className="font-size-xxl font-bold text-center m-t-xl">
                    Fanbies Articles
                  </h2>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <img src={require("assets/img/articles/female_vlogger.jpg")} width="100%" alt="Influener on video call with fan on fanbies" />
                        <br />
                        <br />
                      <ul className="list-style-display">
                        <li>
                            <a href="/article/WhyOffer1vs1Call">Why Offer 1v1 call with your fans</a>
                        </li>
                      </ul>
                    </GridItem>
                    </GridContainer>
                </CardBody>
            </Card>
            </GridItem>
            </GridContainer>
        </div>
        </div>
        </div>
    )
}

export default withStyles(loginPageStyle)(Articles);
