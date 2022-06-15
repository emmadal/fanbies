// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";

function BasicLayout({ image, children }) {
  return (
    <>
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="150vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={6} lg={6} xl={5}>
            {children}
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

// Setting default values for the props of IllustrationLayout
BasicLayout.defaultProps = {
  image: "",
};

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  image: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
