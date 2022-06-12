// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FavouriteIcon from "@mui/icons-material/Favorite";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function CenteredFooter({ company, links, socials, light }) {
  const { href, name } = company;

  const year = new Date().getFullYear();

  const renderLinks = links.map((link) => (
    <MKTypography
      key={link.name}
      component={Link}
      href={link.href}
      variant="body2"
      color={light ? "white" : "secondary"}
      fontWeight="regular"
    >
      {link.name}
    </MKTypography>
  ));

  const renderSocials = socials.map((social) => (
    <MKTypography
      key={social.link}
      component={Link}
      target="_blank"
      href={social.link}
      color={light ? "white" : "secondary"}
      fontWeight="regular"
    >
      {social.icon}
    </MKTypography>
  ));

  return (
    <MKBox component="footer" py={6}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={{ xs: 2, lg: 3, xl: 6 }}
            mb={3}
          >
            {renderLinks}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Stack display="flex" direction="row" justifyContent="center" spacing={3} mt={1} mb={3}>
            <MKTypography variant="body2">Connect with us on our socials</MKTypography>
            {renderSocials}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
          <MKTypography variant="body2" color={light ? "white" : "secondary"}>
            Copyright &copy; {year} made with <FavouriteIcon fontSize="small" /> by{" "}
            <MKTypography
              component={Link}
              href={href}
              rel="noreferrer"
              variant="body2"
              color="primary"
            >
              {name}
            </MKTypography>
            .
          </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
}

// Setting default values for the props of CenteredFooter
CenteredFooter.defaultProps = {
  company: { href: "https://www.fanbies.com/", name: "Fanbies" },
  links: [
    { href: "/terms", name: "Referral Program" },
    { href: "/terms", name: "Terms" },
    { href: "/faq", name: "FAQ" },
    { href: "/faq", name: "Articles" },
  ],
  socials: [
    { icon: <FacebookIcon fontSize="small" />, link: "https://www.facebook.com/fanbies/" },
    {
      icon: <TwitterIcon fontSize="small" />,
      link: "https://twitter.com/fanbies",
    },
    {
      icon: <InstagramIcon fontSize="small" />,
      link: "https://www.instagram.com/fanbiesofficial/",
    },
  ],
  light: false,
};

// Typechecking props for the CenteredFooter
CenteredFooter.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
  socials: PropTypes.arrayOf(PropTypes.object),
  light: PropTypes.bool,
};

export default CenteredFooter;
