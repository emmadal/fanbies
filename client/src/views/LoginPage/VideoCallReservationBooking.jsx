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
import CreditCard from "@material-ui/icons/CreditCard";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Receipt from "@material-ui/icons/Receipt";

// core components
import InfoArea from "components/InfoArea/InfoArea.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

class VideoCallReservationBooking extends React.Component {
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
      callduration: "",
      calldate: "",
      phonenumber: "",
      callcharges: 0,
      privacy: 0,
      callpurpose: ""
    };
  }

  validatHash() {
    const hash = qs.parse(this.props.location.search)["?rand"];
    //POST Method
    axios
      .post(configApi.validatevideocallreservation, {
        hash
      })
      .then(res => {
        const responStatus = res.data;
        if (!responStatus.success) return <Redirect to="/dashboard" />;
        //success response callback
        this.setState({
          influencer: responStatus.response[0].influencer[0],
          callcharges: responStatus.response[0].callcharges,
          calldate: responStatus.response[0].calldate,
          useremail: responStatus.response[0].email,
          phonenumber: responStatus.response[0].phonenumber,
          callduration: responStatus.response[0].callduration,
          callpurpose: responStatus.response[0].callpurpose,
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
      callcharges,
      calldate,
      callduration,
      callpurpose
    } = this.state;
    this.setState({ submitDisabled: true });
    this.props.history.push({
      pathname: `/confirmrequest`,
      data: {
        email: useremail,
        unumber: phonenumber,
        messagetitle: "",
        messageDescription: callpurpose,
        celebName: influencer.name,
        celebUname: influencer.username,
        amount: callcharges,
        privacy,
        calldate,
        callduration,
        bookingType: "videocall"
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
      callcharges,
      calldate,
      callduration,
      isLoaded
    } = this.state;
    let dateString;
    if (calldate) {
      dateString = new Date(calldate * 1000).toDateString();
    }
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Fanbies - Complete Video Call Reservation Booking</title>
          <meta
            name="description"
            content="Your Video Call Reserve Booking on Fanbies needs to be confirmed before you can get the request completed"
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
                          Complete your video call booking from{" "}
                          {influencer.name}{" "}
                        </h2>
                      </CardHeader>
                      <CardBody className={classes.CardBody}>
                        <GridContainer justify="center">
                          <GridItem xs={8} sm={8} md={8}>
                            <div className="m-v-md">
                              <p>
                                <b>Date booked for the call:</b> {dateString}
                              </p>
                              <p>
                                <b>Duration booked:</b>
                                {`${callduration} mins`}
                              </p>
                              <p className="font-size-lg">
                                <b>Total Cost: ${callcharges}</b>
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
                        title={`Your receipt and order updates will be sent to the email provided under: ${useremail}`}
                        icon={Receipt}
                        description=""
                        extraClass={"d-flex"}
                      />
                      <InfoArea
                        title={`Turn on your push notification for reminders for video call from ${
                          influencer.name
                        }`}
                        icon={NotificationsNoneIcon}
                        description=""
                        extraClass={"d-flex"}
                      />
                      <InfoArea
                        title="If for any reason your booking isn't completed after payment; we will offer a full refund"
                        icon={CreditCard}
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

export default withStyles(loginPageStyle)(VideoCallReservationBooking);
