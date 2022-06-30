import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import { Link } from "react-router-dom";

// Images
import fanbiesImage from "assets/images/fanbies/fanbies_white.png";
import fanbiesImageDark from "assets/images/fanbies/fanbies_dark.png";

const FooterLogoTxt = ({ dark }) => (
  <MKTypography component={Link} to="/">
    <MKBox
      component="img"
      src={dark ? fanbiesImageDark : fanbiesImage}
      alt="fanbies logo"
      width="125px"
      position="relative"
      zIndex={1}
      display="flex"
      mx="auto"
      className="dropShadow_logo"
    />
  </MKTypography>
);

FooterLogoTxt.defaultProps = {
  dark: true,
};

FooterLogoTxt.propTypes = {
  dark: PropTypes.bool,
};

export default FooterLogoTxt;
