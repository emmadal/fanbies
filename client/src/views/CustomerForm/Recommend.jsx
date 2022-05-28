import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Joi from "joi-browser";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import configApi from "../../services/config.json";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Danger from "components/Typography/Danger.jsx";
import Success from "components/Typography/Success.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import "../../App.css";
import bgimage from "assets/img/bg7.jpg";
import recommend from "assets/img/referral.svg";

const Recommend = props => {
  const { classes, ...rest } = props;
  const [cardAnimaton, setCardAnimaton] = useState("cardHidden");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [nameofFamousPerson, setNameofFamousPerson] = useState("");
  const [facebookFamousPerson, setFacebookFamousPerson] = useState("");
  const [messageDescription, setMessageDescription] = useState("");

  const [instaFamousPerson, setInstaFamousPerson] = useState("");
  const [twitterFamousPerson, setTwitterFamousPerson] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [formProcessing, setFormProcessing] = useState(false);

  const schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Please note Email "),
    nameofFamousPerson: Joi.string()
      .required()
      .label("Please provide an name of the celebrity / creator ")
  };

  useEffect(() => {
    setTimeout(function() {
      setCardAnimaton("");
    }, 700);
  }, []);

  const submitForm = () => {
    axios
      .post(configApi.recommendform, {
        email,
        nameofFamousPerson,
        facebookFamousPerson,
        twitterFamousPerson,
        instaFamousPerson,
        messageDescription
      })
      .then(res => {
        const loginRes = res.data;
        if (!loginRes.success) return setError(loginRes.message);
        // send email to admin formProcessing
        setSubmitDisabled(true);
        setFormProcessing(false);
        setEmailSuccess(
          `Many thanks for the message, The team will get intouch with ${nameofFamousPerson} team for the recommendations`
        );
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(err);
      });
  };

  const handleFormSubmit = () => {
    setError("");
    const validatorObj = {
      email,
      nameofFamousPerson
    };
    const result = Joi.validate(validatorObj, schema);

    if (result.error !== null) {
      setError(result.error.details[0].message);
    } else {
      setFormProcessing(true);
      submitForm();
    }
  };

  // const brandComponent = () => {
  //   return ;
  // };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Recommend a Famous Face or Creator / Influencer to join Fanbies
        </title>
        <meta
          name="description"
          content="We would love if you can recommend us your favourite person to join the Fanbies community of Influencers
          and Famous faces"
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
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + bgimage + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={`${classes.container}`}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form} noValidate="noValidate">
                  <CardHeader>
                    <h2 className="font-size-xxl font-bold">
                      We would love it if you recommend us an Influencer /
                      Creator to Join the Fanbies community with the form below
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      className="content-center"
                    >
                      <img
                        src={recommend}
                        style={{
                          width: "45%",
                          height: "45%",
                          position: "relative",
                          alignItems: "center"
                        }}
                        alt="Fanbies Message your fans"
                      />
                    </GridItem>
                    <Danger className="text-center">{error}</Danger>
                    <Success className="text-center bold">
                      {emailSuccess}
                    </Success>
                    <CustomInput
                      labelText="Your Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        name: "email",
                        onChange: e => setEmail(e.currentTarget.value),
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
                      labelText="Creator / Influencer Name ..."
                      id="nameofFamousPerson"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: e =>
                          setNameofFamousPerson(e.currentTarget.value),
                        name: "nameofFamousPerson",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              contact_mail_outline
                            </Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Influencer Facebook Tag..."
                      id="facebookFamousPerson"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: e =>
                          setFacebookFamousPerson(e.currentTarget.value),
                        name: "facebookFamousPerson",
                        endAdornment: (
                          <InputAdornment position="end">
                            <i className={"fab fa-facebook-f"} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Influencer Instagram Tag..."
                      id="instaFamousPerson"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: e =>
                          setInstaFamousPerson(e.currentTarget.value),
                        name: "instaFamousPerson",
                        endAdornment: (
                          <InputAdornment position="end">
                            <i className={"fab fa-instagram"} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Influencer Twitter #..."
                      id="twitterFamousPerson"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: e =>
                          setTwitterFamousPerson(e.currentTarget.value),
                        name: "twitterFamousPerson",
                        endAdornment: (
                          <InputAdornment position="end">
                            <i className={"fab fa-twitter"} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField
                      id="standard-multiline-flexible"
                      label="More Message or info..."
                      multiline
                      rowsMax="8"
                      name="messageDescription"
                      className={classes.textField}
                      margin="normal"
                      onChange={e =>
                        setMessageDescription(e.currentTarget.value)
                      }
                      fullWidth
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      disabled={submitDisabled}
                      onClick={() => handleFormSubmit()}
                      color="primary"
                      size="lg"
                      round
                      fullWidth
                    >
                      Submit
                    </Button>
                  </CardFooter>
                </form>
                {formProcessing !== false ? (
                  <div className="overlay">
                    <div className="lds-ripple pos-ab top-50">
                      <div />
                      <div />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default withStyles(loginPageStyle)(Recommend);
