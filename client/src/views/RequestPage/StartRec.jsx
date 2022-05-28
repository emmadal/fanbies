import React from "react";
import { Redirect } from "react-router-dom";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import classNames from "classnames";
import axios from "axios";
import MediaCapturer from "react-multimedia-capture";
import FormData from "form-data";
//service config
import configApi from "../../services/config.json";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
//import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
//import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import image from "assets/img/bg7.jpg";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "components/Badge/Badge.jsx";
import "../../App.css";
import Slide from "@material-ui/core/Slide";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class StartRec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      title: "",
      description: "",
      isLoaded: false,
      uPic: "",
      uName: "",
      uEmail: "",
      video_status: "",
      granted: false,
      rejectedReason: "",
      recording: false,
      recordingTime: "00:00",
      dateStarted: 0,
      recordedStream: "",
      modal: false,
      completedMssg: "",
      disableBtn: false,
      recordedIsLoaded: false,
      video_date: "",
      owners_uname: "",
      errModal: false,
      uploadError: ""
    };
    this.uploadVideo = this.uploadVideo.bind(this);
    this.fileInput = React.createRef();
  }
  getDetails() {
    let requestid = "";
    if (this.props.location.hasOwnProperty("data")) {
      requestid = this.props.location.data.id;
    }
    axios
      .post(configApi.getshoutoutbyid, { id: requestid })
      .then(res => {
        const requestDetails = res.data;
        if (!requestDetails.success)
          return this.setState({ error: requestDetails.message });
        //Check if the request belongs to the current logged in celeb user
        if (
          requestDetails.response[0].responseid !==
          parseInt(localStorage.getItem("fan_id"), 10)
        ) {
          this.props.history.replace("/dashboard");
          return;
        }
        this.setState({
          uName: requestDetails.response[0].name,
          uPic: requestDetails.response[0].picture,
          uEmail: requestDetails.response[0].email,
          title: requestDetails.response[0].mention_name,
          description: requestDetails.response[0].message_shoutout,
          video_privacy: requestDetails.response[0].privacy,
          owner_id: requestDetails.response[0].requestid,
          response_id: requestDetails.response[0].responseid,
          request_id: requestDetails.response[0].id,
          video_status: requestDetails.response[0].status,
          video_date: requestDetails.response[0].date,
          owners_uname: requestDetails.response[0].owners_name,
          isLoaded: true
        });
      })
      .catch(err => {
        //sentry
        console.warn(err);
        //this.setState({ submitDisabled: false });
      });
  }

  componentDidMount() {
    this.getDetails();
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
        if (this.state.video_status !== "created")
          return this.props.history.replace("/dashboard");
      }.bind(this),
      700
    );
  }

  componentWillUnmount() {
    this.setState(
      {
        recording: false,
        recordingTime: "00:00"
      },
      () => clearInterval(this.stopTimer)
    );
  }

  handleGranted = () => {
    this.setState({ granted: true });
  };

  handleDenied = err => {
    this.setState({ rejectedReason: err.name });
  };

  handleStart = stream => {
    this.setState({
      recording: true,
      dateStarted: new Date().getTime()
    });

    this.setStreamToVideo(stream);
    this.stopTimer = setInterval(this.calculateTimeDuration, 1000);
  };
  handleStop = blob => {
    this.setState(
      {
        recording: false,
        recordingTime: "00:00",
        recordedStream: blob
      },
      () => clearInterval(this.stopTimer)
    );
    this.releaseStreamFromVideo(blob);
  };

  handleClickOpen = modal => {
    var x = [];
    x[modal] = true;
    this.setState(x);
  };

  handleClose = modal => {
    if (this.state.recordedIsLoaded !== true) {
      var x = [];
      x[modal] = false;
      this.setState(x);
      let previewVideo = document.querySelector("video#preview");
      previewVideo.srcObject = null;
      previewVideo.src = null;
      this.setState({ recording: false });
    }
  };

  handleCloseErrorModal = modal => {
    var x = [];
    x[modal] = false;
    this.setState(x);
  };

  calculateTimeDuration = () => {
    let secs = (new Date().getTime() - this.state.dateStarted) / 1000;

    let hr = Math.floor(secs / 3600);
    let calHr = hr * 3600;
    let min = Math.floor((secs - calHr) / 60);
    let calMin = min * 60;
    let sec = Math.floor(secs - calHr - calMin);
    if (sec < 10) {
      sec = "0" + sec;
    }

    if (sec === 59) {
      document.querySelector(".stop__btn span").click();
    }
    this.setState({ recordingTime: `00:${sec}` });
  };

  handleError = err => {
    //sentry
    console.log(err);
  };

  handleStreamClose = () => {
    this.setState({
      granted: false
    });
  };

  setStreamToVideo = stream => {
    let video = document.querySelector("video");
    video.srcObject = stream;
  };

  releaseStreamFromVideo = stream => {
    document.querySelector("video#recorder").srcObject = null;
    // Display a preview page for recorded request
    this.handleClickOpen("modal");
    let previewVideo = document.querySelector("video#preview");
    previewVideo.srcObject = null;
    previewVideo.src = null;
    previewVideo.src = window.URL.createObjectURL(stream);
    previewVideo.controls = true;
    previewVideo.play();
  };

  //Upload to Node for further processing
  uploadVideo() {
    let data = new FormData();
    const {
      uEmail,
      recordedStream,
      uName,
      video_privacy,
      owner_id,
      response_id,
      request_id,
      video_date,
      owners_uname
    } = this.state;
    data.append("file", recordedStream);
    data.set("ownername", uName);
    data.set("owner_uname", owners_uname);
    data.set("video_privacy", video_privacy);
    data.set("video_owner_id", owner_id);
    data.set("video_recorder_id", response_id);
    data.set("request_id", request_id);
    //emails
    data.set("video_req_date", video_date);
    data.set("video_owner_email", uEmail);
    data.set("video_recorder_email", localStorage.getItem("useremail"));
    data.set("recorder_name", localStorage.getItem("fab_name"));
    //
    // remove preview with a loading screen
    let previewVideo = document.querySelector("video#preview");
    previewVideo.srcObject = null;
    previewVideo.src = null;
    //User should be able to submit one recording per session.
    this.setState({
      disableBtn: true,
      recordedIsLoaded: true,
      completedMssg: "Thank you, video request is now been submitted. "
    });
    setTimeout(() => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data,
        url: configApi.uploadrecvideo
      };
      axios(options).then(res => {
        const resp = res.data;
        if (!resp.success)
          return this.setState({
            recordedIsLoaded: true,
            completedMssg: resp.message
          });

        this.setState({
          recordedIsLoaded: false,
          completedMssg: resp.message
        });
        const uname = localStorage.getItem("username");
        this.props.history.replace(`/user/${uname}`);
      });
    }, 1000);
  }

  handleManualUpdate = () => {
    let _this = this;
    this.setState({ uploadError: "" });
    let previewVideo = document.querySelector("video#preview");
    previewVideo.preload = "metadata";

    previewVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(previewVideo.src);
      if (previewVideo.duration > 60) {
        previewVideo.srcObject = null;
        previewVideo.src = null;
        return _this.setState({
          uploadError:
            "Invalid Video! Video duration should less than 60 second / 1 mintue",
          errModal: true
        });
      }

      this.handleClickOpen("modal");
    };

    document.querySelector("video#recorder").srcObject = null;
    previewVideo.srcObject = null;
    previewVideo.src = null;
    previewVideo.src = window.URL.createObjectURL(
      this.fileInput.current.files[0]
    );
    this.setState({ recordedStream: this.fileInput.current.files[0] });
    previewVideo.controls = true;
    previewVideo.play();
  };

  render() {
    if (
      !localStorage.getItem("token") &&
      !localStorage.getItem("fan_id") &&
      !this.props.location.hasOwnProperty("data")
    ) {
      return <Redirect to="/dashboard" />;
    }
    const { classes, ...rest } = this.props;
    const {
      isLoaded,
      title,
      description,
      uName,
      uPic,
      granted,
      recording,
      recordingTime,
      completedMssg,
      disableBtn,
      recordedIsLoaded,
      video_privacy,
      uploadError
    } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies"
          rightLinks={<HeaderLinks />}
          absolute
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
          <div className={classes.container}>
            <GridContainer justify="flex-end">
              <GridItem xs={3} sm={3} md={3}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <CardBody>
                    <input
                      accept="video/mp4"
                      className={`${classes.input} fileInput`}
                      id="videofile"
                      multiple
                      type="file"
                      onChange={this.handleManualUpdate}
                      ref={this.fileInput}
                    />
                    <label
                      htmlFor="videofile"
                      className="d-block text-center clickable-icon"
                    >
                      Click icon to upload MP4 &nbsp;
                      <VideoLibrary
                        style={{
                          color: "#000",
                          fontSize: "6em",
                          display: "block",
                          margin: "0 auto"
                        }}
                      />
                    </label>
                    <p>
                      You also have an option above, to upload a Pre-recorded
                      video of length not longer than 1 min (MP4) file.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={5} sm={5} md={6}>
                <MediaCapturer
                  constraints={{ audio: true, video: true }}
                  timeSlice={10}
                  onGranted={this.handleGranted}
                  onDenied={this.handleDenied}
                  onStart={this.handleStart}
                  onStop={this.handleStop}
                  onError={this.handleError}
                  onStreamClosed={this.handleStreamClose}
                  render={({ request, start, stop }) => {
                    return (
                      <div>
                        <div className="recoder-container">
                          {!granted ? (
                            <span className="activation-btn">
                              <Button
                                onClick={request}
                                fullWidth
                                color="primary"
                                size="lg"
                              >
                                Activate camera
                              </Button>
                            </span>
                          ) : (
                            <div className="text-center vidoe__btn">
                              {!recording ? (
                                <Tooltip
                                  id="tooltip-bottom"
                                  title="Start Cam Recording..."
                                  placement="bottom"
                                  classes={{ tooltip: classes.tooltip }}
                                >
                                  <Button
                                    onClick={start}
                                    size="lg"
                                    justIcon
                                    round
                                    color="danger"
                                  >
                                    <i className={"fas fa-video"} />
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  id="tooltip-bottom"
                                  title="Stop Recording..."
                                  placement="bottom"
                                  classes={{ tooltip: classes.tooltip }}
                                >
                                  <span className="stop__btn">
                                    <Button
                                      onClick={stop}
                                      size="lg"
                                      justIcon
                                      round
                                      color="danger"
                                    >
                                      <i className={"fas fa-stop"} />
                                    </Button>
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                          )}
                          <div className="video-wrapper">
                            <video
                              autoPlay
                              muted
                              height="400"
                              width="500"
                              id="recorder"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </GridItem>
              <GridItem xs={3} sm={3} md={3}>
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
                  <div>
                    <p className="font-size-xxxxl text-center m-v-md">
                      {recordingTime}
                    </p>
                    <p className="m-v-xl">
                      Please take your time to record a max of
                      <b>&nbsp; 1 mintue&nbsp;</b>
                      video to your fan.
                    </p>
                    <Card className={`${classes[this.state.cardAnimaton]}`}>
                      <CardBody>
                        <p className="d-inline-block">
                          {video_privacy === 0 ? (
                            ""
                          ) : (
                            <Badge color="warning">Private Request</Badge>
                          )}
                        </p>
                        <h4 className="strong text-center">
                          <strong>Request For:</strong> {uName}
                        </h4>
                        <div className="text-center m-b-sm">
                          <img
                            src={uPic}
                            alt={uName}
                            className={`${imageClasses} border-round profileImg-md`}
                          />
                        </div>
                        <p>
                          <strong>Title:&nbsp;</strong>
                          <span className="font-size-md">{title}</span>
                        </p>
                        <p>
                          <strong>Full Description:&nbsp;</strong>
                          <span className="font-size-md">{description}</span>
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </GridItem>
            </GridContainer>
            <Dialog
              classes={{
                root: classes.center,
                paper: classes.modal + " " + classes.modalLarge
              }}
              open={this.state.modal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleClose("modal")}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <IconButton
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => this.handleClose("modal")}
                >
                  <Close className={classes.modalClose} />
                </IconButton>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                {recordedIsLoaded ? (
                  <div className="min-height-sm text-center">
                    <div className="overlay transparent">
                      <div className="lds-ripple pos-ab top-0">
                        <div />
                        <div />
                      </div>
                    </div>
                    <h3>{completedMssg}</h3>
                  </div>
                ) : (
                  <video id="preview" height="400" width="500" playsInline />
                )}
              </DialogContent>
              <DialogActions
                className={
                  classes.modalFooter + " " + classes.modalFooterCenter
                }
              >
                {!recordedIsLoaded && (
                  <React.Fragment>
                    <Button
                      onClick={() => this.handleClose("modal")}
                      color="danger"
                      simple
                    >
                      Record Again
                    </Button>
                    <Button
                      disabled={disableBtn}
                      color="primary"
                      onClick={() => this.uploadVideo()}
                    >
                      Submit
                    </Button>
                  </React.Fragment>
                )}
              </DialogActions>
            </Dialog>
            <Dialog
              classes={{
                root: classes.center,
                paper: classes.modal + " " + classes.modalLarge
              }}
              open={this.state.errModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseErrorModal("errModal")}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description"
            >
              <DialogContent>{uploadError}</DialogContent>
            </Dialog>
          </div>
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(StartRec);
