import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
//import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Badge from "components/Badge/Badge.jsx";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
//import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

//import profile from "assets/img/faces/christian.jpg";

import Danger from "components/Typography/Danger.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
//import People from "@material-ui/icons/People";
import Icon from "@material-ui/core/Icon";

import TextField from "@material-ui/core/TextField";
import DatePicker from "react-date-picker";
import dayjs from "dayjs";

import EventAvailable from "@material-ui/icons/EventAvailable";
import Share from "@material-ui/icons/Share";
import MailOutline from "@material-ui/icons/MailOutline";
import Receipt from "@material-ui/icons/Receipt";

// core components
import InfoArea from "components/InfoArea/InfoArea.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import Connection from "assets/img/connection.svg";
import "../../App.css";

class RequestForm extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      unumber: 0,
      email: "",
      messageDescription: "",
      submitDisabled: false,
      selectedEnabled: "b",
      disablePrivateFields: false,
      bookedDate: dayjs(),
      maxdate: dayjs(),
      mindate: dayjs(),
      callduration: 5,
      callDurationArray: ["5", "10", "15", "20"]
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Please note Email "),
    unumber: Joi.number()
      .required()
      .label("Please note Phonenumber "),
    messageDescription: Joi.string()
      .required()
      .label("Please note the description details to mention in video "),
    bookedDate: Joi.date()
      .required()
      .label("You need to pick a date for the video call ")
  };

  handelMakeRequest = e => {
    e.preventDefault();
    const { email, unumber, messageDescription, bookedDate } = this.state;
    const validatorObj = {
      email,
      unumber,
      messageDescription,
      bookedDate: bookedDate.date()
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.confirmRequest();
  };

  confirmRequest() {
    const {
      email,
      unumber,
      messageDescription,
      bookedDate,
      callduration
    } = this.state;
    this.setState({ submitDisabled: false });
    const celebName = this.props.location.data.name;
    const amount = this.props.location.data.rate;
    const celebUname = this.props.location.data.username;
    this.props.history.push({
      pathname: `/confirmrequest`,
      data: {
        email,
        unumber,
        messagetitle: "",
        messageDescription,
        celebName,
        celebUname,
        amount: amount,
        privacy: 0,
        calldate: bookedDate.unix(),
        callduration,
        bookingType: "videocall"
      }
    });
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears.
    if (
      localStorage.getItem("token") !== null &&
      localStorage.getItem("useremail") !== ""
    ) {
      this.setState({ disablePrivateFields: true });
      this.setState({ email: localStorage.getItem("useremail") });
    }
  }

  render() {
    if (this.props.match.params.name) return <Redirect to="/" />;
    const {
      error,
      submitDisabled,
      bookedDate,
      maxdate,
      mindate,
      callDurationArray,
      callduration
    } = this.state;
    if (!this.props.location.hasOwnProperty("data")) return <Redirect to="/" />;
    const celebName = this.props.location.data.name;
    const amount = this.props.location.data.rate;
    const celebPic = this.props.location.data.picture;
    const charity = this.props.location.data.profession;
    // set min and max date selection form calendar
    let toMax = dayjs(maxdate).add(28, "days");
    let toMin = dayjs(mindate).add(1, "days");

    const { classes, ...rest } = this.props;
    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal
    );
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div>
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
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <img
                      src={celebPic}
                      alt={celebName}
                      className={`${imageClasses} profileImg-md`}
                    />
                    <h2 className="neg-m-t-xxl">
                      Book a 1-to-1 video call with <strong>{celebName}</strong>
                    </h2>
                    {charity && (
                      <Badge className="p-v-md">
                        <span className="font-bold">
                          Proceeds in support of {charity}
                        </span>
                      </Badge>
                    )}
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={7}
                  className={`${classes.navWrapper} m-a-none`}
                >
                  <Card plain className="m-a-none">
                    <form className={classes.form} noValidate="noValidate">
                      <CardBody>
                        <Danger className="text-center">{error}</Danger>
                        <CustomInput
                          labelText="Your Email..."
                          id="email"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "email",
                            name: "email",
                            value: this.state.email,
                            onChange: this.handleChange,
                            disabled: this.state.disablePrivateFields,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  email_outline
                                </Icon>
                              </InputAdornment>
                            )
                          }}
                        />
                        <CustomInput
                          labelText="Your Phone Number"
                          id="unumber"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "number",
                            name: "unumber",
                            onChange: this.handleChange,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  smartphone_outline
                                </Icon>
                              </InputAdornment>
                            )
                          }}
                        />
                        <h3>
                          What would you like to discuss on the video call?
                          Enter your details so <strong>{celebName}</strong> can
                          better prepare for the call.
                        </h3>
                        <TextField
                          id="standard-multiline-flexible"
                          label="Try to be specific..."
                          multiline
                          rowsMax="8"
                          name="messageDescription"
                          className={classes.textField}
                          margin="normal"
                          onChange={this.handleChange}
                          fullWidth
                        />
                        <div className={`${wrapperDiv} m-a-none`}>
                          <div className="m-b-sm">
                            <p>Select preferred date ( required )</p>
                            <DatePicker
                              value={bookedDate.toDate()}
                              minDate={toMin.toDate()}
                              maxDate={toMax.toDate()}
                              onChange={date =>
                                this.setState({ bookedDate: dayjs(date) })
                              }
                            />
                          </div>
                          <p>Selected your call duration: xx mins</p>
                          <CustomDropdown
                            buttonText={`Call Duration:${callduration} mins`}
                            buttonProps={{
                              color: "primary",
                              round: true
                            }}
                            dropdownList={callDurationArray}
                            onClick={e =>
                              this.setState({
                                callduration: e.target.textContent
                              })
                            }
                          />
                          <p className="font-bold">
                            Total Cost:$
                            {amount} ({callduration} {""}
                            mins video call )
                          </p>
                        </div>
                        <p>
                          Due to the High volume of video request from some of
                          our influencers on the platform, we do offer a{" "}
                          <strong>14 days period</strong> to get the video call
                          ready and sent back to you. After 14 days period we
                          would offer 100% of the money back.
                        </p>
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        <Button
                          disabled={submitDisabled}
                          onClick={this.handelMakeRequest}
                          color="primary"
                          size="lg"
                          round
                          fullWidth
                        >
                          <Icon className={classes.inputIconsColor}>
                            payment_outline
                          </Icon>
                          Proceed
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  className={`${classes.navWrapper} m-a-none sidenotes`}
                >
                  <InfoArea
                    title={`${celebName} has 14 days to complete your request after your payment.`}
                    icon={EventAvailable}
                    description=""
                    iconColor="primary"
                  />
                  <InfoArea
                    title="Your receipt and order updates will be sent to the email provided under"
                    icon={Receipt}
                    description=""
                    iconColor="primary"
                  />
                  <InfoArea
                    title={`An email will be sent out when ${celebName} completes your request, and your registered profile `}
                    icon={MailOutline}
                    description=""
                    iconColor="primary"
                  />
                  <InfoArea
                    title="Share your personalized video shoutout; anywhere and playback anytime"
                    icon={Share}
                    description=""
                    iconColor="primary"
                  />
                  <img
                    src={Connection}
                    style={{ width: "100%" }}
                    alt="Fanbies Connecting fans with creators"
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

export default withStyles(profilePageStyle)(RequestForm);
