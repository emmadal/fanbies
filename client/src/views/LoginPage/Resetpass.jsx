import React from "react";
import { Redirect } from "react-router-dom";
import qs from "querystring";
//Joi
import Joi from "joi-browser";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
//import Email from "@material-ui/icons/Email";
//import People from "@material-ui/icons/People";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
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

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class LoginPage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      password: "",
      repassword: "",
      submitDisabled: false,
      error: "",
      queryValue: "",
      confirmationMessage: "",
      modal: false,
      isLoaded: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handelForgotten = this.handelForgotten.bind(this);
    this.resetApi = this.resetApi.bind(this);
  }

  schema = {
    password: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9\-_]{6,30}$/)
      .label("Password "),
    repassword: Joi.string()
      .valid(Joi.ref("password"))
      .label("Confirm Password ")
  };

  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
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

  resetApi() {
    const { password } = this.state;
    const hash = qs.parse(this.props.location.search)["?rand"];
    axios
      .post(configApi.updatepass, {
        password,
        hash
      })
      .then(res => {
        const responStatus = res.data;
        if (!responStatus.success)
          return this.setState({ error: responStatus.message });
        //Modal confirming the Password was updated
        this.setState({
          modal: true,
          confirmationMessage: responStatus.message
        });
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  }

  handelForgotten = e => {
    e.preventDefault();
    const validatorObj = {
      password: this.state.password,
      repassword: this.state.repassword
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.resetApi();
  };

  validatHash() {
    const hash = qs.parse(this.props.location.search)["?rand"];
    //POST Method
    axios
      .post(configApi.validateHash, {
        hash
      })
      .then(res => {
        const responStatus = res.data;
        this.setState({ submitDisabled: false });
        if (!responStatus.success)
          return this.setState({
            modal: true,
            confirmationMessage: responStatus.message
          });

        //success response callback
        this.setState({
          isLoaded: true
        });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.validatHash();
  }
  render() {
    if (
      localStorage.getItem("token") !== null ||
      !!qs.parse(this.props.location.search)["?rand"] === false
    )
      return <Redirect to="/dashboard" />;

    const { classes, ...rest } = this.props;
    const { error, submitDisabled, confirmationMessage, isLoaded } = this.state;
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
            {isLoaded ? (
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes[this.state.cardAnimaton]}>
                    <form className={classes.form} noValidate="noValidate">
                      <CardHeader color="danger" className={classes.cardHeader}>
                        <h4>Reset Password</h4>
                      </CardHeader>
                      <CardBody>
                        <Danger className="text-center">{error}</Danger>
                        <CustomInput
                          labelText="New Password..."
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
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={this.handelForgotten}
                          disabled={submitDisabled}
                        >
                          Reset Password
                        </Button>
                        <br />
                      </CardFooter>
                    </form>
                  </Card>
                </GridItem>
              </GridContainer>
            ) : (
              <div className="min-height-sm text-center">
                <div className="overlay transparent">
                  <div className="lds-ripple pos-ab top-0">
                    <div />
                    <div />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal
            }}
            open={this.state.modal}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="modal-slide-title"
            aria-describedby="modal-slide-description"
          >
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              {confirmationMessage}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.props.history.replace("/dashboard")}
                color="primary"
              >
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
