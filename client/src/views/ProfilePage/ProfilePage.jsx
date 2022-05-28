import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import FormData from "form-data";
import _ from "lodash";
import Joi from "joi-browser";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import configApi from "../../services/config.json";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import InsertPhoto from "@material-ui/icons/InsertPhoto"
import PhoneInTalk from "@material-ui/icons/PhoneInTalk";
import Camera from "@material-ui/icons/Camera";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import FullScreen from "@material-ui/icons/Fullscreen";
import Subscriptions from "@material-ui/icons/Subscriptions";
import DashboardOutlined from "@material-ui/icons/DashboardOutlined";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Badge from "components/Badge/Badge.jsx";
import Icon from "@material-ui/core/Icon";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Danger from "components/Typography/Danger.jsx";
import Success from "components/Typography/Success.jsx";

import renderDateStamp from "../../utils/dateStamp";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
class ProfilePage extends React.Component {
  anchorElBottom = null;
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      username: "",
      rand_: "",
      name: "",
      profession: "",
      bio: "",
      rate: "",
      mediaURL: "",
      slots: 0,
      openBottom: false,
      fb_id: "",
      twitter_id: "",
      linkedin_id: "",
      tik_id: "",
      IG_id: "",
      picture: "a8b0b3a30b6f24438a99a81e3d14dd15",
      isLoaded: false,
      primaryTalent: "",
      secondaryTalent: "",
      extraTalent: "",
      modal: false,
      modaltype: "",
      activeNavPill: 0,
      email: "",
      error: "",
      confirmationMessage: "",
      userType: "",
      userActive: "",
      confirmationSent: false,
      myProfile: false,
      requestDescription: "",
      requestTitle: "",
      requestId: "",
      completedIsLoading: false,
      promoVideo: "",
      isPlaying: false,
      isFeedPlaying: false,
      isPlayingSingle: false,
      callrate: 0,
      feedLiked: false,
      post_title: "",
      input__comment: "",
      feedImgFile: "",
      imagePreviewUrl: "",
      recordedStream: null,
      subFeedsArr: [],
      selectedFeedAction: ""
    };

    this.loadprofile = this.loadprofile.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getTalentList = this.getTalentList.bind(this);
    this.submitNotifyEmail = this.submitNotifyEmail.bind(this);
    this.handleVideoPlay = this.handleVideoPlay.bind(this);
    this.fileInput = React.createRef();
    this.videoInput = React.createRef();
  }
  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Please note Email ")
  };

  handleClosePopover(state) {
    this.setState({
      [state]: false
    });
  }

  handlePromo(state) {
    this.setState({
      [state]: true
    });
  }
  handleClickOpen(item, modaltype) {
    // console.log("modal", modal);
    // console.log("modaltype", modaltype);
    
    // console.log("dropArr", this.state.dropArr);
    // var x = [];
    // x[modal] = true;
    // this.setState(modal);
    this.setState({ modaltype, modal: true, selectedFeedAction: item });
  }
  
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState({ modaltype: ""});
    this.setState(x);
    this.handleRemoveFeed();
  }
  handleEmailSubmit = e => {
    e.preventDefault();
    const validatorObj = {
      email: this.state.email
    };
    const result = Joi.validate(validatorObj, this.schema);
    this.setState({ error: "", confirmationMessage: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    this.submitNotifyEmail();
  };

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    if(input.name === "post_title" && input.value.length >= 140) {
      input.value = input.value.slice(0,140);
    };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  submitNotifyEmail() {
    const { username, name, email } = this.state;
    //POST Method
    axios.post(configApi.notifyuser, { username, name, email }).then(res => {
      const userRes = res.data;
      if (!userRes.success) return this.setState({ error: userRes.message });

      this.setState({
        confirmationMessage: `Thanks you, we will inform when ${name} is back available. You might find similar famous faces on Fanbies to book simply go to search page.`
      });
      this.setState({ confirmationSent: true });
    });
  }

    getUserDetails() {
    if (localStorage.getItem("token") !== null) {
      return axios.post(configApi.getprofile, {
        username: this.props.match.params.username,
        jtoken: localStorage.getItem("token")
      });
    }
    return axios.post(configApi.getprofile, {
      username: this.props.match.params.username
    });
  }
  getTalentList() {
    return axios.post(configApi.getUserTalent);
  }
  getPromoRequest() {
    return axios.post(configApi.getpromovids, {
      username: this.props.match.params.username
    });
  }

  getUserDrop = () => {
    return axios.post(configApi.getuserdrop, {
      username: this.props.match.params.username
    });
  };

  getFeeds = () => {
    return axios.post(configApi.getuserfeeds, {
      jtoken: localStorage.getItem("token"),
      username: this.props.match.params.username
    });
  }
  

  loadprofile() {
    axios
      .all([
        this.getUserDetails(),
        this.getTalentList(),
        this.getPromoRequest(),
        this.getUserDrop(),
        this.getFeeds()
      ])
      .then(res => {
        const userDetailRes = res[0].data;
        const talentlistRes = res[1].data;
        const promoVideo = res[2].data;
        const dropVideoRes = res[3].data;
        const feedsRes = res[4].data;
        if (!userDetailRes.success) {
          this.setState({ error: userDetailRes.message });
          this.props.history.replace("/dashboard");
          return;
        }
        
        this.setState({
          rand_: userDetailRes.response[0].rand_,
          name: userDetailRes.response[0].name,
          myProfile: userDetailRes.response[0].mypage,
          username: userDetailRes.response[0].username,
          profession: userDetailRes.response[0].profession,
          bio: userDetailRes.response[0].bio,
          picture: userDetailRes.response[0].picture,
          mediaURL: userDetailRes.response[0].mediaUrl,
          rate: userDetailRes.response[0].shoutrate,
          slots: userDetailRes.response[0].available_slot,
          twitter_id: userDetailRes.response[0].twitter_id,
          linkedin_id: userDetailRes.response[0].linkedin_id,
          tik_id: userDetailRes.response[0].tik_id,
          fb_id: userDetailRes.response[0].fb_id,
          IG_id: userDetailRes.response[0].ig_id,
          userType: userDetailRes.response[0].usertype,
          userActive: userDetailRes.response[0].active,
          promoVideo: promoVideo.response,
          dropArr: dropVideoRes.response,
          callrate: userDetailRes.response[0].callrate,
          subFeedsArr: feedsRes.response
        });
        if (userDetailRes.response[0].primary_talent !== 0) {
          let filterPrimaryTalent = _.filter(talentlistRes.response, [
            "id",
            userDetailRes.response[0].primary_talent
          ]);
          this.setState({ primaryTalent: filterPrimaryTalent[0].label });
        }
        if (userDetailRes.response[0].secondary_talent !== 0) {
          let filterSecondaryTalent = _.filter(talentlistRes.response, [
            "id",
            userDetailRes.response[0].secondary_talent
          ]);
          this.setState({ secondaryTalent: filterSecondaryTalent[0].label });
        }
        if (userDetailRes.response[0].extra_talent !== 0) {
          let filterExtraTalent = _.filter(talentlistRes.response, [
            "id",
            userDetailRes.response[0].extra_talent
          ]);
          this.setState({ extraTalent: filterExtraTalent[0].label });
        }
        //Normal user
        this.renderload();
      })
      .catch(e => {
        //sentry
        // eslint-disable-next-line no-console
        console.warn("😱", e);
      });
  }
  renderload() {
    this.setState({ isLoaded: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.primaryTalent !== prevState.primaryTalent) this.renderload();
  }

  componentDidMount() {
    this.loadprofile();
  }

  renderProfessionTag(items) {
    if (items === "") return " ";
    const itemArry = items.split(",");
    const tags = itemArry.map((item, i) => {
      return (
        <Badge color="gray" key={i}>
          {item}
        </Badge>
      );
    });
    return tags;
  }

  renderFBIcon(fb_id) {
    return fb_id ? (
      <Button
        color="transparent"
        href={`https://www.facebook.com/${fb_id}`}
        target="_blank"
        className="p-a-none"
      >
        <i className={"fab fa-facebook"} />
      </Button>
    ) : (
      " "
    );
  }

  renderInstaIcon(IG_id) {
    return IG_id ? (
      <Button
        color="transparent"
        href={`https://www.instagram.com/${IG_id}`}
        target="_blank"
        className="p-a-none"
      >
        <i className={"fab fa-instagram"} />
      </Button>
    ) : (
      " "
    );
  }

  renderTwitterIcon(twitter_id) {
    return twitter_id ? (
      <Button
        color="transparent"
        href={`https://www.twitter.com/${twitter_id}`}
        target="_blank"
        className="p-a-none"
      >
        <i className={"fab fa-twitter"} />
      </Button>
    ) : (
      " "
    );
  }

  renderLinkedinIcon(linkedin_id) {
    return linkedin_id ? (
      <Button
        color="transparent"
        href={`https://www.linkedin.com/in/${linkedin_id}`}
        target="_blank"
        className="p-a-none"
      >
        <i className={"fab fa-linkedin"} />
      </Button>
    ) : (
      " "
    );
  }

  renderTikTokIcon(tik_id) {
    return tik_id ? (
      <Button
        color="transparent"
        href={`https://www.tiktok.com/@${tik_id}`}
        target="_blank"
        className="p-a-none"
      >
        <i className={"fab fa-tiktok"} />
      </Button>
    ) : (
      " "
    );
  }

  renderPrimaryTalent() {
    const { primaryTalent } = this.state;
    return primaryTalent ? <Badge color="warning">{primaryTalent}</Badge> : " ";
  }

  renderSecondaryTalent() {
    const { secondaryTalent } = this.state;
    return secondaryTalent ? (
      <Badge color="info">{secondaryTalent}</Badge>
    ) : (
      " "
    );
  }

  renderExtraTalent() {
    const { extraTalent } = this.state;
    return extraTalent ? <Badge color="gray">{extraTalent}</Badge> : " ";
  }

  handleRequest(username, name, rate, picture, type) {
    const { profession } = this.state;
    if (type === "call") {
      this.props.history.push({
        pathname: `/videorequest/${username}`,
        data: { name, rate, picture, username, profession }
      });
    } else {
      this.props.history.push({
        pathname: `/request/${username}`,
        data: { name, rate, picture, username, profession }
      });
    }
  }

  renderNotify(name, userActive) {
    let text = `Notify Me when ${name} is Back on Fanbies`;
    if (userActive === 2) {
      text = `Coming Soon`;
    }
    return (
      <Button
        color="rose"
        className="font-bold"
        onClick={() => this.handleClickOpen("modal","notify")}
        round
      >
        {text}
      </Button>
    );
  }

  renderShoutOut(username, name, slots, rate, picture, callrate) {
    const { profession } = this.state;
    return (
      <div className="m-v-md">
        {profession && (
          <p>
            <Badge className="p-v-md">
              <span className="font-bold">
                Proceeds in support of {profession}
              </span>
            </Badge>
          </p>
        )}
        <div className="link-items">
          {callrate !== 0 && (
            <Button
              color="primary"
              className="m-b-md link__btns"
              onClick={() =>
                this.handleRequest(username, name, callrate, picture, "call")
              }
              round
              size="lg"
            >
              {/* <i className="fas fa-phone-volume font-size-xl rotate-45" /> */}
              Book video call
            </Button>
          )}
          
          <Button
            color="primary"
            className="m-b-md link__btns"
            onClick={() =>
              this.handleRequest(username, name, rate, picture, "message")
            }
            round
            size="lg"
          >
            {/* <i className="fas fa-video font-size-xl" /> */}
            Book for video message
          </Button>
        </div>
        <p>
          {" "}
          {name} is available for <b>{slots}</b> more fan video request
        </p>
      </div>
    );
  }

  // renderVideoDrop = () => {
  //  const { dropArr, isPlayingSingle } = this.state;
  //  const iOS = ["iPhone"].indexOf(navigator.platform) >= 0;
  //   return (
  //     <GridContainer justify="center">
  //       <GridItem xs={6} sm={6} md={6}>
  //         <div className="video-container width-100 pos-rel d-inline-block m-h-sm">
  //           <video
  //             className="width-100 dropVideo"
  //             playsInline
  //             preload="auto"
  //             poster={dropArr[0].thumbnail}
  //             controlsList= "nodownload"
  //             onClick={() => this.handleVideoPlaySingle()}
  //           >
  //             <source src={dropArr[0].link} type="video/mp4" />
  //             Your browser does not support the video tag.
  //           </video>
  //           <div
  //             className={`video-playBtn pos-ab ${
  //               isPlayingSingle === true ? "d-none" : "d-block"
  //             }`}
  //           >
  //             <PlayCircleOutline
  //               style={{ color: "#FFFFFF", fontSize: "3rem" }}
  //               onClick={() => this.handleVideoPlaySingle()}
  //             />
  //           </div>
  //         </div>
  //       </GridItem>
  //     </GridContainer>
  //   );
  // }

  autoPlayRenderVideoDrop = () => {
   const { dropArr } = this.state;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <div className="video-container width-100 pos-rel d-inline-block">
            <video
              className="width-100 dropVideo"
              playsInline
              preload="auto"
              autoPlay={true}
              controlsList= "nodownload"
            >
              <source src={dropArr[0].link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </GridItem>
      </GridContainer>
    );
  }

  renderNavPillObj = () => {
    const {
      userType,
      myProfile,
      promoVideo,
      userActive,
      slots
    } = this.state;
    const { classes } = this.props;
    const uname = this.props.match.params.username;
    let contentArry = [];

    // TODO: Render Subsciption User feeds for paid and free versions..
    // subscription 
    // if (slots > 0 && userActive === 3) {
    //   const Feeds = {
    //     tabButton: "Feeds",
    //     tabIcon: DashboardOutlined,
    //     tabContent: 
    //         this.renderFeeds()
    //   };
    //   contentArry.push(Feeds);
    // }

    if (userType >= 1 && promoVideo.length > 0) {
      const PublicGallery = {
        tabButton: "Gallery",
        tabIcon: Subscriptions,
        tabContent: (
          <GridContainer>{this.renderPromoVideo(promoVideo)}</GridContainer>
        )
      };
      contentArry.push(PublicGallery);
    }

    if (myProfile) {
      const vCall = {
        tabButton: "Completed Video Calls",
        tabIcon: PhoneInTalk,
        tabContent: (
          <div>
            <span className="text-center d-inline-block m-b-lg">
              View Your Completed Video Call(s)
            </span>
            <GridContainer justify="center">
              <Button
                size="lg"
                color="primary"
                onClick={() =>
                  window.location.replace(`/completedvcalls/${uname}`)
                }
              >
                View Completed Video Call(s)
              </Button>
            </GridContainer>
          </div>
        )
      };
      const vMessages = {
        tabButton: "Completed Shoutout(s)",
        tabIcon: PlayCircleOutlineIcon,
        tabContent: (
          <div>
            <span className="text-center d-inline-block m-b-lg">
              View Your Completed Shoutout Request(s)
            </span>
            <GridContainer justify="center">
              <Button
                size="lg"
                color="primary"
                onClick={() => window.location.replace(`/completed/${uname}`)}
              >
                View Completed Shoutout(s)
              </Button>
            </GridContainer>
          </div>
        )
      };
      const Pending = {
        tabButton: "Pending Request",
        tabIcon: Camera,
        tabContent: (
          <div>
            <span className="text-center d-inline-block m-b-lg">
              View Pending Request(s)
            </span>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Button
                  size="lg"
                  color="primary"
                  onClick={() => window.location.replace(`/pending/${uname}`)}
                >
                  View Pending(s)
                </Button>
              </GridItem>
            </GridContainer>
          </div>
        )
      };
      contentArry.push(Pending, vMessages, vCall);
    }

    return contentArry;
  };

  handleFeedVideoPlay = index => {
    const videoELm = index.target;
    const { isFeedPlaying } = this.state;
    this.setState(
      {
        isFeedPlaying: !this.state.isFeedPlaying
      },
      () => {
        if (!isFeedPlaying) {
          videoELm.play();
        } else {
          videoELm.pause();
        }
      }
    );
  };

  // TODO: Render Subsciption User feeds for paid and free versions..
  renderFeedItem = items => {
    const { name, myProfile } = this.state;
    const itemlist = items.map((item, i) => {
      return (
        <Card key={i} className="feedItem">
          <CardBody className="p-a-none">
            {myProfile &&
              <Button 
                color="danger"
                className="comment__btn floatRight"  
                simple
                onClick={() => this.handleClickOpen(item,"deletefeed")}
                >
                  <Icon>block</Icon>
                  Delete
              </Button>
            }
            {item.type === "video" ? (
              <>
                <div className={`video-playBtn-feed pos-ab d-block`}>
                  <VideoLibrary
                    style={{ color: "#6e6e6e", fontSize: "2rem" }}
                  />
                </div>
                <div
                  className="video-container width-100 pos-rel d-inline-block"
                  onClick={this.handleFeedVideoPlay}
                >
                  <video
                    style={{ width: "100%", position: "relative" }}
                    preload="none"
                    playsInline
                    height="307"
                    poster={item.img_link}
                  >
                    <source src={item.video_link} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </>
            ) : (
              <>
                <div className={`video-playBtn-feed pos-ab d-block`}>
                    <InsertPhoto
                      style={{ color: "#6e6e6e", fontSize: "2rem" }}
                    />
                  </div>
                <img src={item.img_link} width="100%" alt={`${name} feeds `} />
              </>
            )}
          </CardBody>
          <CardFooter className="feeds__footer">
              <div className="width-100">
                  <p className="feed_title">{item.title}</p>
                  <span className="floatRight pos-rel top-5 default-color">{renderDateStamp(item.date)}</span>
              </div>
          </CardFooter>
        </Card>
      )
    });
    return itemlist;
  }

  // TODO: Render Subsciption User feeds for paid and free versions..
  renderFeeds = () => {
    const { feedLiked, myProfile, subFeedsArr } = this.state;
    return(
      <GridContainer>
        {myProfile &&
          <GridItem alignCenter className="feed_create-post">
            <Button
              color="info"
              size="lg"
              className="comment__btn"
              simple
              onClick={() => this.handleClickOpen("modal", "createfeed")}
            >
              <Icon>add_circle_outline</Icon>
              Create Subscription Post
            </Button>
          </GridItem>
        }
        <GridItem>
          {subFeedsArr.length ?
            this.renderFeedItem(subFeedsArr) :
            <Card>
              <CardBody className="p-a-none linear-background">
                <Button
                  color="primary"
                  className="m-b-md link__btns"
                  onClick={e => console.log("subsribe to feeds")}
                  round
                  simple
                  size="lg"
                >
                  Subscribe To See Fanbies Posts
                </Button>
              </CardBody>
            </Card>
          }
          {/* <Card>
            <CardBody className="p-a-none">
                    <img src={require("assets/img/articles/female_vlogger.jpg")} width="100%" alt="Influener on video call with fan on fanbies" />
            </CardBody>
            <CardFooter className="feeds__footer">
              <div className="width-100">
                  <Button 
                    color={feedLiked ? "rose" : "warning"}
                    className="comment__btn"  
                    simple
                    onClick = {e => this.setState({feedLiked: !feedLiked})}
                    >
                      {feedLiked ? (
                        <Icon className="font-size-lg">favorite</Icon>
                      ) : (
                        <Icon className="font-size-lg">favorite_border</Icon>
                      )}
                      11 Likes
                  </Button>
                  <Button
                    className="comment__btn" 
                    color="warning"
                    simple
                    >
                      <span> 10 &nbsp; </span> Comments
                  </Button>
                  <span className="floatRight pos-rel top-5">1d</span>
                  <p className="feed_title">
                    Facebook is changing it algoright again ooo, do you guy like apple devices from cookie tracking a new privacy feature and facebook is angry about it an apple move will be bad for small businesses and Facebook is not a good guy, a new dialog a new company or ask apple not to try and this is affect decrease in conversationt 
                  </p>
              </div>
              <div>
                <ul className="comment__list">
                  <li>
                    <span className="comment__uname">username:</span>
                    <span>@nkubi_official hmmm my broda @nedu_wazobiafm don teach u bad thing, na market wen big pass u be this oo. the lord is ur muscle.</span>
                  </li>
                </ul>
              </div>
              <div className="feeds__footer--post">
                  <CustomInput
                    labelText="Add a comment..."
                    id="comment"
                    inputRootCustomClasses="m-v-sm"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      onChange: this.handleChange,
                      name: "comment",
                      className:"input__comment",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                              color="primary"
                              className="floatRight"
                              onClick={e => console.log(e)}
                            >
                              Post
                          </Button>
                        </InputAdornment>
                      )
                    }}
                  />
              </div>
            </CardFooter>
          </Card> */}
        </GridItem>
      </GridContainer>
    );
  };

  addActiveClass(e) {
    const clicked = e.target.id;
    if (this.state.active === clicked) {
      this.setState({ active: "" });
    } else {
      this.setState({ active: clicked });
    }
  }

  handleVideoFeed = () => {
    let _this = this;
    _this.handleRemoveFeed();
    this.setState({ error: ""});
    let previewVideo = document.querySelector("video#preview");
    previewVideo.preload = "metadata";

    previewVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(previewVideo.src);
      if (previewVideo.duration > 1200) {
        previewVideo.srcObject = null;
        previewVideo.src = null;
        return _this.setState({ uploadError: "Video duration should less than 20 mintues" });
      }
    };

    previewVideo.srcObject = null;
    previewVideo.src = null;
    previewVideo.src = window.URL.createObjectURL(
      this.videoInput.current.files[0]
    );
    this.setState({ recordedStream: this.videoInput.current.files[0] });
    previewVideo.controls = true;
    previewVideo.play();
  };

  handleRemoveFeed = () => {
    this.setState({
        error: "",
        feedImgFile: "",
        imagePreviewUrl: "",
        recordedStream: null
      });
  };

   handleImageFeed = () => {
    this.handleRemoveFeed();
    let reader = new FileReader();
    let file = this.fileInput.current.files[0];
    let imgSize = this.fileInput.current.files[0].size / 1024 / 1024;
    if(imgSize > 4) {
      this.setState({ error: "Image size is large, we only accept 4MB currently"})
      return;
    }

    reader.onloadend = () => {
      this.setState({
        error: "",
        feedImgFile: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file);
  };

  handleDeleteFeed = () => {
    const { selectedFeedAction } = this.state;
    if( selectedFeedAction ){
      axios
      .post(configApi.deletefeed, {
        jwtoken: localStorage.getItem("token"),
        id: selectedFeedAction.id,
        assettype: selectedFeedAction.type,
        video_link: selectedFeedAction.video_link,
        img_link: selectedFeedAction.img_link
      })
      .then(res => {
        const feedData = res.data;
        if (!feedData.success) return;

        window.location.reload();
      })
      .catch(e => {
        //sentry
        console.log("😱", e);
      });
    }
  }

  handleFeedSubmit = e => {
    e.preventDefault();
    const { recordedStream, feedImgFile, caption} = this.state;
    if (localStorage.getItem("token") == null) return;

    let data = new FormData();
    const feed_title = caption ? caption : '';
    let vidfile = recordedStream;
    let postType =  vidfile !== null ? "video" : "image";
    let uploadfile = vidfile !== null ? recordedStream : feedImgFile;

    data.append("file", uploadfile);
    data.set("token", localStorage.getItem("token"));
    data.set("type", postType);
    data.set("title", feed_title);
    // localstorage
    data.set("useremail", localStorage.getItem("useremail"));
    data.set("uid", localStorage.getItem("fan_id"));
    data.set("ownername", localStorage.getItem("username"));

    // remove preview with a loading screen
    let previewVideo = document.querySelector("video#preview");
    previewVideo.srcObject = null;
    previewVideo.src = null;  
    //User should be able to submit one recording per session.
    
    this.setState({
      confirmationSent: true,
      confirmationMessage: "Posting feed, check back in 2 minutes..."
    });
    
    //WRITE API HERE...
    setTimeout(() => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data,
        url: configApi.uploadfeed
      };
      axios(options).then();
    }, 6000);
  }

  renderModalContent = () => {
    const { modaltype, imagePreviewUrl, recordedStream } = this.state;
    const { classes } = this.props;
    return(
      <React.Fragment>
        {modaltype === "notify" && 
        <>
          <CustomInput
              labelText="Your Email..."
              id="email"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: this.handleChange,
                name: "email",
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon
                      className={classes.inputIconsColor}
                    >
                      email_outline
                    </Icon>
                  </InputAdornment>
                )
              }}
            />
            <Button
              color="primary"
              className="floatRight"
              onClick={e => this.handleEmailSubmit(e)}
              round
            >
              Notify Me!
          </Button>
        </>}
        {modaltype === "video" && 
        <>
            {this.autoPlayRenderVideoDrop()}
        </>}
        { modaltype === "deletefeed" &&
          <div className="flex">
            <h4 className="p-a-lg">Please confirm removal of this post</h4>
            <Button 
              color="danger"
              className="comment__btn "  
              simple
              size="lg"
              onClick={() => this.handleDeleteFeed()}
              >
                <Icon>done</Icon>
                Yes
            </Button>
          </div>
        }
        {modaltype === "createfeed" && 
        <div className="p-a-md">
            <CustomInput
              labelText="Post Captions...max 140"
              id="caption"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                onChange: this.handleChange,
                name: "caption",
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon
                      className={classes.inputIconsColor}
                    >
                      create
                    </Icon>
                  </InputAdornment>
                )
              }}
            />
            <div className="content-center">
                <input
                  accept="image/jpeg, image/png"
                  className={`${classes.input} fileInput`}
                  id="imgfile"
                  type="file"
                  onChange={this.handleImageFeed}
                  ref={this.fileInput}
                />
                <label
                  htmlFor="imgfile"
                  className="d-block text-center clickable-icon m-h-lg"
                >
                  Click icon to upload Image &nbsp;
                  <AddPhotoAlternate
                    style={{
                      color: "#000",
                      fontSize: "4em",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </label>
                <input
                  accept="video/mp4"
                  className={`${classes.input} fileInput`}
                  id="videoInput"
                  type="file"
                  onChange={this.handleVideoFeed}
                  ref={this.videoInput}
                />
                <label
                  htmlFor="videoInput"
                  className="d-block text-center clickable-icon upload-video-label m-h-lg"
                >
                  Click icon to upload MP4 Video &nbsp;
                  <VideoLibrary
                    style={{
                      color: "#000",
                      fontSize: "4em",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </label>
            </div>
            <video id="preview" 
                   className={recordedStream ? 'd-block' : 'd-none'} 
                   height="200" width="250" 
                   playsInline />
            <img src={imagePreviewUrl} className={`${imagePreviewUrl ? 'd-block' : 'd-none' } feedImgPreview m-v-md`} />
            {imagePreviewUrl || recordedStream ? (
            <>
                <IconButton
                  className={`floatLeft p-a-none m-a-sm border-solid-md secondary-color border-round`}
                  key="remove"
                  aria-label="Remove"
                  onClick={() => this.handleRemoveFeed()}
                >
                  <Close />
                </IconButton>
                <Button
                      disabled={imagePreviewUrl || recordedStream ? false : true}
                      color="primary"
                      className="floatRight"
                      onClick={e => this.handleFeedSubmit(e)}
                      round
                    >
                      Post
                </Button>
            </>
            ) : "" }
        </div>}
      </React.Fragment>
    )
  };

  renderPromoVideo(itemArry) {
    const iOS = ["iPhone"].indexOf(navigator.platform) >= 0;
    const requestItem = itemArry.map((item, i) => {
      return (
        <GridItem xs={6} sm={6} md={6} key={i}>
          {iOS === true ? (
            ""
          ) : (
            <div className={`video-fullScreen pos-ab d-block zIndex`}>
              <FullScreen
                style={{ color: "#00acc1", fontSize: "2rem" }}
                onClick={() => this.handleVideoFullScreen(i)}
              />
            </div>
          )}
          <div className="video-container width-100 pos-rel d-inline-block m-h-sm">
            <video
              className="width-100 normalVideo"
              preload="none"
              playsInline
              poster={item.thumbnail}
              controlsList= "nodownload"
              onClick={() => this.handleVideoPlay(i)}
            >
              <source src={item.link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={`video-playBtn pos-ab d-block`}>
              <PlayCircleOutline
                style={{ color: "#FFFFFF", fontSize: "3rem" }}
                onClick={() => this.handleVideoPlay(i)}
              />
            </div>
          </div>
        </GridItem>
      );
    });
    return requestItem;
  }

  handleVideoFullScreen = index => {
    let vidElem = document.querySelectorAll(".normalVideo")[index];
    if (vidElem.webkitRequestFullScreen) {
      vidElem.webkitRequestFullScreen();
    } else if (vidElem.mozRequestFullScreen) {
      vidElem.mozRequestFullScreen();
    } else {
      vidElem.requestFullScreen();
    }
  };

  handleVideoFullScreenSingle = () => {
    let vidElem = document.querySelector(".dropVideo");
    if (vidElem.webkitRequestFullScreen) {
      vidElem.webkitRequestFullScreen();
    } else if (vidElem.mozRequestFullScreen) {
      vidElem.mozRequestFullScreen();
    } else {
      vidElem.requestFullScreen();
    }
  };

  handleVideoPlaySingle = () => {
    const { isPlayingSingle } = this.state;
    this.setState(
      {
        isPlayingSingle: !this.state.isPlayingSingle
      },
      () => {
        if (!isPlayingSingle)
          return document.querySelector(".dropVideo").play();
        document.querySelectorAll(".dropVideo")[0].pause();
      }
    );
    document.querySelector(".dropVideo").setAttribute("loop", true);
  };

  handleVideoPlay(index) {
    const { isPlaying } = this.state;
    let vidElem = document.querySelectorAll(".normalVideo")[index];
    this.setState(
      {
        isPlaying: !this.state.isPlaying
      },
      () => {
        if (!isPlaying) {
          vidElem.play();
          vidElem.parentElement.children[1].classList.add("d-none");
          vidElem.parentElement.children[1].classList.remove("d-block");
          return;
        }
        vidElem.pause();
        vidElem.parentElement.children[1].classList.remove("d-none");
        vidElem.parentElement.children[1].classList.add("d-block");
      }
    );
    vidElem.setAttribute("loop", true);
  }

  render() {
    const {
      IG_id,
      fb_id,
      twitter_id,
      linkedin_id,
      tik_id,
      name,
      bio,
      picture,
      rate,
      username,
      slots,
      isLoaded,
      error,
      userType,
      confirmationMessage,
      userActive,
      confirmationSent,
      myProfile,
      rand_,
      callrate,
      dropArr,
      activeNavPill,
      modal
    } = this.state;
    
    const myid = localStorage.getItem("fan_id");
    const pic = localStorage.getItem("picid");
    const { classes, ...rest } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const illustratorSvg = myProfile
      ? "undraw-bg undraw-bg-profile"
      : "undraw-bg undraw-bg-celebprofile";
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Request direct video message from {name} - Fanbies</title>
          <meta
            name="description"
            content={`Book and request a personalised direct video messages from ${name} for $ ${rate}`}
          />
          <meta
            property="og:title"
            content={`Request direct video message from ${name} - Fanbies`}
          />
          <meta
            property="og:description"
            content={`Request direct video message from ${name} - Fanbies`}
          />
          <meta
            property="og:image"
            content={require("assets/img/articles/fanbies-sample.png")}
          />
          <meta
            property="og:url"
            content={`https://www.fanbies.com/user/${username}`}
          />
        </Helmet>
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
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div
          className={classNames(
            classes.main,
            classes.mainRaised,
            illustratorSvg
          )}
        >
          {!isLoaded ? (
            <>
              <div className="min-height-sm text-center">
                <div className="overlay transparent">
                  <div className="lds-ripple pos-ab top-0">
                    <div />
                    <div />
                  </div>
                </div>
              </div>
              <Danger>{error}</Danger>
            </>
          ) : (
            <div>
              <div className={`${classes.container}`}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.profile}>
                      <div className="flex">
                        <img
                          src={picture}
                          alt={name}
                          className={`${imageClasses} profileImg-md`}
                        />
                        {dropArr.length !== 0 &&
                          <div className={`video-playBtn-profile pos-ab d-block`}>
                            <PlayCircleOutline
                              style={{ color: "#FFFFFF", fontSize: "4rem" }}
                              onClick={() => this.handleClickOpen("modal","video")}
                            />
                          </div>
                        }
                      </div>
                      <div className={classes.name}>
                        <h3 className={`d-block ${classes.title}`}>{name}</h3>
                        {myProfile ? (
                          <div
                            className="d-inline-block"
                            onClick={() =>
                              this.props.history.replace(
                                `/usersetting/${username}`
                              )
                            }
                          >
                            <i className="material-icons clickable-icon secondary-color">
                              edit
                            </i>
                            <span className="font-bold clickable-icon">
                              Profile Setting
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                        {myid == "1" ? (
                          <Link
                            to={{
                              pathname: `/message`,
                              data: {
                                reponserpic: pic,
                                reponsederid: rand_,
                                senderid: myid
                              }
                            }}
                            className="m-h-md d-inline-block"
                          >
                            <i className="material-icons clickable-icon">
                              question_answer
                            </i>
                            <span>Direct Message</span>
                          </Link>
                        ) : (
                          ""
                        )}
                        <div className="m-v-md">
                          {this.renderPrimaryTalent()}
                          {this.renderSecondaryTalent()}
                          {this.renderExtraTalent()}
                        </div>
                        <div className="m-v-md">
                          {this.renderFBIcon(fb_id)}
                          {this.renderInstaIcon(IG_id)}
                          {this.renderTwitterIcon(twitter_id)}
                          {this.renderLinkedinIcon(linkedin_id)}
                          {this.renderTikTokIcon(tik_id)}
                        </div>
                      </div>
                    </div>
                  </GridItem>
                  <React.Fragment>
                    <Dialog
                      classes={{
                        root: classes.center,
                        paper: classes.modal
                      }}
                      open={modal}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={() => this.handleClose("modal")}
                      aria-labelledby="modal-slide-title"
                      aria-describedby="modal-slide-description"
                    >
                      <DialogContent
                        id="modal-slide-description"
                        className={`${classes.modalBody} p-a-none`}
                      >
                        <div className={` ${error || confirmationMessage ? 'p-a-md text-center dialog-message': null }`}>
                          <Danger>{error}</Danger>
                          <Success>{confirmationMessage}</Success>
                        </div>
                        {confirmationSent === true ? (
                          <>
                            <div className="min-height-sm text-center">
                              <div className="overlay transparent">
                                <div className="lds-ripple pos-ab top-0">
                                  <div />
                                  <div />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          this.renderModalContent()
                        )}
                      </DialogContent>
                    </Dialog>
                  </React.Fragment>
                </GridContainer>
                {userType <= 0 || myProfile ? (
                  " "
                ) : (
                  <React.Fragment>
                    <GridContainer justify="center" className="text-center">
                      <GridItem xs={12} sm={12} md={12}>
                        {slots > 0 && userActive === 3
                          ? this.renderShoutOut(
                              username,
                              name,
                              slots,
                              rate,
                              picture,
                              callrate
                            )
                          : this.renderNotify(name, userActive)}
                      </GridItem>
                    </GridContainer>
                    <div className={classes.description}>
                      <p>{bio}</p>
                    </div>
                  </React.Fragment>
                )}
                <GridContainer justify="center">
                  <GridItem
                    xs={12}
                    sm={12}
                    md={8}
                    className={classes.navWrapper}
                  >
                    <NavPills
                      alignCenter={true}
                      color="primary"
                      tabs={this.renderNavPillObj()}
                      active={activeNavPill}
                    />
                  </GridItem>
                </GridContainer>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(ProfilePage);
