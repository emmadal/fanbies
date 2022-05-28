import React from "react";
import { Redirect } from "react-router-dom";
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
import ForgottenPassSVG from "assets/img/forgotten.svg";
//forgotten

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ForgottenPage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      useremail: "",
      submitDisabled: false,
      error: "",
      confirmationMessage: "",
      modal: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handelForgotten = this.handelForgotten.bind(this);
    this.forgottentApi = this.forgottentApi.bind(this);
    this.successResponse = this.successResponse.bind(this);
  }

  schema = {
    useremail: Joi.string()
      .required()
      .email()
      .label("email value ")
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

  successResponse(res) {
    this.setState({ confirmationMessage: res, modal: true });
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  forgottentApi() {
    const { useremail } = this.state;

    //POST Method
    axios
      .post(configApi.forgotten, {
        useremail
      })
      .then(res => {
        //Enable button
        //console.log(res);
        const responStatus = res.data;
        this.setState({ submitDisabled: false });
        if (!responStatus.success)
          return this.setState({ error: responStatus.message });

        //success response callback
        this.successResponse(responStatus.message);
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  }

  handelForgotten = e => {
    e.preventDefault();
    const validatorObj = {
      useremail: this.state.useremail
    };
    const result = Joi.validate(validatorObj, this.schema);
    //console.log(result);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.forgottentApi();
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
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
    const { error, submitDisabled, confirmationMessage } = this.state;
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
              <GridItem xs={12} sm={12} md={6}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form} noValidate="noValidate">
                    <CardHeader color="danger" className={classes.cardHeader}>
                      <h4>Forgotten Password</h4>
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
                          src={ForgottenPassSVG}
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
                        labelText="Provide Email to reset password."
                        id="email"
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
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        color="primary"
                        size="lg"
                        onClick={this.handelForgotten}
                        disabled={submitDisabled}
                      >
                        Submit
                      </Button>
                      <br />
                    </CardFooter>
                  </form>
                </Card>
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
              </GridItem>
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(ForgottenPage);
