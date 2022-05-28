import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";

import configApi from "../../services/config.json";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Badge from "components/Badge/Badge.jsx";
import Danger from "components/Typography/Danger.jsx";
import GetApp from "@material-ui/icons/GetApp";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import Popover from "@material-ui/core/Popover";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import "../../App.css";

class CompletedRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      isLoaded: false,
      completedArr: [],
      openBottom: false,
      isVip: false,
      isPlaying: false,
      mention_name: "",
      message_shoutout: "",
      picture: "",
      name: ""
    };
    //this.renderCompletedRequest = this.renderCompletedRequest.bind(this);
    this.handleVideoPlay = this.handleVideoPlay.bind(this);
  }

  getCompletedRequest() {
    axios
      .all([this.getCompletedVideo()])
      .then(res => {
        const reqVideo = res[0].data;
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

  getCompletedVideo() {
    //const jtoken =
    return axios.post(configApi.getcompletedshoutout, {
      username: this.props.match.params.username,
      jtoken: localStorage.getItem("token")
    });
  }
  // getCompletedCalls() {
  //   //const jtoken =
  //   return axios.post(configApi.getpendingshoutout, {
  //     username: this.props.match.params.username,
  //     jtoken: localStorage.getItem("token"),
  //     reqstatus: "ended"
  //   });
  // }

  renderCompletedRequest = () => {
    const { completedArr } = this.state;
    const requestItem = completedArr.map((item, i) => {
      return (
        <GridItem xs={6} sm={6} md={6} key={i}>
          <div
            className="video-container pos-rel d-inline-block m-h-sm clickable-icon"
            onClick={() =>
              this.handleDescription(
                "openBottom",
                item.date,
                item.link,
                item.thumbnail,
                item.privacy,
                item.mention_name,
                item.message_shoutout,
                item.picture,
                item.name
              )
            }
          >
            <img
              src={item.thumbnail}
              style={{ width: "50%", height: "50%" }}
              alt="Video Thumbnail"
            />
          </div>
        </GridItem>
      );
    });
    return requestItem;
  };

  //handel request popover descriptions
  handleDescription(
    state,
    date,
    link,
    thumbnail,
    privacy,
    mention_name,
    message_shoutout,
    picture,
    name
  ) {
    this.setState({
      [state]: true,
      date,
      link,
      thumbnail,
      privacy,
      mention_name,
      message_shoutout,
      picture,
      name
    });
  }

  //close request popover descriptions
  handleClosePopover(state) {
    this.setState({
      [state]: false,
      isPlaying: false
    });
  }

  renderPopover() {
    const { classes } = this.props;
    const {
      date,
      link,
      thumbnail,
      privacy,
      isPlaying,
      mention_name,
      message_shoutout,
      picture,
      name
    } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <Popover
        classes={{
          paper: classes.popover
        }}
        open={this.state.openBottom}
        anchorEl={this.anchorElBottom}
        anchorReference={"anchorEl"}
        onClose={() => this.handleClosePopover("openBottom")}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
      >
        <div className={classes.popoverBody}>
          <div className="video-control">
            <GridContainer justify="center">
              <GridItem xs={12} sm={6} md={6}>
                <div className="text-center pos-rel">
                  <video
                    style={{ width: "100%", position: "relative" }}
                    preload="none"
                    playsInline
                    height="307"
                    poster={thumbnail}
                    onClick={() => this.handleVideoPlay()}
                  >
                    <source src={link} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className={`video-playBtn pos-ab ${
                      isPlaying === true ? "d-none" : "d-block"
                    }`}
                  >
                    <PlayCircleOutline
                      style={{ color: "#FFFFFF", fontSize: "3rem" }}
                      onClick={() => this.handleVideoPlay()}
                    />
                  </div>
                </div>
              </GridItem>
              <GridItem xs={12} sm={6} md={6}>
                <div className="p-a-md pos-rel">
                  <div>
                    <img
                      src={picture}
                      alt={name}
                      className={`${imageClasses} border-round profileImg-sm`}
                    />
                    <span className="m-h-sm">{name}</span>
                    <span className="d-inline-block floatRight">
                      {privacy === 0 ? (
                        ""
                      ) : (
                        <Badge color="warning">Private Request</Badge>
                      )}
                    </span>
                    <p className="m-v-lg">
                      <b>Title:&nbsp;</b> <span>{mention_name}</span>
                    </p>
                    <p>
                      <b>Description:&nbsp;</b>
                      <span>{message_shoutout}</span>
                    </p>
                  </div>
                  <hr />
                  <span className="font-size-sm floatRight m-a-none d-inline-block">
                    {this.renderDateStamp(date)}
                  </span>
                  <a
                    href={link}
                    target="_self"
                    className="d-block text-center m-b-sm font-bold btn btn-xs btn-rose "
                    download
                  >
                    Download
                  </a>
                  {window.navigator.share
                    ? window.navigator.share({
                        title:
                          "Fanbies - Request personalised video shoutouts from their favourite person",
                        text: { mention_name },
                        url: "https://www.Fanbies.com"
                      })
                    : ""}
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </Popover>
    );
  }

  handleVideoPlay() {
    const { isPlaying } = this.state;
    this.setState(
      {
        isPlaying: !this.state.isPlaying
      },
      () => {
        if (!isPlaying) return document.querySelectorAll("video")[0].play();
        document.querySelectorAll("video")[0].pause();
      }
    );
    document.querySelectorAll("video")[0].setAttribute("loop", true);
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
                  <h2 className="text-center">Completed Request (s)</h2>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3} className={classes.navWrapper}>
                  <InfoArea
                    title="Download &amp; Social Share "
                    description="Share your personalized video shoutout; anywhere and playback anytime."
                    icon={GetApp}
                    iconColor="primary"
                  />
                </GridItem>
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
              </GridContainer>
            </div>
          </div>
          {this.renderPopover()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(CompletedRequest);
