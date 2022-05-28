import React from "react";
import { Redirect } from "react-router-dom";
import qs from "querystring";
//Joi
import Joi from "joi-browser";
import axios from "axios";
import configApi from "../../services/config.json";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Popover from "@material-ui/core/Popover";
import Danger from "components/Typography/Danger.jsx";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import LoginSVG from "assets/img/login.svg";

class LoginPage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      useremail: "",
      password: "",
      submitDisabled: false,
      error: "",
      openBottom: false,
      isLoading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  schema = {
    useremail: Joi.string()
      .required()
      .email()
      .label("email value "),
    password: Joi.string()
      .required()
      .label("Password ")
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
    const resp = res.response[0];
    localStorage.setItem("useremail", resp.email);
    localStorage.setItem("username", resp.username);
    localStorage.setItem("fan_id", resp.id);
    localStorage.setItem("picid", resp.picture);
    localStorage.setItem("type", resp.usertype);
    localStorage.setItem("fab_name", resp.name);
    localStorage.setItem("token", resp.token);
  };

  handleChange = ({ currentTarget: input }) => {
    //console.log(input.value);
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  loginApi = () => {
    const { useremail, password } = this.state;
    axios
      .post(configApi.login, {
        useremail,
        password
      })
      .then(res => {
        //Enable button
        //console.log(res);
        const loginRes = res.data;
        //this.setState({ submitDisabled: true });
        if (!loginRes.success)
          return this.setState({
            error: loginRes.message,
            submitDisabled: false
          });

        //success response callback
        this.successResponse(loginRes);
        const username = loginRes.response[0].username;
        this.props.history.replace(`/user/${username}`);
      })
      .catch(() => {
        this.setState({ submitDisabled: false });
      });
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    const validatorObj = {
      useremail: this.state.useremail,
      password: this.state.password
    };
    const result = Joi.validate(validatorObj, this.schema);
    const { password, useremail } = this.state;
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.loginApi(useremail, password);
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    const access_token = qs.parse(this.props.location.hash)["#access_token"];
    if (access_token !== undefined) {
      this.getIGDetails(access_token);
    }
  }

  getIGDetails = data => {
    this.setState({ isLoading: true });
    axios
      .get(`https://api.instagram.com/v1/users/self/?access_token=${data}`)
      .then(res => {
        //console.log("IG: ", res);
        this.socialLogin(res.data);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log("IG: ", e);
        this.setState({ isLoading: false });
      });
  };

  socialLogin = data => {
    const { id, full_name, username, bio, counts } = data.data;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const follower = counts.followed_by;
    axios
      .post(
        configApi.useriglogin,
        {
          authid: id,
          username,
          name: full_name,
          authtype: "ig",
          bio,
          follower
        },
        {
          cancelToken: source.token
        }
      )
      .then(res => {
        const loginRes = res.data;
        this.setState({ isLoading: false });
        if (!loginRes.success)
          return this.setState({ error: loginRes.message });

        //success response callback
        const username = loginRes.response[0].username;
        source.cancel();
        if (
          loginRes.response[0].auth_status === "login" &&
          loginRes.response[0].email !== ""
        ) {
          this.successResponse(loginRes);
          this.props.history.replace(`/user/${username}`);
        } else {
          this.successResponse(loginRes);
          this.props.history.replace(`/usersetting/${username}`);
        }
      })
      .catch(e => {
        console.log("ig APi error", e);
        this.setState({ isLoading: false });
      });
  };

  // handleInstagram = () => {
  //   const id = envData.instaID;
  //   window.location.replace(
  //     `https://api.instagram.com/oauth/authorize/?client_id=${id}&redirect_uri=https://www.fanbies.com/login&response_type=token`
  //   );
  // };

  render() {
    if (localStorage.getItem("token") !== null)
      return <Redirect to="/dashboard" />;

    const { classes, ...rest } = this.props;
    const { error, submitDisabled, isLoading } = this.state;
    return (
      <div>
        <Header absolute color="transparent" brand="Fanbies" {...rest} />
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
                <GridItem xs={12} sm={12} md={7}>
                  <Card className={classes[this.state.cardAnimaton]}>
                    <form className={classes.form} noValidate="noValidate">
                      <CardHeader
                        color="primary"
                        className={classes.cardHeader}
                      >
                        <h4 className="font-bold">Login</h4>
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
                            src={LoginSVG}
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
                          labelText="Email..."
                          id="first"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
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
                            agreement to (1) these terms and conditions (the
                            Terms of Service), s and also incorporated herein by
                            reference. If you do not agree to any of these
                            terms,the Fanbies Privacy Policy, or the Community
                            Guidelines, please do not use the Service. Although
                            we may attempt to notify you when major changes are
                            made to these Terms of Service, you should
                            periodically review the most up-to-date version.
                            Fanbies may, in its sole discretion, modify or
                            revise these Terms of Service and policies at
                            anytime,and you agree to be bound by such
                            modifications or revisions. Nothing in or revisions.
                            Nothing in these Terms of Service shall be deemed to
                            confer any third-party rights or benefits.
                            <a href="/terms">Continue Reading</a>
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
                          Log in
                        </Button>
                        <br />
                      </CardFooter>
                      <a
                        className="d-block text-center m-b-sm font-bold"
                        href="/register"
                      >
                        Register
                      </a>
                      <a
                        className="d-block text-center m-b-sm font-bold"
                        href="/forgotten"
                      >
                        Forgotten Password
                      </a>
                    </form>
                  </Card>
                </GridItem>
              )}
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
