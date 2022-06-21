// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Kit 2 PRO React components
// import MKBox from "components/MKBox";

// Material Kit 2 PRO React base styles
// import colors from "assets/theme/base/colors";

// Material Kit 2 PRO React helper functions
// import rgba from "assets/theme/functions/rgba";

// const { white } = colors;

function DashboardLayout({ children }) {
  return (
    <Grid container mx="auto">
      <Grid item xs={12} md={12} lg={12} sm={12}>
        {children}
      </Grid>
    </Grid>
  );
}

// Typechecking props for the BasicLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
