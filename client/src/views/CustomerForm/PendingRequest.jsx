import React from "react";
import { Redirect } from "react-router-dom";
// nodejs library that concatenates classes
import axios from "axios";
import Joi from "joi-browser";
import _ from "lodash";
import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import configApi from "../../services/config.json";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Badge from "components/Badge/Badge.jsx";
import Danger from "components/Typography/Danger.jsx";
import Popover from "@material-ui/core/Popover";
import Call from "@material-ui/icons/Call";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import "../../App.css";
let pendingStatusReason = "";
const jtoken = localStorage.getItem("token");
class PendingRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      isLoaded: false,
      pendingArr: [],
      openBottom: false,
      openTop: false,
      editPopover: false,
      isVip: false,
      reasonDetails: "",
      updateRequestId: "",
      selectedEnabled: "b",
      submitDisabled: false,
      messageDescription: "",
      messagetitle: "",
      checked: [],
      booking_type: 0,
      call_date: 0,
      call_duration: 0,
      requestStatus: ""
    };
  }

  schema = {
    messagetitle: Joi.string()
      .required()
      .label("Please note the name or title to mention in video "),
    messageDescription: Joi.string()
      .required()
      .label("Please note the description details to mention in video ")
  };

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({ checked: newChecked });
  }

  handelUpdateRequest = e => {
    e.preventDefault();
    const { messagetitle, messageDescription } = this.state;
    const validatorObj = {
      messagetitle,
      messageDescription
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.confirmUpdateRequest();
  };

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  confirmUpdateRequest = () => {
    const {
      messagetitle,
      messageDescription,
      checked,
      updateRequestId
    } = this.state;
    const privacy = checked.indexOf(22) === 0 ? 1 : 0;
    axios
      .post(configApi.updaterequest, {
        title: messagetitle,
        description: messageDescription,
        privacy: privacy,
        requestId: updateRequestId,
        jtoken
      })
      .then(res => {
        const uRes = res.data;
        if (!uRes.success)
          return this.setState({
            error: uRes.message,
            submitDisabled: false
          });

        this.setState(
          {
            editPopover: false,
            error: ""
          },
          () => {
            window.location.reload();
          }
        );
      })
      .catch(e => {
        pendingStatusReason = "";
        this.setState({ submitDisabled: false, openTop: false });
        console.log("🤯", e);
      });
  };

  getPendingRequest() {
    axios
      .post(configApi.getallpendingshoutout, {
        username: this.props.match.params.username,
        jtoken
      })
      .then(res => {
        const uRes = res.data;
        if (!uRes.success) {
          this.setState({ error: uRes.message });
          this.props.history.replace("/dashboard");
          return;
        }

        this.setState({
          pendingArr: uRes.response,
          isLoaded: true,
          error: ""
        });
      })
      .catch(e => {
        console.log("🤯", e);
      });
  }

  handelMakeRequest = () => {
    const { updateRequestId, reasonDetails, pendingArr } = this.state;
    this.setState({ submitDisabled: true });
    if (updateRequestId !== "" && pendingStatusReason !== "") {
      axios
        .post(configApi.updaterequeststatus, {
          requestId: updateRequestId,
          status: pendingStatusReason,
          reason: reasonDetails,
          jtoken
        })
        .then(res => {
          pendingStatusReason = "";
          const uRes = res.data;
          if (!uRes.success)
            return this.setState({
              error: uRes.message,
              submitDisabled: false
            });
          // remove element from state
          _.remove(pendingArr, {
            id: updateRequestId
          });
          this.setState({ pendingArr, submitDisabled: false, openTop: false });
        })
        .catch(e => {
          pendingStatusReason = "";
          this.setState({ submitDisabled: false, openTop: false });
          console.log("🤯", e);
        });
    }
  };

  //handel request popover descriptions
  handleDescription(
    state,
    requestTitle,
    requestDescription,
    requestId,
    name,
    isVip,
    privacy,
    date,
    pic,
    booking_type,
    call_date,
    call_duration,
    requestStatus
  ) {
    this.setState({
      [state]: true,
      requestDescription,
      requestTitle,
      requestId,
      name,
      isVip,
      privacy,
      date,
      pic,
      booking_type,
      call_date,
      call_duration,
      requestStatus
    });
  }

  //close request popover descriptions
  handleClosePopover(state) {
    this.setState({
      [state]: false
    });
  }

  renderFullDetail() {
    const { classes } = this.props;
    const {
      requestTitle,
      requestDescription,
      requestId,
      name,
      isVip,
      privacy,
      date,
      pic,
      booking_type,
      call_date,
      call_duration,
      requestStatus
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
        <h3 className={`text-center default-color ${classes.popoverHeader}`}>
          {booking_type === 1 ? "Video Call Request" : "Request Information"}
        </h3>
        <span className="d-inline-block floatRight">
          {privacy === 0 ? "" : <Badge color="warning">Private</Badge>}
        </span>
        <div className={classes.popoverBody}>
          <img
            src={pic}
            alt={`${name} profile pic`}
            className={`${imageClasses} img-align-center profileImg-md`}
          />
          {booking_type === 1 ? (
            <span className="font-bold">
              {isVip === true ? `Calling: ` : ""}
            </span>
          ) : (
            <span className="font-bold">{isVip === true ? `From: ` : ""}</span>
          )}
          <span>{isVip === true ? `${name}` : ""}</span>
          <p className="m-v-sm">
            {requestTitle !== "" && (
              <>
                <b>Title:&nbsp;</b>
                <span>{requestTitle}</span>
              </>
            )}
          </p>
          <p>
            <b>
              {booking_type === 1 ? "Purpose of the call" : "Description"}
              :&nbsp;
            </b>
            <span>{requestDescription}</span>
          </p>
          {booking_type === 1 ? (
            <>
              <p>
                <b>Call date: </b>
                {this.renderDateStamp(call_date)}
              </p>
              <p>
                <b>Duration of the call: </b>
                {call_duration} mins
              </p>
            </>
          ) : (
            <p>
              <b>Requested Date: </b>
              {this.renderDateStamp(date)}
            </p>
          )}
          {isVip === true &&  //Start video call
            booking_type === 1 && (
              <>
                {requestStatus === "processing" ? (
                  <Button
                    color="primary"
                    className="floatRight m-v-md"
                    onClick={() => console.log("Join Call")}
                    round
                  >
                    Join Call Again
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="floatRight m-v-md"
                    onClick={() =>
                      this.props.history.push({
                        pathname: `/videocall`,
                        data: {
                          requestId,
                          agora_uid: localStorage.getItem("fan_id") * 1.2020,
                          uid: localStorage.getItem("fan_id"),
                          username: localStorage.getItem("username"),
                          duration: call_duration,
                          remoteUserPic: pic,
                          remoteUserName: name,
                          requestStatus,
                          superUser: isVip,
                          purpose: requestDescription,
                          channelname: `#FBN-19-${requestId}`
                        }
                      })
                    }
                    round
                  >
                    Call
                  </Button>
                )}
                <Button
                  color="warning"
                  className="floatLeft m-v-md"
                  onClick={() => console.log("Reminder")}
                  round
                >
                  Send a Reminder
                </Button>
              </> // End video call
            )}
          {!isVip &&
            requestStatus === "processing" &&
            booking_type === 1 && (
              <React.Fragment>
                <Button
                  color="warning"
                  className="floatRight m-v-md"
                  onClick={() => console.log("joinCall")}
                  round
                >
                  Join Call
                </Button>
              </React.Fragment>
            )}
          {isVip === true &&
            requestStatus === "created" &&
            booking_type === 0 && (
              <React.Fragment>
                <Button
                  color="warning"
                  className="floatLeft m-v-md"
                  onClick={() => {
                    this.setState({
                      updateRequestId: requestId,
                      openTop: true,
                      openBottom: false
                    });
                    pendingStatusReason = "rejected";
                  }}
                  round
                >
                  Reject Request
                </Button>
                <Button
                  color="primary"
                  className="floatRight m-v-md"
                  onClick={() => this.handleStartRequest(requestId)}
                  round
                >
                  Start Request
                </Button>
              </React.Fragment>
            )}
          {!isVip &&
            booking_type === 0 && (
              <React.Fragment>
                <Button
                  color="warning"
                  className="floatLeft m-v-md"
                  onClick={() => {
                    this.setState({
                      updateRequestId: requestId,
                      openTop: true,
                      openBottom: false
                    });
                    pendingStatusReason = "cancelled";
                  }}
                  round
                >
                  Cancel Request
                </Button>
                <Button
                  color="warning"
                  className="floatRight m-v-md"
                  onClick={() => {
                    if (privacy === 1) {
                      this.setState(prevState => ({
                        checked: [...prevState.checked, 22]
                      }));
                    }
                    this.setState({
                      updateRequestId: requestId,
                      messagetitle: requestTitle,
                      messageDescription: requestDescription,
                      editPopover: true,
                      openBottom: false
                    });
                    pendingStatusReason = "cancelled";
                  }}
                  round
                >
                  Edit Request
                </Button>
              </React.Fragment>
            )}
        </div>
      </Popover>
    );
  }
  // Popover for pending editing
  renderEditPopover() {
    const { classes } = this.props;
    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal
    );
    return (
      <Popover
        classes={{
          paper: classes.popover
        }}
        style={{ width: "35em" }}
        open={this.state.editPopover}
        anchorEl={this.anchorElBottom}
        anchorReference={"anchorEl"}
        onClose={() => this.handleClosePopover("editPopover")}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} className={classes.navWrapper}>
              <Danger>{this.state.error}</Danger>
              <h3
                className={`text-center default-color ${classes.popoverHeader}`}
              >
                {` Edit Pending Request  `}
              </h3>
              <form className={classes.form} noValidate="noValidate">
                <CustomInput
                  labelText="Name been mentioned for shoutout? or Title"
                  id="messagetitle"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text",
                    onChange: this.handleChange,
                    name: "messagetitle",
                    value: this.state.messagetitle
                  }}
                />
                <TextField
                  id="standard-multiline-flexible"
                  label="Video Message description ..."
                  multiline
                  rowsMax="3"
                  name="messageDescription"
                  value={this.state.messageDescription}
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange}
                  fullWidth
                />
                <div className={`${wrapperDiv} m-a-none`}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={() => this.handleToggle(22)}
                        checked={
                          this.state.checked.indexOf(22) !== -1 ? true : false
                        }
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{ checked: classes.checked }}
                      />
                    }
                    classes={{ label: classes.label }}
                    label="Private (Don't share this video on Fanbies)"
                  />
                </div>
                <Button
                  disabled={this.state.submitDisabled}
                  onClick={this.handelUpdateRequest}
                  color="primary"
                  size="lg"
                  round
                  fullWidth
                >
                  Update
                </Button>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </Popover>
    );
  }
  // Popover for pending cancellation / rejection
  renderReason() {
    const { classes } = this.props;
    return (
      <Popover
        classes={{
          paper: classes.popover
        }}
        style={{ width: "5em" }}
        open={this.state.openTop}
        anchorEl={this.anchorElBottom}
        anchorReference={"anchorEl"}
        onClose={() => this.handleClosePopover("openTop")}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center"
        }}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={9} className={classes.navWrapper}>
            <Danger>{this.state.error}</Danger>
            <h3
              className={`text-center default-color ${classes.popoverHeader}`}
            >
              {` Request will be ${pendingStatusReason}, Please give a reason below `}
            </h3>
            <form className={classes.form} noValidate="noValidate">
              <TextField
                id="standard-multiline-flexible"
                label="Reason for action ..."
                multiline
                rowsMax="3"
                name="reasonDetails"
                className={classes.textField}
                margin="normal"
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                disabled={this.state.submitDisabled}
                onClick={this.handelMakeRequest}
                color="primary"
                size="lg"
                round
                fullWidth
              >
                Yes
              </Button>
              <p>OR</p>
              <Button
                disabled={this.state.submitDisabled}
                onClick={() => this.handleClosePopover("openTop")}
                color="error"
                size="lg"
                round
                fullWidth
              >
                No
              </Button>
            </form>
          </GridItem>
        </GridContainer>
      </Popover>
    );
  }
  // Start the Video pending request
  handleStartRequest(id) {
    this.props.history.push({
      pathname: `/rec`,
      data: { id }
    });
  }
  //Reject Dialog Page
  // handleRejectRequest(id) {
  //   this.props.history.push({
  //     pathname: `/rec`,
  //     data: { id }
  //   });
  // }

  handleUploadRequest(id) {
    this.props.history.push({
      pathname: `/rec`,
      data: { id }
    });
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

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }

  componentDidMount() {
    this.getPendingRequest();
  }

  renderPendingRequest = () => {
    const { pendingArr } = this.state;
    const { classes } = this.props;
    // const badgeArry = [
    //   "#00acc1",
    //   "#4caf50",
    //   "#ff9800",
    //   "#e91e63",
    //   "#999999",
    //   "#6f4c93",
    //   "#5e2296",
    //   "#b91d32"
    // ];
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const pendingRequest = pendingArr.map((item, i) => {
      //const rand = badgeArry[Math.floor(Math.random() * badgeArry.length)];
      return (
        <Card
          className="text-left m-a-md d-inline-block min-height-md"
          style={{ width: "15rem" }}
          key={i}
        >
          <CardBody className="p-a-md">
            <div
              className="clickable-icon"
              onClick={() =>
                this.handleDescription(
                  "openBottom",
                  item.mention_name,
                  item.message_shoutout,
                  item.id,
                  item.name,
                  item.isVip,
                  item.privacy,
                  item.date,
                  item.picture,
                  item.booking_type,
                  item.call_date,
                  item.call_duration,
                  item.status
                )
              }
            >
              <div className="m-a-none p-a-md min-height-xs">
                <img
                  src={item.picture}
                  alt={`${item.name} profile pic`}
                  className={`${imageClasses} img-align-center profileImg-sm`}
                />
                <span className="text-capital m-a-md text-center d-block font-bold">
                  {item.name}
                </span>
                {/* <RadioButtonChecked style={{ color: rand }} /> */}
                {/* <p className="font-size-sm floatRight m-a-none d-inline-block">
                  Requested Date: {this.renderDateStamp(item.date)}
                </p> */}
                <p className="d-inline-block floatRight">
                  {item.privacy === 0 ? (
                    ""
                  ) : (
                    <Badge color="warning">Private Request</Badge>
                  )}
                </p>
                {item.booking_type === 1 ? (
                  <Call />
                ) : (
                  <i className="fas fa-video d-inline-block font-size-xl default-color" />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      );
    });
    return pendingRequest;
  };

  render() {
    if (
      !this.props.match.params.username ||
      localStorage.getItem("token") === null
    )
      return <Redirect to="/" />;

    const username = this.props.match.params.username;
    const { error, isLoaded, pendingArr } = this.state;
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
                  <h2 className="text-center">Pending Request (s)</h2>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.navWrapper}
                >
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
                      <Danger>{error}</Danger>
                      {pendingArr.length <= 0 ? (
                        <div>
                          <span className="text-center d-inline-block m-a-md">
                            You have no pending request at the moment.
                          </span>
                          <Button
                            size="lg"
                            color="rose"
                            onClick={() => this.props.history.push("/f")}
                          >
                            Make Search Request
                          </Button>
                        </div>
                      ) : (
                        <React.Fragment>
                          {this.renderPendingRequest()}
                          {this.renderReason()}
                          {this.renderEditPopover()}
                        </React.Fragment>
                      )}
                    </div>
                  )}
                </GridItem>
              </GridContainer>
            </div>
          </div>
          {this.renderFullDetail()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(PendingRequest);
