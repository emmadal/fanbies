import React, { useState, useEffect, useContext } from "react";

import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import Icon from "@mui/material/Icon";
import MKSpinner from "components/MKSpinner";
import MKBadge from "components/MKBadge";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// context user
import AuthContext from "context/AuthContext";

// api call
// import { getCookie } from "api";

const CreatorToolPage = () => {
  const { user, appVideoMessageRate } = useContext(AuthContext);
  const [shoutoutSlot, setShoutoutSlot] = useState(user?.slots ?? 0);
  const [shoutoutRate, setShoutoutRate] = useState(user?.video_message_fee ?? "5");
  const [loading, setLoading] = useState(false);
  const [activeShoutout, setShoutoutStatus] = useState(user?.video_message_status ?? false);

  const handleShoutoutStatus = () => setShoutoutStatus(!activeShoutout);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleShoutoutRateChange = (e) => {
    setShoutoutRate(e.target.value);
  };

  const handleShoutoutSlotChange = (e) => {
    setShoutoutSlot(e.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKTypography variant="h5" textAlign="start" mt={2} mb={2}>
          Monetise Your Page
        </MKTypography>
        <MKTypography variant="body2" textAlign="start" mb={4}>
          Add the available Fanbies creator tools to montise your page as an influencer / creator;
          earn to grow your Fan base worldwide.
        </MKTypography>
        <MKBadge
          badgeContent="Accept video shoutout request from your fans"
          variant="contained"
          color="success"
          container
          sx={{ marginBottom: "6px" }}
        />
        <Icon fontSize="small" color="action" className="icon__paragraph">
          lockoutlined
        </Icon>
        <MKBox
          color="white"
          bgColor="white"
          borderRadius="lg"
          shadow="lg"
          position="relative"
          opacity={1}
          p={2}
        >
          {user?.usertype < 1 ? (
            <MKBox
              component="div"
              className="unlock_overlay ripple"
              onClick={() => console.log("Modal Open To Confirm")}
            >
              <MKTypography variant="h5" color="white" className="overlay__message">
                Unlock tool by requesting to be a verified user
                <Icon fontSize="small" color="white" className="icon__paragraph">
                  lockoutlined
                </Icon>
              </MKTypography>
            </MKBox>
          ) : null}
          <MKBox component="form" role="form">
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} sm={12}>
                <MKBox display="flex" alignItems="center" ml={-1} my={1}>
                  <Switch
                    disabled={user?.usertype < 1}
                    checked={activeShoutout}
                    onChange={handleShoutoutStatus}
                  />
                  <MKTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleShoutoutStatus}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Activate Shoutout Tool
                  </MKTypography>
                </MKBox>
              </Grid>
              <Grid item xs={12} md={6} lg={6} sm={6}>
                <MKInput
                  type="number"
                  variant="outlined"
                  value={shoutoutSlot}
                  onChange={handleShoutoutSlotChange}
                  label="Your Available slots?"
                  fullWidth
                  className="m-b-lg fanbies_mk_input_v1"
                  InputProps={{
                    className: "fanbies_input_custom_v1",
                    inputProps: {
                      min: 0,
                      max: 50,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sm={6}>
                <TextField
                  select
                  label="Amount you charge per request?"
                  value={shoutoutRate}
                  onChange={handleShoutoutRateChange}
                  className="width-100"
                  SelectProps={{
                    className: "fanbies_input_custom_v1",
                  }}
                >
                  {appVideoMessageRate.map((option) => (
                    <MenuItem key={`${option}-rate`} value={option}>
                      $ {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={12} lg={12} sm={12}>
                <MKInput
                  type="text"
                  variant="outlined"
                  name="name"
                  label="Charity You Support (optional)"
                  fullWidth
                  className="m-b-lg fanbies_mk_input_v1"
                  InputProps={{
                    className: "fanbies_input_custom_v1",
                    inputProps: {
                      min: 0,
                      max: 50,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <MKBox mt={3}>
              <MKButton variant="gradient" color="primary">
                {loading ? <MKSpinner color="white" size={20} /> : "Update"}
              </MKButton>
            </MKBox>
          </MKBox>
        </MKBox>
      </Grid>
    </Grid>
  );
};

export default CreatorToolPage;