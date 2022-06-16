import React, { useState } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// react router components
import { useNavigate } from "react-router-dom";

// import material components
import { Grid } from "@mui/material";
import Switch from "@mui/material/Switch";

const Settings = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const toggleSwitch = () => setChecked(!checked);
  const navigate = useNavigate();

  const logOut = (e) => {
    e.preventDefault();
    if (navigator.onLine) {
      setIsLoading(!isLoading);
      setTimeout(() => {
        setIsLoading(false);
        document.cookie = `fanbies-token=; Max-Age=0; path=/; domain=${
          process.env.PUBLIC_URL
        };expires=${new Date().toLocaleDateString()}`;
        navigate("/", { replace: true });
      }, 2000);
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKBox mt={4} color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <Grid container>
            <Grid item xs={12} md={11} lg={11} sm={11}>
              <MKTypography>Enable Multi-factor authentication</MKTypography>
              <MKTypography variant="caption">
                Cover yourself with one more layer of security
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={1} lg={1} sm={1}>
              <Switch checked={checked} onChange={toggleSwitch} color="primary" />
            </Grid>
          </Grid>
        </MKBox>
        <MKTypography textAlign="start" mt={2} mb={2}>
          Action account for fanbies
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox mt={2} mb={2}>
            <MKBox display="flex" flexDirection="row">
              <MKBox mx={1}>
                <MKButton variant="gradient" color="secondary">
                  Update password
                </MKButton>
              </MKBox>
              <MKBox mx={1}>
                <MKButton variant="gradient" color="error" onClick={logOut}>
                  {isLoading ? <MKSpinner color="white" size={20} /> : "Logout"}
                </MKButton>
              </MKBox>
            </MKBox>
            {error ? (
              <MKBox mt={2} mb={1}>
                <MKTypography variant="button" color="error" fontWeight="bold">
                  {error}
                </MKTypography>
              </MKBox>
            ) : null}
          </MKBox>
        </MKBox>
        <MKTypography textAlign="start" mt={2} mb={2}>
          Danger zone
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox mb={2}>
            <MKTypography variant="button" fontWeight="bold">
              Click the button below if you would like to delete your account.
            </MKTypography>
          </MKBox>
          <MKButton variant="gradient" color="error" fullWidth>
            Delete account
          </MKButton>
        </MKBox>
      </Grid>
    </Grid>
  );
};

export default Settings;
