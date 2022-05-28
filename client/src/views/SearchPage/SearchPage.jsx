import React from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import Joi from "joi-browser";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//axios
import axios from "axios";
//service config
import configApi from "../../services/config.json";
// @material-ui/icons
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import UserItem from "../Components/UserItem";
import Danger from "components/Typography/Danger.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import "../../App.css";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      isLoaded: false,
      searchterm: "",
      submitDisabled: false,
      searchResponseMessage: "",
      listusers: [],
      listTalent: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserByTalentItem = this.getUserByTalentItem.bind(this);
    this.getRandomUsers = this.getRandomUsers.bind(this);
    //
    this.getTalentList = this.getTalentList.bind(this);
    this.getSearchSetting = this.getSearchSetting.bind(this);
    this.handleLabelSearch = this.handleLabelSearch.bind(this);
  }
  schema = {
    searchterm: Joi.string()
      .required()
      .label("search name")
  };

  handleSearch = e => {
    e.preventDefault();
    const validatorObj = {
      searchterm: this.state.searchterm
    };
    const result = Joi.validate(validatorObj, this.schema);
    //clear the error state
    this.setState({ error: "" });
    this.setState({ searchResponseMessage: "" });

    if (result.error !== null)
      return this.setState({ error: result.error.details[0].message });

    this.setState({ submitDisabled: true });
    // loading in action
    this.setState({ isLoaded: false });
    this.getUser();
  };

  handleLabelSearch = e => {
    e.preventDefault();
    const elem = e.currentTarget;
    const value = elem.getAttribute("data-rel");

    this.setState({ error: "" });
    this.setState({ searchResponseMessage: "" });

    this.setState({ submitDisabled: true });
    // loading in action
    this.setState({ isLoaded: false });
    this.getUserByTalentItem(value);
  };

  //getUserByTalent
  getUserByTalentItem(talentId) {
    const talentPag = 24;
    axios
      .post(configApi.getUserByTalentSearch, {
        talentId,
        talentPag
      })
      .then(res => {
        const usersresponse = res.data;
        this.setState({ submitDisabled: false });
        this.setState({ isLoaded: true });
        if (!usersresponse.success)
          return this.setState({
            searchResponseMessage: `${usersresponse.message}`
          });
        this.setState({ listusers: usersresponse.response });
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  }

  // get user by search terms
  getUser() {
    const { searchterm } = this.state;
    //POST Method
    axios
      .post(configApi.getsearchusers, {
        searchterm
      })
      .then(res => {
        const usersresponse = res.data;
        //Enable button
        this.setState({ submitDisabled: false });
        this.setState({ isLoaded: true });
        if (!usersresponse.success)
          return this.setState({
            searchResponseMessage: `${
              usersresponse.message
            } for search:${searchterm}`
          });
        this.setState({ listusers: usersresponse.response });
      })
      .catch(err => {
        console.warn(err);
        this.setState({ submitDisabled: false });
      });
  }

  getSearchSetting() {
    let talentresponse = [];
    //POST Method
    axios
      .all([this.getRandomUsers(), this.getTalentList()])
      .then(res => {
        const listrandomusers = res[0].data;
        talentresponse = res[1].data.response;
        this.setState({ isLoaded: true });
        if (!listrandomusers.success)
          return this.setState({
            searchResponseMessage: listrandomusers.message
          });
        this.setState({ listusers: listrandomusers.response });
        if (talentresponse.length > 0) {
          //remove none from the list by creating a new array object
          _.remove(talentresponse, e => {
            return e["label"] === "None";
          });
          this.setState({ listTalent: talentresponse });
        }
      })
      .catch(() => {
        //console.warn(err);
        this.setState({ submitDisabled: false });
      });
  }

  getTalentList() {
    return axios.post(configApi.getUserTalent);
  }

  getRandomUsers() {
    const talentId = this.props.location.talentId;
    return axios.post(configApi.availableCeleb, { talentId });
  }

  componentDidMount() {
    this.getSearchSetting();
  }

  handleChange = ({ currentTarget: input }) => {
    const formState = { ...this.state };
    formState[input.name] = input.value;
    this.setState(formState);
  };

  renderTalentList(items) {
    const itemList = items.map(item => {
      return (
        <li className="d-inline-block m-h-sm" key={item.id}>
          <Button
            onClick={this.handleLabelSearch}
            round
            color="info"
            data-rel={item.id}
            className="min-width-lg max-width-lg font-bold"
          >
            {item.label}
          </Button>
        </li>
      );
    });
    return itemList;
  }

  render() {
    const {
      error,
      submitDisabled,
      isLoaded,
      listusers,
      listTalent,
      searchResponseMessage
    } = this.state;
    const { classes, ...rest } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            Search for Talent / Influencer or a Famous face on Fanbies for a
            video message
          </title>
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
        <Parallax small filter image={require("assets/img/profile-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={5}
                className={`${classes.navWrapper} m-b-none`}
              >
                <Card className="zIndex">
                  <CardBody>
                    <Danger>{error}</Danger>
                    <CustomInput
                      labelText="Search for a Famous Person..."
                      id="searchterm"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        name: "searchterm",
                        value: this.state.searchterm,
                        onChange: this.handleChange,
                        endAdornment: (
                          <Button
                            round
                            color="primary"
                            onClick={this.handleSearch}
                            disabled={submitDisabled}
                            className=""
                          >
                            Search
                          </Button>
                        )
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div
          className={classNames(
            classes.main,
            classes.mainRaised,
            "undraw-bg-search undraw-bg"
          )}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <h2 className="text-center">Search</h2>
                <Danger>
                  <span className="text-center font-bold d-block m-a-lg min-height-xxxs">
                    {searchResponseMessage}
                  </span>
                </Danger>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={2}
                className={`${classes.navWrapper} m-t-none mobile-view-scroll`}
              >
                <div className="overflow-scroll mobile-view-container width-auto">
                  {listTalent.length > 0 ? (
                    <ul className="m-b-md p-a-none">
                      {this.renderTalentList(listTalent)}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={1}>
                {""}
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={9}
                className={`${classes.navWrapper} m-t-none`}
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
                  <React.Fragment>
                    <div>
                      <GridContainer
                        direction="row-reverse"
                        justify="flex-end"
                        alignItems="center"
                      >
                        {listusers.length <= 0 ? (
                          <div className="min-height-sm text-center">
                            <div className="overlay transparent">
                              <div className="lds-ripple pos-ab top-0">
                                <div />
                                <div />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <UserItem
                            classData={classes}
                            imgClass={imageClasses}
                            userData={listusers}
                          />
                        )}
                      </GridContainer>
                    </div>
                  </React.Fragment>
                )}
              </GridItem>
            </GridContainer>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(SearchPage);
