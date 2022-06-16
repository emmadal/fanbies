import React, { useContext, useState } from "react";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// react router components
import { useNavigate } from "react-router-dom";

// import material components
import { Grid } from "@mui/material";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";

// Regex validation
import * as regex from "regex";

// form validation with Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// context user
import AuthContext from "context/AuthContext";

const Settings = () => {
  const { user } = useContext(AuthContext);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      username: "",
    },
    validate: (values) => {
      const errors = {};
      if (!regex.email.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!regex.username.test(values.username)) {
        errors.username = "alphanumeric characters without space accepted";
      }
      return errors;
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Enter a valid Email"),
      name: Yup.string().required("Enter your Name"),
      username: Yup.string().required("Enter a username"),
    }),
    onSubmit: async (values) => {
      window.console.log(values);
      setIsLoading(!isLoading);
      setError("");
    },
  });
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKTypography textAlign="start" mt={2} mb={2}>
          My account
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox component="form" role="form">
            <MKBox mt={2} mb={2}>
              <MKInput
                type="text"
                variant="standard"
                name="name"
                label="Name"
                value={validation.values?.name || user?.name}
                onChange={validation.handleChange}
                fullWidth
                error={!!(validation.touched.name && validation.errors.name)}
              />
              {validation.touched.name && validation.errors.name ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.name}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mt={2} mb={2}>
              <MKInput
                type="text"
                variant="standard"
                name="username"
                label="Username"
                value={validation.values?.username || user?.username}
                onChange={validation.handleChange}
                fullWidth
                disabled
                error={!!(validation.touched.username && validation.errors.username)}
                InputProps={{
                  className: "fanbies_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      fanbies.com/
                    </InputAdornment>
                  ),
                }}
              />
              {validation.touched.username && validation.errors.username ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.username}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mt={2} mb={2}>
              <MKInput
                type="text"
                variant="standard"
                name="email"
                label="Email"
                value={validation.values?.email || user?.email}
                onChange={validation.handleChange}
                error={!!(validation.touched.email && validation.errors.email)}
                fullWidth
              />
              {validation.touched.email && validation.errors.email ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.email}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mt={3}>
              <MKButton
                variant="gradient"
                onClick={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
                color="primary"
              >
                {isLoading ? <MKSpinner color="white" size={20} /> : "Save details"}
              </MKButton>
            </MKBox>
            {error ? (
              <MKBox mt={2} mb={1}>
                <MKTypography variant="button" color="error">
                  {error}
                </MKTypography>
              </MKBox>
            ) : null}
          </MKBox>
        </MKBox>
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
                  Reset password
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
