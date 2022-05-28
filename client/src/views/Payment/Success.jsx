import React from "react";
import { Redirect } from "react-router-dom";
// nodejs library that concatenates classes

import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//import Badge from "components/Badge/Badge.jsx";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/icons
//import CardHeader from "components/Card/CardHeader.jsx";
// core components
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

class PayService extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      username: "",
      orderid: "",
      isLoading: true,
      error: ""
    };
    // this.renderOverlay = this.renderOverlay.bind(this);
  }

  payRegister() {
    const paymenttype = "pp";
    const {
      payToken,
      payerID,
      paymentID,
      payerEmail,
      payerPaid,
      amountPaid,
      useremail,
      videoPrivacy,
      celebName,
      celebUname,
      messagetitle,
      messageDescription,
      calldate,
      callduration,
      bookingType,
    } = this.props.location.data;
    //POST Method
    axios
      .post(configApi.payRegister, { 
        paymenttype,
        payToken,
        payerID,
        paymentID,
        payerEmail,
        payerPaid,
        amountPaid,
        useremail,
        videoPrivacy,
        celebName,
        celebUname,
        messagetitle,
        messageDescription,
        calldate,
        callduration,
        bookingType
      })
      .then(res => {
        const processPayment = res.data;
        if (!processPayment.success)
          return this.setState({ error: processPayment.message });
        //Payement completed and stored
        this.setState({
          isLoading: false,
          username: processPayment.response.username,
          orderid: processPayment.response.shoutoutId
        });
      });
  }

  componentDidMount() {
    //
    if (this.props.location.hasOwnProperty("data")) this.payRegister();
  }

  render() {
    if (!this.props.location.hasOwnProperty("data")) return <Redirect to="/" />;
    const { classes, ...rest } = this.props;
    const { isLoading, username, orderid } = this.state;
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
                  {isLoading ? (
                    <div className="min-height-sm text-center">
                      <div className="overlay transparent">
                        <div className="lds-ripple pos-ab top-0">
                          <div />
                          <div />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2>
                        Thank you. Request Booked &amp; Received. <br />
                        Please do check your email for the details{" "}
                      </h2>
                      <p className="m-a-md">
                        <span className="font-bold"> Reference:</span>
                        <br />
                        <span className="font-size-xl">{orderid}</span>
                      </p>
                      <Button
                        onClick={() =>
                          window.location.replace(`/user/${username}`)
                        }
                        color="primary"
                        size="lg"
                        round
                      >
                        <Icon className={classes.inputIconsColor}>
                          recent_actors
                        </Icon>
                        Profile
                      </Button>
                    </div>
                  )}
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

export default withStyles(profilePageStyle)(PayService);
