import React from "react";
import { Redirect } from "react-router-dom";
//Joi
import Joi from "joi-browser";
import qs from "querystring";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import classNames from "classnames";
// core components
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Danger from "components/Typography/Danger.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import image from "assets/img/bg7.jpg";

class LoginPage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      useremail: "",
      password: "",
      repassword: "",
      submitDisabled: false,
      error: "",
      openBottom: false,
      picture: "1",
      uname: "",
      isLoaded: false,
      username: "",
      usertype: "",
      uid: "",
      active: "",
      fixedClasses: "dropdown show"
    };
    this.fileInput = React.createRef();
  }

  schema = {
    useremail: Joi.string()
      .required()
      .email()
      .label("email value "),
    uname: Joi.string()
      .required()
      .label("Name "),
    password: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9\-_]{6,30}$/)
      .label("Password should be length 6 - 30 with multiple char. "),
    repassword: Joi.string()
      .valid(Joi.ref("password"))
      .label("Confirm Password ")
  };

  handlePicUpdate = () => {
    let data = new FormData();
    data.append("file", this.fileInput.current.files[0]);
    data.set("id", this.state.uid);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data,
      url: configApi.updatepic
    };
    axios(options)
      .then(res => {
        const uRes = res.data;
        this.setState({
          picture: uRes.response
        });
      })
      .catch();
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

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  updateProfileApi = () => {
    const { useremail, password, uname, uid } = this.state;
    axios
      .post(configApi.updateclaimprofile, {
        useremail,
        uname,
        password,
        uid
      })
      .then(res => {
        const updateRes = res.data;
        this.setState({ submitDisabled: false });
        if (!updateRes.success)
          return this.setState({ error: updateRes.message });
        const data = updateRes.response[0];
        const username = data.username;
        localStorage.setItem("useremail", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("fan_id", data.id);
        localStorage.setItem("picid", data.picture);
        localStorage.setItem("type", data.usertype);
        localStorage.setItem("fab_name", data.name);
        localStorage.setItem("token", data.token);

        this.props.history.replace(`/user/${username}`);
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  };

  handleUpdate = e => {
    e.preventDefault();
    const { password, repassword, useremail, uname } = this.state;

    const validatorObj = {
      useremail,
      uname,
      password,
      repassword
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });
    this.setState({ submitDisabled: true });
    this.updateProfileApi();
  };

  validatHash = () => {
    const hash = qs.parse(this.props.location.search)["?rand"];
    //POST Method
    axios
      .post(configApi.validateclaimhash, {
        hash
      })
      .then(res => {
        const responStatus = res.data;
        if (!responStatus.success) {
          this.props.history.replace("/dashboard");
          return;
        }

        const {
          name,
          id,
          username,
          email,
          picture,
          usertype,
          twitter_id,
          shoutrate,
          ig_id,
          fb_id,
          bio,
          available_slot,
          active
        } = responStatus.response[0];
        this.setState({
          uname: name,
          uid: id,
          username: username,
          useremail: email,
          picture: picture,
          usertype,
          isLoaded: true,
          twitter_id,
          shoutrate,
          ig_id,
          fb_id,
          bio,
          available_slot,
          active
        });
      })
      .catch(err => {
        console.warn(err);
      });
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.validatHash();
  }

  render() {
    if (!!qs.parse(this.props.location.search)["?rand"] === false)
      return <Redirect to="/dashboard" />;

    const { classes, ...rest } = this.props;
    const {
      error,
      submitDisabled,
      picture,
      username,
      isLoaded,
      uname
    } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
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
            <div className={classes.container}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <Card className={classes[this.state.cardAnimaton]}>
                    <form className={classes.form} noValidate="noValidate">
                      <CardHeader
                        color="primary"
                        className={classes.cardHeader}
                      >
                        <h4>Claim Your Fanbies Account</h4>
                      </CardHeader>
                      <CardBody>
                        <Danger className="text-center">{error}</Danger>
                        <div>
                          <input
                            accept="image/*"
                            className={`${classes.input} fileInput`}
                            id="profilepic"
                            multiple
                            type="file"
                            onChange={this.handlePicUpdate}
                            ref={this.fileInput}
                          />
                          <label
                            className="clickable-icon"
                            htmlFor="profilepic"
                          >
                            <img
                              src={picture}
                              alt={`${username} profile pic`}
                              className={`${imageClasses} img-align-center profileImg`}
                            />
                          </label>
                        </div>
                        <GridItem xs={12} sm={12} md={12}>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                              <CustomInput
                                labelText="Name..."
                                id="name"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "text",
                                  onChange: this.handleChange,
                                  value: uname,
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
                            </GridItem>
                            {/* <GridItem xs={6} sm={6} md={6}>
                              <CustomInput
                                labelText="Email..."
                                id="emails"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "text",
                                  onChange: this.handleChange,
                                  name: "useremail",
                                  value: useremail,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Icon className={classes.inputIconsColor}>
                                        email_outline
                                      </Icon>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </GridItem> */}
                          </GridContainer>
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
                        </GridItem>
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        <Button
                          color="primary"
                          size="lg"
                          className="text-center d-block"
                          onClick={this.handleUpdate}
                          disabled={submitDisabled}
                        >
                          Claim Account
                        </Button>
                      </CardFooter>
                      <p className="font-size-sm text-center d-block">
                        By clicking Claim Account, you agree to
                        <a href="/terms" target="_blank">
                          {" "}
                          Fanbies{" "}
                        </a>{" "}
                        Terms of Use.
                      </p>
                    </form>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <iframe
                    title="Introducing Fanbies"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/6j8Z0h7XTq4"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </GridItem>
              </GridContainer>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
