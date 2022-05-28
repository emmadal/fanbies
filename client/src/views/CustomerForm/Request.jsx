import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
//import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
//import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Badge from "components/Badge/Badge.jsx";
//import profile from "assets/img/faces/christian.jpg";
// date picker
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import Danger from "components/Typography/Danger.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
//import People from "@material-ui/icons/People";
import Icon from "@material-ui/core/Icon";

import TextField from "@material-ui/core/TextField";

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
      //uname: "",
      unumber: 0,
      email: "",
      checked: [],
      messagetitle: "",
      messageDescription: "",
      submitDisabled: false,
      selectedEnabled: "b",
      disablePrivateFields: false,
      privacy: 0,
      neededBy: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    //this.loadprofile = this.loadprofile.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Please note Email "),
    unumber: Joi.number()
      .required()
      .label("Please note Phonenumber "),
    messagetitle: Joi.string()
      .required()
      .label("Please note the name to mention in video "),
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

  handelMakeRequest = (e,type) => {
    e.preventDefault();

    const { email, unumber, messagetitle, messageDescription } = this.state;
    const validatorObj = {
      email,
      unumber,
      messagetitle,
      messageDescription
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    
    this.confirmRequest(type);
    
  };


  confirmRequest(type) {
    const {
      email,
      unumber,
      messagetitle,
      messageDescription,
      checked,
      selectedDay
    } = this.state;

    this.setState({ submitDisabled: false });
    const celebName = this.props.location.data.name;
    const amount = this.props.location.data.rate;
    const fullMessage = selectedDay !== undefined ? `${messageDescription} - shoutout booking is needed by date: ${selectedDay}`: messageDescription;
    //const celebId = this.props.location.data.uid;
    //const uemail = this.props.location.data.uemail;
    const celebUname = this.props.location.data.username;
    const privacy = checked.indexOf(22) === 0 ? 1 : 0;
   // console.log("what type", type);
    if (type == 'free') {
      this.props.history.push({
        pathname: `/requested`,
        data: {
          payToken: '',
          payerID: '',
          paymentID: '',
          payerEmail: '',
          payerPaid: '',
          amountPaid: amount,
          useremail: email,
          videoPrivacy: privacy,
          celebName,
          celebUname,
          messagetitle,
          messageDescription: fullMessage,
          calldate: 0,
          callduration: 0,
          bookingType: "shoutout"
        }
      });
    } else {
      this.props.history.push({
        pathname: `/confirmrequest`,
        data: {
          email,
          unumber,
          messagetitle,
          messageDescription: fullMessage,
          celebName,
          celebUname,
          amount,
          privacy,
          calldate: 0,
          callduration: 0,
          bookingType: "shoutout"
        }
      });
    }
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
    // if (this.props.match.params.username !== null) {
    //   //this.loadprofile();
    // }
  }

  handleDayChange = day => {
    this.setState({ selectedDay: day });
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  render() {
    if (this.props.match.params.name) return <Redirect to="/" />;
    const { error, submitDisabled, selectedDay } = this.state;
    if (!this.props.location.hasOwnProperty("data")) return <Redirect to="/" />;
    const celebName = this.props.location.data.name;
    const amount = this.props.location.data.rate;
    const celebPic = this.props.location.data.picture;
    const charity = this.props.location.data.profession;
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
    const celebUsername = this.props.location.data.username;

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
                <GridItem xs={3} sm={3} md={2}>
                  <span
                    className="default-color clickable-icon font-bold"
                    onClick={() =>
                      window.location.replace(`/user/${celebUsername}`)
                    }
                  >
                    &#60; Back
                  </span>
                </GridItem>
                <GridItem xs={10} sm={10} md={6}>
                  <div className={classes.profile}>
                    <img
                      src={celebPic}
                      alt={celebName}
                      className={`${imageClasses} profileImg-md`}
                    />
                    <h2 className="neg-m-t-xxl">
                      Get a customized, personalized, and unique video message
                      from <strong>{celebName}</strong> for
                      <strong> &#36; {amount} </strong>
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
                          Enter your details so <strong>{celebName}</strong> can
                          help deliver a unique &amp; personal message for you
                          (Interests, Hobbies, Hometown, Birthday, Age etc)
                        </h3>
                        <CustomInput
                          labelText="Name to be mentioned for shoutout? or Title"
                          id="messagetitle"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            name: "messagetitle",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className={classes.inputIconsColor}>
                                  contact_mail_outline
                                </Icon>
                              </InputAdornment>
                            )
                          }}
                        />
                        <TextField
                          id="standard-multiline-flexible"
                          label="What is the message (e.g wish my sister happy birthday, roast my baseball friend donald ) ..."
                          multiline
                          rowsMax="8"
                          name="messageDescription"
                          className={classes.textField}
                          margin="normal"
                          onChange={this.handleChange}
                          fullWidth
                        />
                        <div className="needByDate">
                          <h4>
                            Shoutout Needed By Date:
                          </h4>
                          {!selectedDay && <p>Choose a date you require the shoutout by {" : "}</p>}
                          {" "}
                          <DayPickerInput onDayChange={this.handleDayChange} />
                          {selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}
                        </div>
                        <div className={`${wrapperDiv} m-a-none`}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() => this.handleToggle(22)}
                                checked={
                                  this.state.checked.indexOf(22) !== -1
                                    ? true
                                    : false
                                }
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
                                classes={{ checked: classes.checked }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Private (Don't share this video on Fanbies)"
                          />
                        </div>
                        <p>
                          Due to the High volume of video request from some of
                          our celebrities on the platform, we do offer a{" "}
                          <strong>14 days period</strong> to get the video ready
                          and sent back to you. After 14 days period we would
                          offer 100% of the money back.
                        </p>
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        {amount > 0 ?
                          (
                            <Button
                              disabled={submitDisabled}
                              onClick={(e)=>this.handelMakeRequest(e,'paid')}
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
                          ) : (
                            <Button
                              disabled={submitDisabled}
                              onClick={(e)=>this.handelMakeRequest(e, 'free')}
                              color="primary"
                              size="lg"
                              round
                              fullWidth
                            >
                              <b>Book free now</b>
                            </Button>
                          )
                        }
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
