import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";

import configApi from "../../services/config.json";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Danger from "components/Typography/Danger.jsx";
import PhoneInTalk from "@material-ui/icons/PhoneInTalk";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import "../../App.css";

class CompletedVideoRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      isLoaded: false,
      completedArr: [],
      openBottom: false,
      isVip: false,
      mention_name: "",
      message_shoutout: "",
      picture: "",
      name: "",
      cost: 0
    };
  }

  renderDateStamp(stamp) {
    // Convert timestamp to milliseconds
    var months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    var date = new Date(stamp * 1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Display date time in MM-dd-yyyy h:m:s format
    const convdataTime = `${month}-${day}-${year}`;

    return convdataTime;
  }

  componentDidMount() {
    this.getCompletedRequest();
  }

  getCompletedRequest() {
    axios
      .post(configApi.getpendingshoutout, {
        username: this.props.match.params.username,
        jtoken: localStorage.getItem("token"),
        reqstatus: "ended"
      })
      .then(res => {
        const reqVideo = res.data;
        if (!reqVideo.success) {
          this.setState({ error: reqVideo.message });
          this.props.history.replace("/dashboard");
          return;
        }
        this.setState({
          completedArr: reqVideo.response,
          isLoaded: true,
          error: ""
        });
      })
      .catch(e => {
        console.log("🤯🔥", e);
      });
  }

  renderCompletedRequest = () => {
    const { completedArr } = this.state;
    const { classes } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const requestItem = completedArr.map((item, i) => {
      return (
        <Card
          className="text-left m-a-md d-inline-block min-height-sm"
          style={{ width: "15rem" }}
          key={i}
        >
          <CardBody className="p-a-md">
            <div className="m-a-none p-a-md min-height-xs">
              <img
                src={item.picture}
                alt={`${item.name} profile pic`}
                className={`${imageClasses} img-align-center profileImg-sm`}
              />
              <span className="text-capital m-a-md text-center d-block font-bold">
                {item.name}
              </span>
              <p>
                <span className="font-bold">Booking Cost: </span>${item.charge}
              </p>
              <p>
                <span className="font-bold">Call Ended: </span>
                {this.renderDateStamp(item.activity_stamp)}
              </p>
            </div>
          </CardBody>
        </Card>
      );
    });
    return requestItem;
  };

  render() {
    if (
      !this.props.match.params.username ||
      localStorage.getItem("token") === null
    )
      return <Redirect to="/" />;
    const username = this.props.match.params.username;
    const { error, isLoaded, completedArr } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies Pending Request"
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
              <GridContainer className="content-center">
                <GridItem xs={3} sm={3} md={2}>
                  <span
                    className="default-color clickable-icon font-bold"
                    onClick={() => window.location.replace(`/user/${username}`)}
                  >
                    &#60; Back
                  </span>
                </GridItem>
                <GridItem xs={10} sm={10} md={6}>
                  <h2 className="text-center">Completed Video Call (s)</h2>
                </GridItem>
              </GridContainer>
              <GridContainer direction="row-reverse">
                <GridItem xs={12} sm={12} md={9} className={classes.navWrapper}>
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
                    <React.Fragment>
                      <Danger>{error}</Danger>
                      {completedArr.length <= 0 ? (
                        <h3>You have no request completed at this moment. </h3>
                      ) : (
                        <GridContainer>
                          {this.renderCompletedRequest()}
                        </GridContainer>
                      )}
                    </React.Fragment>
                  )}
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className={classes.navWrapper}>
                  <InfoArea
                    title="Video calls"
                    description="Here are some list of video calls you had with your fans."
                    icon={PhoneInTalk}
                    iconColor="primary"
                  />
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

export default withStyles(profilePageStyle)(CompletedVideoRequest);
