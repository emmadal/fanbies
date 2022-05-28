import React from "react";
import { Redirect } from "react-router-dom";
import PaypalExpressBtn from "react-paypal-express-checkout";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//axios
//import axios from "axios";
//service config
//import configApi from "../../services/config.json";
import envData from "../../services/env.json";
// @material-ui/icons
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
//import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

//import Icon from "@material-ui/core/Icon";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
//import Radio from "@material-ui/core/Radio";
//import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import styleName from "assets/jss/material-kit-react/customCheckboxRadioSwitch.jsx";
import "../../App.css";

class ConfirmRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      checked: [],
      messagetitle: "",
      messageDescription: "",
      submitDisabled: false,
      selectedPayMethod: "pp",
      disablePrivateFields: false
    };
    this.handleChange = this.handleChange.bind(this);
    //this.payRegister = this.payRegister.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleChangeEnabled(event) {
    this.setState({ selectedPayMethod: event.target.value });
  }

  // handelRequest = e => {
  //   e.preventDefault();
  //   //Remove after testing;
  //   //this.setState({ submitDisabled: true });
  //   this.payRegister();
  // };

  // payRegister() {
  //   //const { selectedPayMethod } = this.state;
  //   const {
  //     privacy,
  //     celebId,
  //     messagetitle,
  //     messageDescription,
  //     amount,
  //     celebName,
  //     uemail,
  //     email
  //   } = this.props.location.data;
  //   //POST Method
  //   axios
  //     .post(configApi.payRegister, {
  //       email,
  //       celebId,
  //       celebName,
  //       privacy,
  //       messagetitle,
  //       messageDescription,
  //       requestCost: amount,
  //       celebUemail: uemail
  //     })
  //     .then(res => {
  //       const processPayment = res.data;
  //       if (!processPayment.success)
  //         return this.setState({ error: processPayment.message });
  //       // Redirect user to paypal payment page.
  //       //window.location.replace(processPayment.url);
  //     })
  //     .catch(err => {
  //       console.warn(err);
  //       //this.setState({ submitDisabled: false });
  //     });
  // }

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  componentDidMount() {
    // if (this.props.location.hasOwnProperty("data"))
    //   this.setState({ useremail: this.props.location.data.email });
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  render() {
    if (!this.props.location.hasOwnProperty("data")) return <Redirect to="/" />;
    const {
      amount,
      email,
      privacy,
      messagetitle,
      messageDescription,
      celebName,
      celebUname,
      calldate,
      callduration,
      bookingType
    } = this.props.location.data;

    const { classes, ...rest } = this.props;
    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal
    );
    const onSuccess = payment => {
      this.props.history.push({
        pathname: `/requested`,
        data: {
          payToken: payment.paymentToken,
          payerID: payment.payerID,
          paymentID: payment.paymentID,
          payerEmail: payment.email,
          payerPaid: payment.paid,
          amountPaid: amount,
          useremail: email,
          videoPrivacy: privacy,
          celebName,
          celebUname,
          messagetitle,
          messageDescription,
          calldate,
          callduration,
          bookingType,
        }
      });
    };
    const onError = () => {
      this.props.history.push({
        pathname: `/paymentcancelled`,
        data: {
          useremail: email
        }
      });
    };
    const total = parseInt(amount, 10);
    const env = envData.modeisprod; //modeistest;modeisprod; //change for live
    const btnStyle = {
      label: "pay",
      tagline: false,
      fundingicons: true,
      size: "responsive",
      color: "white"
    };

    const client = {
      sandbox: envData.paypalsandbox,
      production: envData.paypalprod
    };

    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies Confirm Request"
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
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={`
                  ${classes.navWrapper} undraw-bg undraw-bg-paytransfer`}
                >
                  <Card plain>
                    <h2 className="m-b-lg">Request Confirmation</h2>
                    <form className={classes.form} noValidate="noValidate">
                      <CardBody>
                        {!localStorage.getItem("useremail") === true ? (
                          <h4 className={`content-left ${classes.cardTitle}`}>
                            Please note, we will store your provided email
                            &nbsp;
                            <strong>{email}</strong>: on our system to ensure
                            ensure you get your request on time.
                          </h4>
                        ) : (
                          ""
                        )}
                        <div className={`content-left m-a-md ${wrapperDiv}`}>
                          <h4 className="text-center font-bold">
                            Please Complete payment using the paypal button
                            below; may take few seconds to load:
                          </h4>
                          <PaypalExpressBtn
                            client={client}
                            currency={"USD"}
                            env={env}
                            onSuccess={onSuccess}
                            onError={onError}
                            total={total}
                            style={btnStyle}
                          />
                          {/* <FormControlLabel
                            control={
                              <Radio
                                checked={this.state.selectedPayMethod === "pp"}
                                onChange={this.handleChangeEnabled}
                                value="pp"
                                name="radio button enabled"
                                aria-label="PayPal"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio
                                }}
                              />
                            }
                            classes={{
                              label: classes.label
                            }}
                            label="PayPal"
                          /> */}
                        </div>
                        {/* <div className={`content-left ${wrapperDiv}`}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={this.state.selectedPayMethod === "cc"}
                                onChange={this.handleChangeEnabled}
                                value="cc"
                                name="radio button enabled"
                                aria-label="Credit Card"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio
                                }}
                              />
                            }
                            classes={{
                              label: classes.label
                            }}
                            label="Credit Card"
                          />
                        </div> */}
                        {/* <div className={`content-left ${wrapperDiv}`}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={this.state.selectedPayMethod === "ps"}
                                onChange={this.handleChangeEnabled}
                                value="ps"
                                name="radio button enabled"
                                aria-label="PayStack"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio
                                }}
                              />
                            }
                            classes={{
                              label: classes.label
                            }}
                            label="PayStack (Nigeria)"
                          />
                        </div> */}
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        {/* <Button
                          disabled={submitDisabled}
                          onClick={this.handelRequest}
                          color="primary"
                          size="lg"
                          round
                        >
                          <Icon className={classes.inputIconsColor}>
                            payment_outline
                          </Icon>
                          Proceed
                        </Button> */}
                      </CardFooter>
                    </form>
                  </Card>
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

export default withStyles(profilePageStyle, styleName)(ConfirmRequest);
