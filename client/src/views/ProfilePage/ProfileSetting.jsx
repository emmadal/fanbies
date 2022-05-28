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
import classNames from "classnames";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Danger from "components/Typography/Danger.jsx";
import Slide from "@material-ui/core/Slide";

import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";

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
      twitter_id: "",
      shoutrate: "",
      callrate: "",
      ig_id: "",
      fb_id: "",
      bio: "",
      available_slot: "",
      active: "",
      uploadError: "",
      profession: "",
      recordedStream: "",
      dropUploaded: false,
      dropIsloading: false,
      disableUploadBtn: false,
      avaiableStatusArry: ["UnAvailable", "Coming Soon", "Available"],
      dataRate: [0,5,10,15,20,25,30,35,40,45,50],
      fixedClasses: "dropdown show",
      dropArr: [],
      modal: false,
      modaltype: "",
      paypal: "",
      totalearnings: 0,
      walletmessage: ""
    };
    this.imgInput = React.createRef();
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
    available_slot: Joi.number()
      .integer()
      .min(0)
      .max(99)
      .required()
      .label("Available Slot: "),
    shoutrate: Joi.number()
      .integer()
      .min(0)
      .max(2999)
      .required()
      .label("shout out rate: "),
    callrate: Joi.number()
      .integer()
      .min(0)
      .max(199)
      .required()
      .label("Vide call rate: "),
    password: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9\-_]{6,30}$/)
      .label("Password should be length 6 - 30 with multiple char. "),
    repassword: Joi.string()
      .valid(Joi.ref("password"))
      .label("Confirm Password ")
  };

  handlePicUpdate = () => {
    //imageChangerForm
    let data = new FormData();
    data.append("file", this.imgInput.current.files[0]);
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

  getUserDetails = () => {
    return axios.post(configApi.getusersetting, {
      username: this.props.match.params.username,
      jtoken: localStorage.getItem("token")
    });
  };

  getUserDrop = () => {
    return axios.post(configApi.getuserdrop, {
      username: this.props.match.params.username
    });
  };

  getBankDetails = () => {
    return axios.post(configApi.getbankdetails, {
      uid: localStorage.getItem("fan_id")
    });
  };

  getTotalEarning = () => {
    return axios.post(configApi.getmyearnings, {
      jtoken: localStorage.getItem("token")
    });
  };

  getDetails = () => {
    axios
      .all([
        this.getUserDetails(),
        this.getUserDrop(),
        this.getBankDetails(),
        this.getTotalEarning()
      ])
      .then(res => {
        const uRes = res[0].data;
        const uDropRes = res[1].data;
        const bankdetailsRes = res[2].data;
        const totalearningRes = res[3].data.response[0]["SUM(charge)"];
        if (!uRes.success) {
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
          active,
          profession,
          callrate
        } = uRes.response[0];
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
          callrate,
          ig_id,
          fb_id,
          bio,
          available_slot,
          active,
          profession,
          dropArr: uDropRes.response,
          paypal: bankdetailsRes.response.length ? bankdetailsRes.response[0].extra_info : "",
          totalearnings: totalearningRes != null ? totalearningRes : 0
        });
      })
      .catch();
  };

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  // Update Paypal email
  updatePaypalEmailApi = () => {
    //close modal
    this.handleClose();
    const { uid, paypal } = this.state;
    //this.setState({ bankBtnDisabled: true, loading: false});
    axios
      .post(configApi.updateuserbankdetail, {
        otherplatforms: paypal,
        bankname: "",
        accnumber: "",
        sortcode: "",
        accname: "",
        uid
      })
      .then(() => {
        // const bankdetailsRes = res.data;
        // if(bankdetailsRes.success)
        //  return this.setState({
        //         bankBtnDisabled: false,
        //         loading: false,
        //         modalVisible: false,
        //         servermessg: bankdetailsRes.message
        //         });
      })
      .catch(() => {
        //this.setState({ submitDisabled: false });
      });
  };

  updateProfileApi = () => {
    const {
      useremail,
      password,
      uname,
      username,
      uid,
      twitter_id,
      shoutrate,
      ig_id,
      fb_id,
      bio,
      available_slot,
      active,
      profession,
      callrate
    } = this.state;
    //POST Method
    axios
      .post(configApi.updateprofile, {
        useremail,
        uname,
        password,
        uid,
        bio,
        twittertag: twitter_id,
        fbtag: fb_id,
        igtag: ig_id,
        requestRate: shoutrate,
        callrate,
        userstatus: active,
        availableSlot: available_slot,
        profession,
        jtoken: localStorage.getItem("token")
      })
      .then(res => {
        const updateRes = res.data;
        this.setState({ submitDisabled: false });
        if (!updateRes.success)
          return this.setState({ error: updateRes.message });
        // update localstorage
        localStorage.setItem("useremail", useremail);
        this.props.history.replace(`/user/${username}`);
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  };

  handleUpdate = e => {
    e.preventDefault();
    const {
      password,
      repassword,
      useremail,
      uname,
      shoutrate,
      available_slot,
      callrate
    } = this.state;

    const validatorObj = {
      useremail,
      uname,
      password,
      repassword,
      shoutrate,
      callrate,
      available_slot
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });
    this.setState({ submitDisabled: true });
    this.updateProfileApi();
  };

  paypalSchema = {
    paypal: Joi.string()
      .required()
      .email()
      .label("paypal email value ")
  };

  submitEmail = e => {
    e.preventDefault();
    const { paypal } = this.state;
    const validatorObj = { paypal };
    const result = Joi.validate(validatorObj, this.paypalSchema);
    this.setState({ walletmessage: "" });

    if (result.error !== null)
      return this.setState({ walletmessage: result.error.details[0].message });
    //this.setState({ submitDisabled: true });
    this.updatePaypalEmailApi();
  };

  // user request payment of earnings
  handlePaymentRequest = () => {
    const { useremail } = this.state;
    axios
      .post(configApi.requestforearning, {
        useremail,
        username: this.props.match.params.username,
        jtoken: localStorage.getItem("token")
      })
      .then(res => {
        const respayment = res.data;
        if (respayment.success)
          return this.setState({
            walletmessage:
              "Your request for payment is received, we will get back as soon as possible. Thank you"
          });
      });
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.getDetails();
  }

  handelSelectedStatus = val => {
    let valueSet;
    if (val.target.textContent === "UnAvailable") {
      valueSet = 1;
    } else if (val.target.textContent === "Coming Soon") {
      valueSet = 2;
    } else {
      valueSet = 3;
    }

    this.setState({ active: valueSet });
  };

  handleCallRate = val => {
    this.setState({ callrate: val.target.textContent });
  }

  handelShoutoutRate = val => {
    //shoutrate
    this.setState({ shoutrate: val.target.textContent})
  }

  handleManualUpdate = () => {
    let _this = this;
    this.setState({ uploadError: "" });
    let previewVideo = document.querySelector("video#preview");
    previewVideo.preload = "metadata";

    previewVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(previewVideo.src);
      if (previewVideo.duration > 60) {
        previewVideo.srcObject = null;
        previewVideo.src = null;
        return _this.setState({
          uploadError:
            "Invalid Video! Video duration should less than 60 second / 1 mintue",
          dropUploaded: false
        });
      }
    };

    //document.querySelector("video#recorder").srcObject = null;
    previewVideo.srcObject = null;
    previewVideo.src = null;
    previewVideo.src = window.URL.createObjectURL(
      this.fileInput.current.files[0]
    );
    this.setState({
      recordedStream: this.fileInput.current.files[0],
      dropUploaded: true
    });
    previewVideo.controls = true;
    previewVideo.play();
  };

  handleUploadDrop = () => {
    let data = new FormData();
    const { uid, recordedStream, username } = this.state;
    data.append("file", recordedStream);
    data.set("video_owner_id", uid);
    data.set("ownername", username);

    // let previewVideo = document.querySelector("video#preview");
    // previewVideo.srcObject = null;
    // previewVideo.src = null;
    this.setState({
      disableUploadBtn: true,
      dropUploaded: false,
      dropIsloading: true
    });
    setTimeout(() => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data,
        url: configApi.dropvideobyuserid
      };
      axios(options).then(res => {
        const resp = res.data;
        if (!resp.success)
          return this.setState({
            uploadError: resp.message
          });

        this.setState({
          uploadError: resp.message,
          dropIsloading: false
        });
      });
    }, 1000);
  };

  handleModal = modaltype => {
    this.setState({ modal: true, modaltype });
  };

  handleClose = () => {
    this.setState({ modal: false, modaltype: "" });
  };

  render() {
    if (localStorage.getItem("token") === null)
      return <Redirect to="/dashboard" />;
    const { classes, ...rest } = this.props;
    const {
      error,
      useremail,
      submitDisabled,
      picture,
      username,
      isLoaded,
      uname,
      usertype,
      twitter_id,
      shoutrate,
      ig_id,
      fb_id,
      bio,
      available_slot,
      active,
      avaiableStatusArry,
      dataRate,
      profession,
      dropUploaded,
      uploadError,
      disableUploadBtn,
      dropIsloading,
      dropArr,
      callrate,
      modaltype,
      paypal,
      totalearnings,
      walletmessage
    } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const userstatus = parseInt(active, 10);
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies"
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
                        <h4>Profile Update</h4>
                      </CardHeader>
                      <CardBody>
                        {usertype >= 1 ? (
                          <>
                            <Button
                              simple
                              size="lg"
                              color="rose"
                              className="m-b-md b-1-a floatRight"
                              onClick={() => this.handleModal("walllet")}
                            >
                              My Wallet
                            </Button>
                            <Button
                              simple
                              size="lg"
                              color="info"
                              className="m-b-md b-1-a"
                              onClick={() => this.handleModal("tip")}
                            >
                              Tips to complete your profile
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                        <p
                          className="default-color clickable-icon font-bold"
                          onClick={() =>
                            window.location.replace(`/user/${username}`)
                          }
                        >
                          &#60; Back
                        </p>
                        <Danger className="text-center">{error}</Danger>
                        <div className="pos-rel clear-both">
                          <input
                            accept="image/*"
                            className={`${classes.input} fileInput`}
                            id="profilepic"
                            multiple
                            type="file"
                            onChange={this.handlePicUpdate}
                            ref={this.imgInput}
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
                            <i className="material-icons setting-edit-icon">
                              edit
                            </i>
                          </label>
                        </div>
                        <GridItem xs={12} sm={12} md={12}>
                          <CustomInput
                            id="username"
                            formControlProps={{
                              fullWidth: true
                            }}
                            labelProps={{
                              className: "font-bold"
                            }}
                            inputProps={{
                              type: "text",
                              name: "text",
                              value: `Your Username: ${username}`,
                              disabled: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    person_pin
                                  </Icon>
                                </InputAdornment>
                              )
                            }}
                          />
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                              <CustomInput
                                labelText="Name..."
                                id="name"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                labelProps={{
                                  className: "font-bold"
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
                            <GridItem xs={12} sm={12} md={6}>
                              <CustomInput
                                labelText="Email..."
                                id="first"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                labelProps={{
                                  className: "font-bold"
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
                            </GridItem>
                            {usertype >= 1 ? (
                              <React.Fragment>
                                <GridItem xs={12} sm={12} md={12}>
                                  <CustomInput
                                    labelText="Amount of availablity slots on fanbies"
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    id="slots"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      type: "number",
                                      onChange: this.handleChange,
                                      name: "available_slot",
                                      value: available_slot,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Icon
                                            className={classes.inputIconsColor}
                                          >
                                            update
                                          </Icon>
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                  <CustomInput
                                    labelText="Name of charity you support"
                                    id="profession"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      type: "text",
                                      onChange: this.handleChange,
                                      name: "profession",
                                      value: profession,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Icon
                                            className={classes.inputIconsColor}
                                          >
                                            card_giftcard
                                          </Icon>
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                  {/* <CustomInput
                                    labelText="Video shoutout message - Flat fee ($)"
                                    id="shoutrate"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      type: "number",
                                      onChange: this.handleChange,
                                      name: "shoutrate",
                                      value: shoutrate,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Icon
                                            className={classes.inputIconsColor}
                                          >
                                            local_atm
                                          </Icon>
                                        </InputAdornment>
                                      )
                                    }}
                                  /> */}
                                  <div className="d-inline-block m-v-md">
                                    <CustomDropdown
                                      buttonText="Video shoutout fee ($)"
                                      buttonProps={{
                                        color: "primary",
                                        round: true
                                      }}
                                      dropdownList={dataRate}
                                      onClick={this.handelShoutoutRate}
                                    />
                                  </div>
                                  <span className="m-h-md m-b-lg d-inline-block font-bold">
                                      {` ${shoutrate} `}
                                  </span>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    {/* <CustomInput
                                      labelText="Video call charge rate per minutes($)"
                                      id="callrate"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      labelProps={{
                                        className: "font-bold"
                                      }}
                                      inputProps={{
                                        type: "number",
                                        onChange: this.handleChange,
                                        name: "callrate",
                                        value: callrate,
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <Icon
                                              className={classes.inputIconsColor}
                                            >
                                              local_atm
                                            </Icon>
                                          </InputAdornment>
                                        )
                                      }}
                                    /> */}
                                    <div className="d-inline-block m-v-md">
                                      <CustomDropdown
                                        buttonText="Video call fee per mins ($)"
                                        buttonProps={{
                                          color: "primary",
                                          round: true
                                        }}
                                        dropdownList={dataRate}
                                        onClick={this.handleCallRate}
                                      />
                                    </div>
                                    
                                    <span 
                                      className="m-h-md m-b-lg d-inline-block font-bold">
                                        {` ${callrate} `}
                                    </span>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  className=" m-b-lg"
                                >
                                  <div className="d-inline-block m-v-md">
                                    <CustomDropdown
                                      buttonText="Your Status online :"
                                      buttonProps={{
                                        color: "primary",
                                        round: true
                                      }}
                                      dropdownList={avaiableStatusArry}
                                      onClick={this.handelSelectedStatus}
                                    />
                                  </div>
                                  <span className="m-h-md m-b-lg d-inline-block font-bold">
                                    {userstatus === 1 ? "Unavailable" : ""}
                                    {userstatus === 2 ? "Coming Soon" : ""}
                                    {userstatus === 3 ? "Available" : ""}
                                  </span>
                                </GridItem>
                                <GridItem xs={12} sm={4} md={4}>
                                  <CustomInput
                                    labelText="Facebook Handle"
                                    id="fb_id"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      type: "text",
                                      onChange: this.handleChange,
                                      name: "fb_id",
                                      value: fb_id,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <FacebookIcon />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={4} md={4}>
                                  <CustomInput
                                    labelText="IG Handle"
                                    id="ig_id"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      type: "text",
                                      onChange: this.handleChange,
                                      name: "ig_id",
                                      value: ig_id,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <InstagramIcon />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={4} md={4}>
                                  <CustomInput
                                    labelText="Twitter Handle"
                                    id="twitter_id"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      type: "text",
                                      onChange: this.handleChange,
                                      name: "twitter_id",
                                      value: twitter_id,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <TwitterIcon />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                  <CustomInput
                                    labelText="Biography"
                                    id="biography"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    labelProps={{
                                      className: "font-bold"
                                    }}
                                    inputProps={{
                                      multiline: true,
                                      row: 5,
                                      onChange: this.handleChange,
                                      name: "bio",
                                      value: bio,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Icon
                                            className={classes.inputIconsColor}
                                          >
                                            fingerprint
                                          </Icon>
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </GridItem>
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                          </GridContainer>
                          <CustomInput
                            labelText="Password"
                            id="password"
                            formControlProps={{
                              fullWidth: true
                            }}
                            labelProps={{
                              className: "font-bold"
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
                            labelProps={{
                              className: "font-bold"
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
                          onClick={this.handleUpdate}
                          disabled={submitDisabled}
                        >
                          Update
                        </Button>
                        <br />
                      </CardFooter>
                      <a
                        href="#/"
                        className="d-block text-center m-b-sm"
                        onClick={() =>
                          this.props.history.replace(`/user/${username}`)
                        }
                      >
                        Cancel
                      </a>
                    </form>
                  </Card>
                </GridItem>
                {usertype >= 1 ? (
                  <GridItem xs={12} sm={12} md={6}>
                    <Card className={classes[this.state.cardAnimaton]}>
                      <CardBody>
                        <Danger>{uploadError}</Danger>
                        {dropIsloading === true ? (
                          <div className="min-height-sm text-center">
                            <div className="overlay transparent">
                              <div className="lds-ripple pos-ab top-0">
                                <div />
                                <div />
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <input
                          accept="video/mp4"
                          className={`${classes.input} fileInput`}
                          id="videofile"
                          multiple
                          type="file"
                          onChange={this.handleManualUpdate}
                          ref={this.fileInput}
                        />
                        <label
                          htmlFor="videofile"
                          className="d-block text-center clickable-icon"
                        >
                          <AddPhotoAlternate
                            style={{
                              color: "#000",
                              fontSize: "8em",
                              display: "block",
                              margin: "0 auto"
                            }}
                          />
                        </label>
                        <h2 className="font-size-lg">
                          {`Click the image above to upload your video drop ( An introduction video informing fans you're on Fanbies)`}
                        </h2>
                        <p className="font-size-md">
                          We also suggest sharing the uploaded video on your
                          social media, helps you get more bookings.
                        </p>
                        <p className="default-color">
                          Your video must be between 15 seconds and 1 min long,
                          MP4 file and less than 1GB
                        </p>
                        {dropArr.length <= 0 ? (
                          <>
                            <h3 className="font-size-md font-bold">
                              You do not have any introduction video. An
                              introduction video is great for better sales and
                              to inform fans about reasons / charity support on
                              the Fanbies platform. You can add one by clicking
                              on the plus Icon to upload one{" "}
                            </h3>
                            <video
                              id="preview"
                              height="200"
                              width="100%"
                              playsInline
                            />
                          </>
                        ) : (
                          <>
                            <h3 className="font-size-md font-bold">
                              Below is your current Intro video to fans
                            </h3>
                            <video
                              id="preview"
                              height="200"
                              width="100%"
                              playsInline
                              controls
                              src={dropArr[0].link}
                            />
                          </>
                        )}
                      </CardBody>
                      {dropUploaded && (
                        <React.Fragment>
                          <CardFooter className={classes.cardFooter}>
                            <Button
                              color="rose"
                              onClick={this.handleUploadDrop}
                              disabled={disableUploadBtn}
                            >
                              Upload Video
                            </Button>
                          </CardFooter>
                        </React.Fragment>
                      )}
                    </Card>
                  </GridItem>
                ) : (
                  ""
                )}
                <Dialog
                  classes={{
                    root: classes.center,
                    paper: classes.modal
                  }}
                  open={this.state.modal}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => this.handleClose()}
                  aria-labelledby="modal-slide-title"
                  aria-describedby="modal-slide-description"
                >
                  <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={classes.modalHeader}
                  >
                    <IconButton
                      className={classes.modalCloseButton}
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      onClick={() => this.handleClose()}
                    >
                      <Close className={classes.modalClose} />
                    </IconButton>
                    <h4
                      className={`${classes.modalTitle} font-bold text-center`}
                    >
                      {modaltype === "walllet"
                        ? "Wallet Information"
                        : "Guide to getting your profile verified"}
                    </h4>
                  </DialogTitle>
                  <DialogContent
                    id="modal-slide-description"
                    className={classes.modalBody}
                  >
                    {modaltype === "walllet" ? (
                      <>
                        <p>Add a method of payment below</p>
                        <p className="info-color font-bold">{walletmessage}</p>
                        <GridItem xs={6} sm={6} md={12}>
                          <CustomInput
                            labelText="PayPal Email ( Your earnings transfer account )"
                            id="paypal"
                            formControlProps={{
                              fullWidth: true
                            }}
                            labelProps={{
                              className: "font-bold"
                            }}
                            inputProps={{
                              type: "text",
                              onChange: this.handleChange,
                              name: "paypal",
                              value: paypal,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    account_balance
                                  </Icon>
                                </InputAdornment>
                              )
                            }}
                          />
                        </GridItem>
                        <Button
                          size="sm"
                          color="primary"
                          className="m-b-md b-1-a"
                          onClick={e => this.submitEmail(e)}
                        >
                          Update Email
                        </Button>
                        <p className="font-bold">
                          Overall earnings: ${totalearnings}
                        </p>
                        <Button
                          size="sm"
                          color="primary"
                          className="m-b-md b-1-a"
                          disabled={
                            parseInt(totalearnings, 10) < 100 ? true : false
                          }
                          onClick={() => this.handlePaymentRequest()}
                        >
                          Request Payment
                        </Button>
                        <p className="default-color">
                          Note: Request payment is only available when you have
                          earned $100 or more.
                        </p>
                        <p className="default-color">
                          We recommend you share your profile with your fans /
                          fan base to get more bookings and earnings.
                        </p>
                      </>
                    ) : (
                      <>
                        <h5>
                          1. We suggest uploading a profile picture, so your
                          fans know your on fanbies
                        </h5>
                        <h5>
                          2. Fill in the amount you want to charge per video
                          shoutout / video call per mins <b>(Request rate $)</b>
                        </h5>
                        <h5>3. Fill in your available slot on the platform</h5>
                        <h5>4. Update your online Status</h5>
                        <h5>
                          5. Fill in your social profiles so your fans know your
                          availability
                        </h5>
                        <h5>
                          6. Share your profile on other social media platform
                          to get more bookings.
                        </h5>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </GridContainer>
            </div>
          )}
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
