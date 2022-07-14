import { useContext, useCallback, useEffect } from "react";
// react-router components
import { useParams } from "react-router-dom";

import MKBox from "components/MKBox";
import MKAvatar from "components/MKAvatar";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import colors from "assets/theme/base/colors";
import rgba from "assets/theme/functions/rgba";

// api call
import { getUserProfile, getCookie } from "api";

// context
import AuthContext from "context/AuthContext";

const { primary } = colors;

function PublicProfile() {
  const { state, dispatch } = useContext(AuthContext);
  const params = useParams();
  const jtoken = getCookie("fanbies-token");
  const username = params?.username;

  const getUserDetails = useCallback(async () => {
    const res = await getUserProfile({ username, jtoken });
    if (res.success) {
      const response = res.response[0];

      dispatch.getDetails(response);
    }
  }, [dispatch]);

  useEffect(() => {
    getUserDetails();
    return () => null;
  }, []);

  const profileLinks = (items) => {
    const links = items
      ?.filter((i) => i.visible)
      .sort((prev, next) => prev?.link_order - next?.link_order)
      .map((i) => (
        <MKButton
          key={i.id}
          mb={3}
          component="a"
          href={i.link_ref}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          color="white"
          fullWidth
          size="large"
          circular
          className="link_btn"
        >
          {i.title}
        </MKButton>
      ));
    if (!links.length)
      return (
        <MKTypography my={3} variant="h6" color="white" fontWeight="bold">
          No active links at the moment.
        </MKTypography>
      );

    return links;
  };

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
        <MKAvatar variant="circular" size="xxl" src={`${state.userProfile?.picture}`} />
      </MKBox>
      <MKBox textAlign="center" mx={2}>
        <MKTypography variant="h5" color="white" fontWeight="bold">
          @{state.userProfile?.username}
        </MKTypography>
        <MKTypography variant="button" color="white">
          {state.userProfile?.bio ?? ""}
        </MKTypography>
        {profileLinks(state.userProfile?.custom_links)}
      </MKBox>
    </MKBox>
  );
}

export default PublicProfile;
