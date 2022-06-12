// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/images/fanbies_logo.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "Fanbies",
    image: logoCT,
    route: "/",
  },
  company: { name: "Fanbies" },
  socials: [],
  menus: [],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date} Fanbies by{" "}
      <MKTypography
        component="a"
        href="https://www.fanbies.com"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      >
        Fanbies
      </MKTypography>
      .
    </MKTypography>
  ),
};
