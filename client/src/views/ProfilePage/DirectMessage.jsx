import React from "react";
import { Helmet } from "react-helmet";
import Joi from "joi-browser";
import _ from "lodash";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/icons
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Danger from "components/Typography/Danger.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import "../../App.css";

class DirectMessage extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      directmessage: "",
      messageLogs: [],
      senderPic: "",
      isLoading: true,
      isEmptyConversation: false,
      startConversation: "Start a Conversation with Fanbies Admin",
      submitDisabled: false
    };
  }
  schema = {
    message: Joi.string()
      .required()
      .label("direct message ")
  };

  handleDirectMessage = e => {
    e.preventDefault();
    const message = this.state.directmessage;
    const validatorObj = {
      message
    };
    const result = Joi.validate(validatorObj, this.schema);
    // //clear the error state
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    // loading in action
    this.sendDirectMessage(message);
  };

  getDirectMessages = () => {
    const myid = localStorage.getItem("fan_id");
    if (!this.props.location.hasOwnProperty("data"))
      return <Redirect to="/dm" />;
    var arryID = [
      this.props.location.data.reponsederid,
      this.props.location.data.senderid
    ];
    var receiverID = _.find(arryID, i => i !== myid);
    axios
      .post(configApi.getdirectmessages, {
        jtoken: localStorage.getItem("token"),
        otherid: receiverID
      })
      .then(res => {
        const messageResponse = res.data;
        if (!messageResponse.success)
          return this.setState({
            error: messageResponse.message,
            isLoading: false
          });
        if (this._isMounted) {
          this.setState({
            messageLogs: messageResponse.response.message,
            senderPic: this.props.location.data.reponserpic, //this should be moved... and get from the response
            isLoading: false
          });
        }
      })
      .catch(e => {
        this.setState({ error: e });
      });
  };

  componentDidMount() {
    this._isMounted = true;
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    if (this._isMounted) {
      this.getDirectMessages();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  sendDirectMessage = message => {
    const randomNumber = Math.floor(Math.random() * Math.floor(9999));
    let conversationID = randomNumber;
    // if (this.props.location.hasOwnProperty("data")) {
    //   conversationID = this.props.location.data.convoid;
    // }
    const ownerid = localStorage.getItem("fan_id");
    const date = Math.floor(new Date() / 1000);
    const dummyObj = {
      clearmsgID: null,
      conversationID,
      date,
      id: randomNumber,
      image: null,
      link: "",
      message,
      receiver: 1,
      sender: ownerid,
      type: 0,
      unseen: 1
    };
    this.setState(prevState => ({
      messageLogs: [dummyObj, ...prevState.messageLogs],
      isEmptyConversation: false
    }));
    const myid = localStorage.getItem("fan_id");
    var arryID = [
      this.props.location.data.reponsederid,
      this.props.location.data.senderid
    ];
    var receiverID = _.find(arryID, i => i !== myid);

    axios
      .post(configApi.sendmessage, {
        message,
        date,
        jtoken: localStorage.getItem("token"),
        receiver: receiverID
      })
      .then(res => {
        this.setState({ submitDisabled: false });
        const sentResponse = res.data;
        if (!sentResponse.success)
          return this.setState({ error: sentResponse.message });
        this.setState({ directmessage: "" });
      })
      .catch(e => {
        this.setState({ error: e, submitDisabled: false });
      });
  };

  renderMessage = items => {
    const { classes } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const ownerpic = localStorage.getItem("picid");
    const ownerid = localStorage.getItem("fan_id");
    const item = items.map((item, i) => {
      return (
        <div
          className={`${
            item.sender === ownerid ? "flex-direction__reverse" : ""
          } chat-message`}
          key={i}
        >
          <img
            src={item.sender === ownerid ? ownerpic : this.state.senderPic}
            alt={`user-${item.sender}`}
            className={`${imageClasses} profileImg-sm`}
          />
          <p className="chat-bubble">{item.message}</p>
          <p className="font-size-sm chat-date">
            {this.renderDateStamp(item.date)}
          </p>
        </div>
      );
    });
    return item;
  };

  renderDateStamp = stamp => {
    // Convert timestamp to milliseconds
    let date = new Date(stamp * 1000);
    const months_arr = [
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

    const hour = date.getHours();
    const minutes = date.getMinutes();
    const month = months_arr[date.getMonth()];
    const day = date.getDay();

    // Display date time in MM-dd-yyyy h:m:s format
    const convdataTime = `${day} ${month},${hour}:${minutes}`;
    //let convdataTime = `${hour}:${minutes}`;
    return convdataTime;
  };

  render() {
    //Redirect users not logged in
    if (localStorage.getItem("token") === null)
      return <Redirect to="/dashboard" />;
    if (!this.props.location.hasOwnProperty("data"))
      return <Redirect to="/dm" />;
    const {
      error,
      directmessage,
      isLoading,
      submitDisabled,
      cardAnimaton,
      messageLogs,
      isEmptyConversation,
      startConversation
    } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Direct Message With Fanbies Admin - Direct Message</title>
          <meta
            name="description"
            content="Search from over 100s of great talents, influencers or famous faces to request a personalised direct video messages from"
          />
        </Helmet>
        <Header
          color="transparent"
          brand="Fanbies Search Page"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <Parallax large filter image={require("assets/img/profile-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={7}
                className={`${classes.navWrapper} m-v-lg`}
              >
                <Card className={(classes[cardAnimaton], "zIndex m-t-lg")}>
                  <CardBody>
                    <Danger>{error}</Danger>
                    {isLoading ? (
                      <div className="min-height-sm">
                        <div className="overlay transparent">
                          <div className="lds-ripple pos-ab top-0">
                            <div />
                            <div />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="chat-area">
                        {isEmptyConversation === true
                          ? startConversation
                          : this.renderMessage(messageLogs)}
                      </div>
                    )}
                    <CustomInput
                      labelText="Message..."
                      id="directmessage"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        name: "directmessage",
                        value: directmessage,
                        onChange: this.handleChange,
                        endAdornment: (
                          <Button
                            round
                            color="primary"
                            onClick={this.handleDirectMessage}
                            disabled={submitDisabled}
                          >
                            Send
                          </Button>
                        )
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(DirectMessage);
