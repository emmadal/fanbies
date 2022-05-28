import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
//import qs from "querystring";
import axios from "axios";
import configApi from "../../services/config.json";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Danger from "components/Typography/Danger.jsx";
import Popover from "@material-ui/core/Popover";
import RegisterPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import RegisterSVG from "assets/img/register.svg";

class RegisterPage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      useremail: "",
      username: "",
      password: "",
      repassword: "",
      phone: 0,
      submitDisabled: false,
      error: "",
      uname: "",
      openBottom: false
    };
  }

  schema = {
    useremail: Joi.string()
      .required()
      .email({ minDomainAtoms: 2 })
      .label("Email value "),
    username: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9\-_]{0,20}$/)
      .label(
        "Error - No Spaces; Usernames can only use letters, numbers, underscores and periods."
      ),
    password: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9\-_]{6,30}$/)
      .label("Password "),
    repassword: Joi.string()
      .valid(Joi.ref("password"))
      .label("Confirm Password "),
    uname: Joi.string()
      .required()
      .label("Your name on the platform ")
  };

  handleClosePopover(state) {
    this.setState({
      [state]: false
    });
  }
  handleClickButton(state) {
    this.setState({
      [state]: true
    });
  }

  successResponse = res => {
    this.setState({ error: "" });
    const username = res.data.response.username;
    localStorage.setItem("useremail", res.data.response.email);
    localStorage.setItem("username", username);
    localStorage.setItem("type", res.data.response.usertype);
    localStorage.setItem("picid", res.data.response.picture);
    localStorage.setItem("token", res.data.response.token);
    localStorage.setItem("fab_name", res.data.response.name);
    localStorage.setItem("fan_id", res.data.response.id);

    this.props.history.replace(`/user/${username}`);
  };

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  registerApi = () => {
    const { username, useremail, password, phone, uname } = this.state;
    axios
      .post(configApi.userreg, {
        username,
        useremail,
        password,
        phone,
        uname
      })
      .then(res => {
        const regResponse = res.data;
        this.setState({ submitDisabled: false });
        if (!regResponse.success)
          return this.setState({ error: regResponse.message });

        this.successResponse(res);
      })
      .catch(() => {
        this.setState({ submitDisabled: false });
      });
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    const {
      useremail,
      username,
      password,
      repassword,
      phone,
      uname
    } = this.state;
    const validatorObj = {
      useremail,
      username,
      password,
      repassword,
      uname
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });
    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.registerApi(username, useremail, password, phone, uname);
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  render() {
    if (localStorage.getItem("token") !== null)
      return <Redirect to="/dashboard" />;

    const { classes, ...rest } = this.props;
    const { error, submitDisabled } = this.state;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Fanbies"
          rightLinks={<HeaderLinks />}
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
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={7}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form} noValidate="noValidate">
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4 className="font-bold">Register</h4>
                    </CardHeader>
                    <CardBody>
                      <Danger className="text-center">{error}</Danger>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        className="content-center"
                      >
                        <img
                          src={RegisterSVG}
                          style={{
                            width: "50%",
                            height: "50%",
                            position: "relative",
                            alignItems: "center"
                          }}
                          alt="Fanbies Message your fans"
                        />
                      </GridItem>
                      <CustomInput
                        labelText="Username..."
                        id="username"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          onChange: this.handleChange,
                          name: "username",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                person_pin
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Name..."
                        id="uname"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          onChange: this.handleChange,
                          name: "uname",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                account_circle
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Email..."
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "email",
                          onChange: this.handleChange,
                          name: "useremail",
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
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          name: "password",
                          onChange: this.handleChange,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Confirm Password"
                        id="repassword"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          name: "repassword",
                          onChange: this.handleChange,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                      {/* <CustomInput
                        labelText="Phone Number..."
                        id="phonenumber"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          name: "phone",
                          onChange: this.handleChange,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                phone_outline
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      /> */}
                      <p className="font-size-sm text-center">
                        By clicking on sign up, you agree to
                        <a
                          href="#/"
                          onClick={() => this.handleClickButton("openBottom")}
                        >
                          {" "}
                          terms &amp; conditions
                        </a>
                      </p>
                      <p className="font-size-sm text-center">
                        Please check spam email for registration details from
                        the Fanbies Team
                      </p>
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
                        <h3
                          className={`${
                            classes.popoverHeader
                          } font-bold p-a-md`}
                        >
                          Terms &amp; Conditions
                        </h3>
                        <div
                          className={`${classes.popoverBody} p-a-md p-t-none`}
                        >
                          <h4 className="font-bold">Your Acceptance</h4>
                          By using or visiting the Fanbies website or any
                          Fanbies products, software, data feeds, and services
                          provided to you on, from, or through the Fanbies
                          website (collectively the Service) you signify
                          agreement to (1) these terms and conditions (the Terms
                          of Service), s and also incorporated herein by
                          reference. If you do not agree to any of these terms,
                          the Fanbies Privacy Policy, or the Community
                          Guidelines, please do not use the Service. Although we
                          may attempt to notify you when major changes are made
                          to these Terms of Service, you should periodically
                          review the most up-to-date version. Fanbies may, in
                          its sole discretion, modify or revise these Terms of
                          Service and policies at any time, and you agree to be
                          bound by such modifications or revisions. Nothing in
                          or revisions. Nothing in these Terms of Service shall
                          be deemed to confer any third-party rights or
                          benefits.
                        </div>
                      </Popover>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        color="primary"
                        size="lg"
                        onClick={this.handleLoginSubmit}
                        disabled={submitDisabled}
                      >
                        Register
                      </Button>
                    </CardFooter>
                    <a
                      className="d-block text-center m-b-sm font-bold"
                      href="/login"
                    >
                      Back to Login
                    </a>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(RegisterPageStyle)(RegisterPage);
