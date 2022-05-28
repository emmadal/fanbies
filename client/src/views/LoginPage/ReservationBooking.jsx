import React from "react";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import qs from "querystring";
import { Helmet } from "react-helmet";
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
// core components
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import EventAvailable from "@material-ui/icons/EventAvailable";
import Share from "@material-ui/icons/Share";
import MailOutline from "@material-ui/icons/MailOutline";
import Receipt from "@material-ui/icons/Receipt";

// core components
import InfoArea from "components/InfoArea/InfoArea.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

class ReservedBooking extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      submitDisabled: false,
      error: "",
      queryValue: "",
      influencer: [],
      useremail: "",
      isLoaded: false,
      usermessage: "",
      usermessagetitle: "",
      phonenumber: ""
    };
  }

  validatHash() {
    const hash = qs.parse(this.props.location.search)["?rand"];
    //POST Method
    axios
      .post(configApi.validatereservation, {
        hash
      })
      .then(res => {
        const responStatus = res.data;
        if (responStatus.success === false) {
          return <Redirect to="/dashboard" />;
        }
        //success response callback
        this.setState({
          influencer: responStatus.response[0].influencer[0],
          usermessage: responStatus.response[0].message,
          usermessagetitle: responStatus.response[0].title,
          useremail: responStatus.response[0].email,
          phonenumber: responStatus.response[0].phonenumber,
          privacy: responStatus.response[0].privacy,
          isLoaded: true
        });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  handelMakeRequest = () => {
    const {
      useremail,
      phonenumber,
      privacy,
      influencer,
      usermessagetitle,
      usermessage
    } = this.state;
    this.setState({ submitDisabled: true });
    this.props.history.push({
      pathname: `/confirmrequest`,
      data: {
        email: useremail,
        unumber: phonenumber,
        messagetitle: usermessagetitle,
        messageDescription: usermessage,
        celebName: influencer.name,
        celebUname: influencer.username,
        amount: influencer.shoutrate,
        privacy,
        calldate: 0,
        callduration: 0,
        bookingType: "shoutout"
      }
    });
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.validatHash();
  }
  render() {
    if (!!qs.parse(this.props.location.search)["?rand"] === false)
      return <Redirect to="/dashboard" />;

    const { classes, ...rest } = this.props;
    const {
      error,
      submitDisabled,
      influencer,
      useremail,
      usermessage,
      usermessagetitle,
      isLoaded
    } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Fanbies - Reserve Booking Confirmation</title>
          <meta
            name="description"
            content="Your Reserve Booking on Fanbies needs to be confirmed before you can get the request completed"
          />
        </Helmet>
        <Header
          color="transparent"
          brand="Fanbies PaymentPage"
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
          <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
              <Card className={classes[this.state.cardAnimaton]}>
                {isLoaded ? (
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                      <CardHeader>
                        <h2>{error}</h2>
                        <h2>
                          Complete your shoutout reserved booking for{" "}
                          {influencer.name}{" "}
                        </h2>
                      </CardHeader>
                      <CardBody className={classes.CardBody}>
                        <GridContainer justify="center">
                          <GridItem xs={8} sm={8} md={8}>
                            <div className="m-v-md">
                              <p>
                                <b>Your Message Title:</b> {usermessagetitle}
                              </p>
                              <p>
                                <b>Your Message Description:</b> {usermessage}
                              </p>
                              <p>
                                <b>Payment: ${influencer.shoutrate}</b>
                              </p>
                              {influencer.profession && (
                                <p>
                                  <b>Proceeds in support of</b>{" "}
                                  {influencer.profession}
                                </p>
                              )}
                            </div>
                          </GridItem>
                          <GridItem xs={4} sm={4} md={4}>
                            <div className={classes.profile}>
                              <img
                                src={influencer.picture}
                                alt={influencer.name}
                                className={`${imageClasses} profileImg-md img-circle`}
                              />
                            </div>
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                      <CardFooter>
                        <GridItem xs={4} sm={4} md={4}>
                          <Button
                            disabled={submitDisabled}
                            onClick={this.handelMakeRequest}
                            color="primary"
                            size="lg"
                            round
                            fullWidth
                          >
                            Proceed To Payment
                          </Button>
                        </GridItem>
                      </CardFooter>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={4}
                      className={`${classes.navWrapper} sidenotes`}
                    >
                      <InfoArea
                        title={`${
                          influencer.name
                        } has 14 days to complete your request.`}
                        icon={EventAvailable}
                        description=""
                        extraClass={"d-flex"}
                      />
                      <InfoArea
                        title="Your receipt and order updates will be sent to the email provided under"
                        icon={Receipt}
                        description=""
                        extraClass={"d-flex"}
                      />
                      <InfoArea
                        title={`An email will be sent out to your: ${useremail} when  ${
                          influencer.name
                        } completes your request, and your registered profile `}
                        icon={MailOutline}
                        description=""
                        extraClass={"d-flex"}
                      />
                      <InfoArea
                        title="Share your personalized video shoutout; anywhere and playback anytime"
                        icon={Share}
                        description=""
                        extraClass={"d-flex"}
                      />
                    </GridItem>
                  </GridContainer>
                ) : (
                  <div className="min-height-sm text-center">
                    <div className="overlay transparent">
                      <div className="lds-ripple pos-ab top-0">
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(ReservedBooking);
