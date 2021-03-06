import React, { useState, useContext } from "react";

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
import MKModal from "components/MKModal";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";

// context user
import AuthContext from "context/AuthContext";

// api call
import { updateRequestForm, getCookie, getUserProfile, askVerifyRequestTool } from "api";

const CreatorToolPage = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [shoutoutSlot, setShoutoutSlot] = useState(state.userProfile.slots ?? 0);
  const [shoutoutRate, setShoutoutRate] = useState(state.userProfile.video_message_fee ?? ["5"]);
  const [loading, setLoading] = useState(false);
  const [openToolSnack, setOpenToolSnack] = useState({ open: false, Transition: Fade });
  const [responseMssg, setResponseMssg] = useState("");
  const [activeShoutout, setShoutoutStatus] = useState(
    Boolean(state.userProfile.video_message_status) ?? false
  );
  const [remarks, setRemarks] = useState(state.userProfile.remarks ?? "");
  const [open, setOpen] = useState(false);
  const jtoken = getCookie("fanbies-token");
  const username = localStorage.getItem("fanbies-username");
  const appVideoMessageRate = JSON.parse(state.fanbiesMessageToolrates);

  const handleShoutoutStatus = () => setShoutoutStatus(!activeShoutout);
  const handleRemarksChange = (e) => setRemarks(e.target.value);
  const handleShoutoutRateChange = (e) => setShoutoutRate(e.target.value);

  const handleShoutoutSlotChange = (e) => {
    const value = e?.target.value;
    if (value <= 0) {
      setShoutoutSlot(0);
      return;
    }
    if (value > 50) {
      setShoutoutSlot(50);
      return;
    }
    setShoutoutSlot(Number(value));
  };

  // Get latest user profile
  // const getUserDetails = () => {
  //   getUserProfile({ username, jtoken }).then((res) => {
  //     const response = res.response[0];
  //     // delete token key in user object
  //     const { token, ...dataWithoutToken } = response;
  //     setUser(dataWithoutToken);
  //   });
  // };

  // Submit Request Form
  const handleRequestFormSubmit = async () => {
    setLoading(true);
    const requestFormObj = {
      jtoken,
      slots: shoutoutSlot,
      shoutrate: shoutoutRate,
      status: activeShoutout,
      remarks,
    };

    const res = await updateRequestForm(requestFormObj);
    if (res?.success) {
      setTimeout(async () => {
        // dispatch
        const resDetails = await getUserProfile({ username, jtoken });
        if (resDetails.success) {
          const response = resDetails.response[0];

          dispatch.getDetails(response);
        }
        setLoading(false);
      }, 1000);
    }
  };

  const verifyRequest = async () => {
    setOpen(false);
    const res = await askVerifyRequestTool(jtoken);

    setResponseMssg(res.message);
    setOpenToolSnack({
      open: true,
      Fade,
    });
  };

  const handleClose = () => {
    setOpenToolSnack({
      ...openToolSnack,
      open: false,
    });
    setResponseMssg("");
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <Snackbar
          open={openToolSnack.open}
          onClose={handleClose}
          TransitionComponent={openToolSnack.Transition}
          message={responseMssg}
          className="snackBar_container"
        />
        <MKModal
          title="Get paid and have fun recording video shoutout messages"
          isOpen={open}
          confirm={verifyRequest}
          cancel={setOpen}
        >
          <MKTypography variant="text" textAlign="start" mt={2} mb={2}>
            By been a verified user on Fanbies and unlocking this tool, your fans will have access
            to requesting a paid direct video message from you. You set your price and availability.
            Earn while you make your fans happy
          </MKTypography>
        </MKModal>
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
          container
          sx={{ marginBottom: "10px" }}
          className="badge__element"
        />
        {state.userProfile.usertype < 1 && (
          <Icon fontSize="small" color="action" className="icon__paragraph">
            lockoutlined
          </Icon>
        )}
        <MKBox
          color="white"
          bgColor="white"
          borderRadius="lg"
          shadow="lg"
          position="relative"
          opacity={1}
          p={2}
        >
          {state.userProfile.usertype < 1 ? (
            <MKBox component="div" className="unlock_overlay ripple" onClick={() => setOpen(!open)}>
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
                    disabled={state.userProfile.usertype < 1}
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
                  name="shoutoutslot"
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
                  name="shoutoutrate"
                  onChange={handleShoutoutRateChange}
                  className="width-100"
                  SelectProps={{
                    className: "fanbies_input_custom_v1",
                  }}
                >
                  {appVideoMessageRate?.map((option) => (
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
                  name="remarks"
                  label="Remarks / Charity You Support (optional)"
                  fullWidth
                  value={remarks}
                  onChange={handleRemarksChange}
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
              <MKButton onClick={handleRequestFormSubmit} variant="gradient" color="primary">
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
