import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import { Redirect, Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/icons
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Danger from "components/Typography/Danger.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import "../../App.css";

class Conversations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      conversationList: [],
      isEmptyMessage: "",
      isLoading: true
    };
  }

  getConversations = () => {
    axios
      .post(configApi.getuserconversationlist, {
        jtoken: localStorage.getItem("token")
      })
      .then(res => {
        const listResponse = res.data;
        if (!listResponse.success)
          return this.setState({ error: listResponse.message });
        this.setState({
          conversationList: listResponse.response,
          isEmptyMessage: listResponse.message,
          isLoading: false
        });
        // if (messageResponse.response.length <= 0) {
        //   this.setState({
        //     isEmptyConversation: true,
        //     isLoading: false
        //   });
        // } else {
        //   this.setState({
        //     conversationList: messageResponse.response.message,
        //     isLoading: false
        //   });
        // }
      })
      .catch(e => {
        this.setState({ error: e });
      });
  };

  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.getConversations();
  }

  renderConversations = () => {
    const { classes } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const items = this.state.conversationList;
    const item = items.map((item, i) => {
      return (
        <ListItem className={`${classes.listItem}`} key={i}>
          <Link
            to={{
              pathname: `/message`,
              data: {
                convoid: item.id,
                reponserpic: item.reciverDetails[0].picture,
                reponsederid: item.reciverDetails[0].id,
                senderid: item.senderDetails[0].id
              }
            }}
            className="flex flex-row width-full"
          >
            <img
              src={item.reciverDetails[0].picture}
              alt={item.reciverDetails[0].name}
              className={`${imageClasses} profileImg-sm`}
            />
            <div className="m-h-md">
              <p className="m-a-none dark-color font-size-sm">
                {item.reciverDetails[0].name}
              </p>
              <p className="font-size-md m-a-none font-bold info-color text-ellipsis d-inline-block max-width-md">
                {item.lastmessage[0].message}
              </p>
            </div>
          </Link>
        </ListItem>
      );
    });
    return item;
  };

  render() {
    //Redirect users not logged in
    if (localStorage.getItem("token") === null)
      return <Redirect to="/dashboard" />;

    const {
      error,
      isLoading,
      cardAnimaton,
      conversationList,
      isEmptyMessage
    } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Your Direct Messages</title>
          <meta
            name="description"
            content="Search from over 100s of great talents, influencers or famous faces to request a personalised direct video messages from"
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
        <Parallax large filter image={require("assets/img/profile-bg.jpg")}>
          <div className={`${classes.container} `}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={7}
                className={`${classes.navWrapper} m-t-xxxl`}
              >
                <Card className={(classes[cardAnimaton], "zIndex m-t-xxxl")}>
                  <CardBody>
                    <Danger>{error}</Danger>
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
                      <List className={`${classes.list} scrollable`}>
                        {conversationList.length >= 1 ? (
                          this.renderConversations()
                        ) : (
                          <p>{isEmptyMessage}</p>
                        )}
                      </List>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(Conversations);
