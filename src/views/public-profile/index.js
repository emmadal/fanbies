import { useContext, useCallback, useEffect, useState, useMemo } from "react";

// react-router components
import { useParams } from "react-router-dom";

import MKBox from "components/MKBox";
import MKAvatar from "components/MKAvatar";
import MKTypography from "components/MKTypography";
import MKProgressAccordion from "components/MKProgressAccordion";
import MKSpinner from "components/MKSpinner";
import rgba from "assets/theme/functions/rgba";
import FooterLogoTxt from "components/utils/FooterLogoTxt";

// Assets colors
import dark from "assets/theme/custom-colors/dark";
import colors from "assets/theme/base/colors";
import sky from "assets/theme/custom-colors/sky";
import sunset from "assets/theme/custom-colors/sunset";

// api call
import { getUserProfile, getCookie } from "api";

// @mui material components
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// context
import AuthContext from "context/AuthContext";

function PublicProfile() {
  const { state, dispatch } = useContext(AuthContext);
  const params = useParams();
  const jtoken = getCookie("fanbies-token");
  const username = params?.username;
  const [isLoading, setLoading] = useState(true);
  const [publicProfile, setPublicProfile] = useState({});
  const [style, setStyle] = useState({});

  const getUserDetails = useCallback(async () => {
    setLoading(true);
    const res = await getUserProfile({ username, jtoken });
    if (res.success) {
      const response = res.response[0];

      setPublicProfile({ ...response });
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getUserDetails();
    return () => null;
  }, []);

  useMemo(() => setStyle(JSON.parse(localStorage.getItem("FANBIES_THEME"))), []);

  const videoRequestButton = () => (
    <MKProgressAccordion
      title="Book video message"
      slots={publicProfile?.slots}
      person={publicProfile?.name}
      personUsername={username}
      amount={publicProfile?.video_message_fee}
      remarks={publicProfile?.remarks}
      getUserDetails={getUserDetails}
    />
  );

  const CustomButtom = styled(Button)(() => ({
    color: style?.textColor,
    backgroundColor: style?.backgroundColor ?? "transparent",
    borderRadius: 45,
    borderWidth: 2,
    padding: 15,
    width: "50%",
    borderColor: style?.borderColor,
    "&:hover": {
      backgroundColor: style?.btnHovered,
      color: style?.textHovered,
      borderColor: style?.borderColor,
    },
  }));

  const getTheme = (theme) => {
    switch (theme) {
      case "DARK":
        return { backgroundColor: dark.dark?.background };
      case "LIGHT":
        return { backgroundColor: colors.background?.default };
      case "SKY":
        return { backgroundColor: rgba(sky.sky?.background, 0.9) };
      case "BLURED":
        return {
          backgroundImage: `url(${state?.userProfile?.picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "inset 0 0 0 50vw rgba(0, 0, 0, 0.8)",
          // filter: "blur(47px)",
        };
      case "SUNSET":
        return { backgroundColor: sunset?.sunset?.background };
      default:
        return { backgroundColor: dark.dark?.background };
    }
  };

  const profileLinks = (items) => {
    const links = items
      ?.filter((i) => i.visible)
      .sort((prev, next) => prev?.link_order - next?.link_order)
      .map((i) => (
        <CustomButtom
          key={i.id}
          mb={3}
          component="a"
          href={i.link_ref}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          fullWidth
          size="large"
          className="link_btn"
        >
          {i.title}
        </CustomButtom>
      ));
    if (!links.length)
      return (
        <MKTypography my={3} variant="h6" fontWeight="bold">
          No active links at the moment.
        </MKTypography>
      );

    return links;
  };

  return (
    <MKBox sx={getTheme(state?.userProfile?.theme)}>
      <MKBox
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {isLoading ? (
          <MKSpinner color="white" size={50} />
        ) : (
          <>
            <MKBox mb={1}>
              <MKAvatar variant="circular" size="xxl" src={`${state.userProfile?.picture}`} />
            </MKBox>
            <MKBox textAlign="center" mx={2}>
              <MKTypography variant="h4" fontWeight="bold" color={style?.textColor ?? "light"}>
                @{state.userProfile?.username}
              </MKTypography>
              <MKTypography variant="button" color={style?.textColor ?? "light"}>
                {state.userProfile?.name ?? ""}
              </MKTypography>
              <br />
              <MKTypography variant="body2" color={style?.textColor ?? "light"}>
                {state.userProfile?.bio ?? ""}
              </MKTypography>
              {publicProfile?.active >= 1 &&
              publicProfile?.video_message_status &&
              publicProfile?.slots >= 1
                ? videoRequestButton()
                : null}
            </MKBox>
            {profileLinks(state.userProfile?.custom_links)}
          </>
        )}
      </MKBox>
      <FooterLogoTxt dark={false} />
    </MKBox>
  );
}

export default PublicProfile;
