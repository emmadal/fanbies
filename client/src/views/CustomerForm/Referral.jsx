import React from "react";
import { Helmet } from "react-helmet";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Whatshot from "@material-ui/icons/Whatshot";
import Chat from "@material-ui/icons/Class";
import Build from "@material-ui/icons/MonetizationOn";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import "../../App.css";
import image from "assets/img/bg7.jpg";

const Referral = props => {
  const { classes, ...rest } = props;
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Fanbies Referral Program</title>
        <meta
          name="description"
          content="Fanbies Referral Program is a special program to compensate to any agency, person, celebrity / tv personalities that help refer other influencers and like minds to join the Fanbies platform."
        />
      </Helmet>
      <Header
        color="transparent"
        brand="Fanbies Referral Program"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={`${classes.container}`}>
          <GridContainer direction="row-reverse">
            <GridItem xs={12} sm={12} md={5}>
              <iframe
                title="Fanbies Referral Program"
                className="m-t-xl"
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/d5K7b-qEh30"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={7}>
              <Card>
                <CardHeader>
                  <h2 className="text-center">Fanbies Referral Program</h2>
                </CardHeader>
                <CardBody>
                  <CustomTabs
                    headerColor="primary"
                    tabs={[
                      {
                        tabName: "How does it work?",
                        tabIcon: Whatshot,
                        tabContent: (
                          <p className={classes.textCenter}>
                            You earn 5% of all income made by the user you help
                            join Fanbies.com
                          </p>
                        )
                      },
                      {
                        tabName: "How do I get paid?",
                        tabIcon: Build,
                        tabContent: (
                          <p className={classes.textCenter}>
                            Referral income is processed monthly to your chosen
                            method of payment.
                          </p>
                        )
                      },
                      {
                        tabName: "How do I get started?",
                        tabIcon: Chat,
                        tabContent: (
                          <p className={classes.textCenter}>
                            Email Us: join@fanbies.com and we can set you right
                            up.
                          </p>
                        )
                      }
                    ]}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default withStyles(loginPageStyle)(Referral);
