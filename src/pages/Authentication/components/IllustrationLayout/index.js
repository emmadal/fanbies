/**
=========================================================
* Material Kit 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function IllustrationLayout({ header, title, description, illustration, position, children }) {
  return (
    <MKBox width="100%" height="100%" bgColor="white">
      <Grid container>
        <Grid item xs={12} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="100%"
            height="100vh"
            borderRadius="lg"
            backgroundRepeat="no-repeat"
            sx={{
              backgroundImage: `url(${illustration})`,
              backgroundSize: "cover",
              backgroundPosition: `${position}`,
            }}
          />
        </Grid>
        <Grid item xs={11} sm={8} md={6} lg={5} xl={4} sx={{ mx: "auto" }}>
          <MKBox display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <MKBox p={2} m={2} textAlign="center">
              {!header ? (
                <>
                  <MKBox mb={1} textAlign="center">
                    <MKTypography variant="h3" fontWeight="bold">
                      {title}
                    </MKTypography>
                  </MKBox>
                  <MKTypography variant="body2" color="text">
                    {description}
                  </MKTypography>
                </>
              ) : (
                header
              )}
            </MKBox>
            <MKBox p={3}>{children}</MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
}

// Setting default values for the props of IllustrationLayout
IllustrationLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  illustration: "",
  position: "0 0",
};

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.string,
  position: PropTypes.string,
};

export default IllustrationLayout;
