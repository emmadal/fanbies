/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import classNames from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// core components
import Button from "components/CustomButtons/Button.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function HeaderLinks({ ...props }) {
  const { classes } = props;
  let username='';
  let usertype='';
  let uname='';
  let pictureId;
  if(localStorage.getItem("token") !== null && localStorage.getItem("useremail") !== null )
      username = localStorage.getItem("username");
      uname = localStorage.getItem("fab_name");
      usertype = localStorage.getItem("type");
      pictureId = localStorage.getItem("picid") === "" ? "1" : localStorage.getItem("picid");

  return (
    <List className={classes.list}>
      {/* <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title="Follow us on twitter"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="https://twitter.com/fanbies"
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem> */}
      {/* <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title="Follow us on facebook"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.facebook.com/fanbies/"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem> */}
      {/* <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow us on instagram"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.instagram.com/fanbiesofficial/"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem> */}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          buttonText="For Influencer"
          dropdownHeader="Fanbies Influencer"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          dropdownList={[
            <Button
              href="/join"
              color="transparent"
              className="top-0 p-a-sm m-a-none"
            >
            <i className="material-icons">
              group_add
            </i> Join as Influencer
          </Button>,
            <Button
              href="/recommend"
              color="transparent"
              className="top-0 p-a-sm m-a-none"
            >
              <i className="material-icons">
                mood
              </i> Recommend an Influencer
            </Button>,
            <Button
              href="/f/1"
              color="transparent"
              className="top-0 p-a-sm m-a-none"
            >
              <i className="material-icons">
                search
              </i>Search For Influencers
            </Button>
          ]}
        />
      </ListItem>
        {
          username.length !== 0 ? (
          <React.Fragment>
            {/* { Direct message to other users
              usertype === '2' && 
                <ListItem className={`${classes.listItem}`}>
                  <Button
                      href="/dm"
                      color="transparent"
                      className="top-0"
                    >
                    <i className="material-icons">
                      email
                    </i>
                  </Button>
                </ListItem>
              } */}
              <ListItem className={`${classes.listItem}`}>         
                <Link
                  className="top-15 pos-rel"
                  to={{ pathname: `/user/${username}` }}
                  onClick={(e)=> {e.preventDefault(); window.location.replace(`/user/${username}`)}} 
                >
                <img
                    src={pictureId}
                    alt={`${username}`}
                    className={`header-profile-pic`}
                  /> 
                <span className="m-h-md font-size-md font-bold info-color d-inline-block">
                  Hi, {uname}</span>
                </Link>
              </ListItem>
          </React.Fragment>
          ) :  (
            <ListItem className={`${classes.listItem}`}> 
                <Button 
                href="/login"
                color="rose" 
                size="sm"
                round
                className="top-5"
                > Login
                </Button>
              </ListItem>
            )
        }
      <ListItem className={`${classes.listItem}`}>
        {
          username.length !==0 && localStorage.getItem("token") !== null ?
          <Button
            color="rose"
            className="floatRight"
            onClick={e => {
              localStorage.clear();
              window.history.go("/dashboard")}}
            round
          >
            LogOut
          </Button>
            : ""
        }
      </ListItem>
    </List>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
