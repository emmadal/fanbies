import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//service config
import configApi from "../../services/config.json";
//axios
import axios from "axios";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import UserFeatured from "../Components/UserFeatured.jsx";
import Button from "components/CustomButtons/Button.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import urbanlawyers from "assets/img/urbanLawyers.png";

const explainervideo = require("assets/img/fanbies.mp4");


const dashboardRoutes = [];
class LandingPage extends React.Component {
  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;
  constructor(props) {
    super(props);
    this.state = {
      openLeft: false,
      openTop: false,
      openBottom: false,
      openRight: false,
      error: "",
      sectionSetting: [],
      talentListArray: [],
      uitems: [],
      modal: false
    };
    this.getSetting = this.getSetting.bind(this);
  }

  handleClose() {
    this.setState({ modal: false });
  }

  getFeatured = () => {
    return axios.post(configApi.getFeaturedUser);
  };

  getTalentList = () => {
    return axios.post(configApi.getUserTalent);
  };

  getConsoleSetting = () => {
    return axios.post(configApi.consoleDetail);
  };

  getSetting() {
    //POST Method
    axios
      .all([this.getConsoleSetting(), this.getTalentList(), this.getFeatured()])
      .then(res => {
        const consoleDetailRes = res[0].data;
        if (!consoleDetailRes.success)
          return this.setState({ error: consoleDetailRes.message });

        this.setState({
          sectionSetting: consoleDetailRes.response[0].val.split(","),
          talentListArray: res[1].data.response,
          uitems: res[2].data.response
        });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(err);
      });
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    //document.title = `Fanbies - Request Direct Video Messages From Your Favourite Person`;
    this.getSetting();
    // if (isMobile) {
    //   this.setState({ modal: true });
    // }
  }

  openIOS = () => {
    var win = window.open(
      "https://apps.apple.com/us/app/fanbies/id1145891462",
      "_blank"
    );
    win.focus();
  };

  openAndroid = () => {
    var win = window.open(
      "https://play.google.com/store/apps/details?id=com.fanbiesadmin.app",
      "_blank"
    );
    win.focus();
  };

  render() {
    const { classes, ...rest } = this.props;
    const { sectionSetting, talentListArray } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRounded,
      classes.imgFluid
    );
    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand=""
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={require("assets/img/landing-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={`${classes.title} font-size-xxl mobile-m-t-100`}>
                  Request 1-to-1 Direct Video Message From Your
                  Favourite Person.
                </h1>
                <p className="h5">
                  Having fun to book a video call / video shoutout request now
                  made easy. Request could be in the form of roasting a friend,
                  birthday shoutout, personal tips (Q&amp;A) from an influencer
                  or a famous face. <br />
                  You can watch, download, share &amp; keep your video forever
                </p>
                <p className="font-italic h5">
                  Tired of being one of the thousands of other users in your
                  favourites DM without any response? Fanbies make it easy by
                  supercharging your request to be seen and responded to
                </p>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <video
                  autoPlay
                  muted
                  loop
                  id="myVideo"
                  width="240"
                  height="240"
                >
                  <source src={explainervideo} />
                </video>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <React.Fragment>
              <UserFeatured
                classData={classes}
                imgClass={imageClasses}
                userData={this.state.uitems}
              />
            </React.Fragment>
            {talentListArray.length > 1 ? (
              sectionSetting.map((item, i) => {
                return (
                  <TeamSection
                    key={i}
                    talentId={item}
                    talentList={talentListArray}
                  />
                );
              })
            ) : (
              <div className="min-height-sm text-center">
                <div className="overlay">
                  <div className="lds-ripple pos-ab top-50">
                    <div />
                    <div />
                  </div>
                </div>
              </div>
            )}
            <GridContainer>
              <GridItem className="content-center" xs={12} sm={12} md={12}>
                <h3 className="h3 dark-color">Official Charity Partners</h3>
              </GridItem>
              <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      className="content-center"
                    >
                      <img
                        src={urbanlawyers}
                        style={{
                          width: "200px",
                          height: "140px",
                          position: "relative",
                          alignItems: "center"
                        }}
                        alt="Fanbies Partner Urban Lawyer"
                      />
                    </GridItem>
            </GridContainer>
            <GridContainer className="undraw-bg undraw-bg-fan">
              <GridItem className="content-center" xs={12} sm={12} md={12}>
                <h3 className="h3 dark-color">Available on mobile app</h3>
              </GridItem>
              <GridItem className="content-center" xs={12} sm={12} md={12}>
                <Button
                  size="lg"
                  color="primary"
                  simple
                  className="font-size-lg"
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.fanbiesadmin.app",
                      "_blank"
                    )
                  }
                >
                  <i className="fab fa-google-play" />
                  Google Play
                </Button>

                <Button
                  size="lg"
                  color="primary"
                  simple
                  className="font-size-lg"
                  onClick={() =>
                    window.open(
                      "https://apps.apple.com/gb/app/fanbies/id1145891462",
                      "_blank"
                    )
                  }
                >
                  <i className="fab fa-apple" />
                  Apple Store
                </Button>
              </GridItem>
            </GridContainer>
          </div>
        </div>
        <Footer />
        {/* <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.modal}
          onClose={() => this.handleClose()}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
        >
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}
          >
            {isIOS ? (
              <Button
                simple
                size="lg"
                color="primary"
                onClick={() => this.openIOS()}
              >
                <i className={"fab fa-apple"} /> Try our IOS App
              </Button>
            ) : (
              ""
            )}
            {isAndroid ? (
              <Button
                simple
                size="lg"
                color="primary"
                onClick={() => this.openAndroid()}
              >
                <i className={"fab fa-android"} /> Try our Android App
              </Button>
            ) : (
              ""
            )}
          </DialogContent>
        </Dialog> */}
      </div>
    );
  }
}

export default withStyles(landingPageStyle)(LandingPage);
