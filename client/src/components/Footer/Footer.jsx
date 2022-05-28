/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="http://www.soulsapp.com"
                className={classes.block}
                target="_blank"
              >
                Soulsapp
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} , made with{" "}
          <Favorite className={classes.icon} /> by{" "}
          <a
            href="http://www.soulsapp.com"
            className={aClasses}
            target="_blank"
          >
            Soulsapp
          </a>{" Connect with us on our socials "}{" "}
          <a
            color="transparent"
            href="https://www.instagram.com/fanbiesofficial/"
            target="_blank"
            className="m-a-md"
          >
            <i className={classes.socialIcons + " fab fa-instagram dark-color"} />
          </a>
          <a
            color="transparent"
            href="https://www.facebook.com/fanbies/"
            target="_blank"
            className="m-a-md"
          >
            <i className={classes.socialIcons + " fab fa-facebook dark-color"} />
          </a>
          <a  
            color="transparent"
            href="https://twitter.com/fanbies"
            target="_blank"
            className="m-a-md"
          >
            <i className={classes.socialIcons + " fab fa-twitter dark-color"} />
          </a>{" Please read our "}{" "}
          <a
            href="/articles"
            className={aClasses}
            target="_blank"
          >
            Articles
          </a>{" , "}
          <a
            href="/referral"
            className={aClasses}
            target="_blank"
          >
            Referral Program
          </a>{" , "}
          <a
            href="/terms"
            className={aClasses}
            target="_blank"
          >
            Terms and Condition
          </a>{" , "}
          <a
            href="/faq"
            className={aClasses}
            target="_blank"
          >
            FAQ
          </a>{" "}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
