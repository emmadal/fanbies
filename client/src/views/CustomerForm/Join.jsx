import React from "react";
import { Helmet } from "react-helmet";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import "../../App.css";
import image from "assets/img/bg7.jpg";
import ChatFriends from "assets/img/chat-friends.svg";
import MessageFriend from "assets/img/messageFriend.svg";
class Join extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      email: "",
      nameofFamousPerson: "",
      facebookFamousPerson: "",
      instaFamousPerson: "",
      twitterFamousPerson: "",
      messageDescription: "",
      submitDisabled: false,
      selectedEnabled: "b",
      formProcessing: false
    };
  }

  handleChangeEnabled = event => {
    this.setState({ selectedEnabled: event.target.value });
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Join Fanbies</title>
          <meta
            name="description"
            content="Join Fanbies as a celebrity, influencer and or famous face. Earn a reasonable income or give your proceeds to your charity. Both ways you are giving the engagement your fans and followers needs by giving out shoutouts"
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
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={`${classes.container}`}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <CardHeader>
                    <h2 className="font-size-xxl font-bold">
                      Join Fanbies as an Influencer / Creator / Famous Person,
                      while you:
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={7}>
                        <h3 className="font-size-xxl">
                          Earn making 1-to-1 Video Calls with your:
                        </h3>
                        <ul className="font-size-lg list-style-display">
                          <li>
                            <b>Subscribers</b>, that are waiting to speak with
                            you
                          </li>
                          <li>
                            <b>Fans</b>, that love your work
                          </li>
                          <li>
                            <b>Students</b>, that love to learn from you
                          </li>
                          <li>
                            <b>Followers</b>, that can not wait to be the first
                            in line for you
                          </li>
                        </ul>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={5}>
                        <img
                          src={ChatFriends}
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative"
                          }}
                          alt="Fanbies Video Chat with Fans"
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer direction="row-reverse">
                      <GridItem xs={12} sm={12} md={7}>
                        <h3 className="font-size-xxl">
                          Get paid and have fun, recording video shoutout
                          messages{" "}
                        </h3>
                        <p className="font-size-lg">
                          Your fans; admirers of your hard work and followers
                          mostly love to showoff with friends and family
                          that personal video message you created just for them
                        </p>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={5}>
                        <img
                          src={MessageFriend}
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative"
                          }}
                          alt="Fanbies Message your fans"
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <div className="text-center">
                    <Button color="primary" size="lg" href="/register">
                      Join Fanbies
                    </Button>
                  </div>
                  <CardFooter>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <p className="text-center font-size-lg">
                          You set your price, availability, and share your page.
                          page. That’s it. Anyone can book for a video call with
                          you in the world, privately, without exchanging
                          contact information.
                        </p>
                        <p className="text-center font-size-lg">
                          As a Famous face / Influencer we also provide a
                          platform for you to leverage your followers to better
                          aid your social responsibility / a charity
                          facilitators to some of your favorite organization or
                          simply providing a revenue stream to help fund your
                          creativity and talent{" "}
                        </p>
                      </GridItem>
                      {/* <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        className="content-center"
                      >
                        <img
                          src={MyFollowers}
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            alignItems: "center"
                          }}
                          alt="Fanbies Message your fans"
                        />
                      </GridItem> */}
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        className="content-center"
                      >
                        <iframe
                          title="Introducing Fanbies"
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/CkQbMo7M1hk"
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </GridItem>
                    </GridContainer>
                  </CardFooter>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(Join);
