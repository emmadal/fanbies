import { useContext } from "react";

// react-router-dom components
// import { useParams } from "react-router-dom";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKAvatar from "components/MKAvatar";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 PRO React base styles
import colors from "assets/theme/base/colors";

// Material Kit 2 PRO React helper functions
import rgba from "assets/theme/functions/rgba";

// context
import AuthContext from "context/AuthContext";

const { primary } = colors;
const links = [
  { id: 1, name: "Twitter", url: "https://twitter.com" },
  { id: 2, name: "Facebook", url: "https://facebook.com" },
  { id: 3, name: "Tiktok", url: "https://vm.tiktok.com" },
];

function PublicProfile() {
  const { user } = useContext(AuthContext);

  // const { username } = useParams();
  return (
    <MKBox
      width="100%"
      height="100vh"
      sx={{
        backgroundColor: rgba(primary.main, 1),
      }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <MKBox mb={1}>
        <MKAvatar variant="circular" size="xxl" src={`${user?.picture}`} />
      </MKBox>
      <MKBox textAlign="center" mx={2}>
        <MKTypography variant="h5" color="white" fontWeight="bold">
          @{user?.username}
        </MKTypography>
        <MKTypography variant="button" color="white">
          Biography
        </MKTypography>
        {links.map((link) => (
          <MKButton
            key={link.name}
            sx={{ marginBottom: "10px", marginTop: "10px" }}
            component="a"
            href={link.url}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            color="white"
            fullWidth
            size="large"
            circular
          >
            {link.name}
          </MKButton>
        ))}
      </MKBox>
    </MKBox>
  );
}

export default PublicProfile;
