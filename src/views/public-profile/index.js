import { useCallback, useEffect, useState, useMemo } from "react";

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
import nature from "assets/theme/custom-colors/nature";
import snow from "assets/theme/custom-colors/snow";
import cheese from "assets/theme/custom-colors/cheese";
import mineral from "assets/theme/custom-colors/mineral";

// api call
import { getUserProfile, getCookie } from "api";

// @mui material components
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

function PublicProfile() {
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
  }, []);

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

  const CustomButton = styled(Button)(() => ({
    color: style?.textColor,
    backgroundColor: style?.btnBackground,
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
      case "OVERLAY":
        return {
          backgroundImage: `url(${publicProfile?.picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "inset 0 0 0 50vw rgba(0, 0, 0, 0.8)",
        };
      case "SUNSET":
        return { backgroundColor: sunset?.sunset?.background };
      case "NATURE":
        return { backgroundColor: nature?.nature?.background };
      case "SNOW":
        return { backgroundColor: snow?.snow?.background };
      case "CHEESE":
        return { backgroundColor: cheese?.cheese?.background };
      case "MINERAL":
        return { backgroundColor: mineral?.mineral?.background };
      case "BLURED":
        return {
          background: `url(${publicProfile?.picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // filter: "blur(30px)",
          height: "100%",
        };
      default:
        return { backgroundColor: dark.dark?.background };
    }
  };

  const profileLinks = (items) => {
    const links = items
      ?.filter((i) => i.visible)
      .map((i) => (
        <CustomButton
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
        </CustomButton>
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
    <MKBox sx={getTheme(publicProfile?.theme)}>
      <MKBox
        width="100%"
        className={style?.isBlur && "unblur"}
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
              <MKAvatar variant="circular" size="xxl" src={`${publicProfile?.picture}`} />
            </MKBox>
            <MKBox textAlign="center" mx={2}>
              <MKTypography variant="h4" fontWeight="bold" sx={{ color: style?.textColor }}>
                @{publicProfile?.username}
              </MKTypography>
              <MKTypography variant="button" sx={{ color: style?.textColor }}>
                {publicProfile?.name ?? ""}
              </MKTypography>
              <br />
              <MKTypography variant="body2" sx={{ color: style?.textColor }}>
                {publicProfile?.bio ?? ""}
              </MKTypography>
              {publicProfile?.active >= 1 &&
              publicProfile?.video_message_status &&
              publicProfile?.slots >= 1
                ? videoRequestButton()
                : null}
            </MKBox>
            {profileLinks(publicProfile?.custom_links)}
          </>
        )}
        <FooterLogoTxt dark={false} />
      </MKBox>
    </MKBox>
  );
}

export default PublicProfile;
