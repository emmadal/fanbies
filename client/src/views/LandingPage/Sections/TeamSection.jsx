import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import configApi from "../../../services/config.json";
import GridContainer from "components/Grid/GridContainer.jsx";
import UserItem from "../../Components/UserItem";

import teamStyle from "assets/jss/material-kit-react/views/landingPageSections/teamStyle.jsx";

class TeamSection extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      items: []
    };
    this.getUsers = this.getUsers.bind(this);
  }

  getUsers() {
    // eslint-disable-next-line react/prop-types
    const { talentId } = this.props;
    //POST Method
    axios
      .post(configApi.getUserByTalent, { talentId })
      .then(res => {
        //Enable button
        const userRes = res.data;
        if (!userRes.success) return this.setState({ error: userRes.message });
        this.setState({ items: userRes.response });
      })
      .catch(err => {
        console.warn(err);
      });
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.getUsers();
  }
  render() {
    const { classes, talentList, talentId } = this.props;
    const subtitle = _.filter(talentList, ["id", parseInt(talentId, 10)]);
    const { items } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    return (
      <div className={`${classes.section} p-a-md`}>
        <h2
          className={`${classes.title} m-b-lg content-left h4 secondary-color`}
        >
          {subtitle[0].label}
          <Link
            className="secondary-color font-small floatRight"
            to={{
              pathname: `/f/${subtitle[0].id}`,
              talentId: subtitle[0].id
            }}
          >
            See more
          </Link>
        </h2>
        <div>
          <GridContainer
            direction="row-reverse"
            justify="flex-end"
            alignItems="center"
          >
            <UserItem
              classData={classes}
              imgClass={imageClasses}
              userData={items}
            />
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(teamStyle)(TeamSection);
