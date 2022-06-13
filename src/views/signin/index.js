import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";
import DefaultNavbar from "molecules/Navbars/DefaultNavbar";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// form validation with Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// api call
import { loginUser } from "api";

function SignIn() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please enter a valid username"),
    }),
    onSubmit: async (values) => {
      setIsLoading(!isLoading);
      const res = await loginUser(values);
      if (!res.success) {
        setIsLoading(false);
        setError("Invalid username and/or password");
      } else {
        // Redirect on user profile after signin. if success and remove error message
        window.console.log(res);
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <DefaultNavbar
        routes={[]}
        sticky
        transparent
        light
        action={{ type: "internal", route: "/signup", label: "Sign Up Free", color: "primary" }}
      />
      <BasicLayout image={bgImage}>
        <MKTypography variant="h2" fontWeight="medium" color="white" mb={3}>
          Log in to your Fanbies
        </MKTypography>
        <Card>
          <MKBox pt={4} pb={3} px={3}>
            <MKBox component="form" role="form">
              <MKBox mb={2}>
                <MKInput
                  name="username"
                  value={validation.values.username || ""}
                  onChange={validation.handleChange}
                  type="text"
                  placeholder="username"
                  fullWidth
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
              <MKBox mb={2}>
                <MKInput
                  type="password"
                  name="password"
                  label="Password"
                  value={validation.values.password || ""}
                  onChange={validation.handleChange}
                  fullWidth
                />
              </MKBox>
              <MKBox textAlign="center">
                <MKTypography variant="button">
                  By clicking on sign up, you agree to{" "}
                  <MKTypography
                    component={Link}
                    to="/terms"
                    variant="button"
                    color="primary"
                    fontWeight="medium"
                    textGradient
                  >
                    terms &amp; conditions
                  </MKTypography>
                </MKTypography>
              </MKBox>

              <MKBox textAlign="center">
                <MKTypography variant="caption">
                  Please check spam email for registration details from the Fanbies Team
                </MKTypography>
              </MKBox>
              <MKBox mt={2} mb={1}>
                <MKButton
                  variant="gradient"
                  onClick={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  color="primary"
                  fullWidth
                >
                  {isLoading ? <MKSpinner color="white" size={20} /> : "Sign in"}
                </MKButton>
              </MKBox>
              {error ? (
                <MKBox mt={2} mb={1}>
                  <MKTypography variant="button" color="error">
                    {error}
                  </MKTypography>
                </MKBox>
              ) : null}

              <MKBox mb={1} textAlign="center">
                <MKTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MKTypography
                    component={Link}
                    to="/signup"
                    variant="button"
                    color="primary"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MKTypography>
                </MKTypography>
              </MKBox>
              <MKBox mb={1} textAlign="center">
                <MKTypography
                  component={Link}
                  to="/reset-password"
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  textGradient
                >
                  Forget Password ?
                </MKTypography>
              </MKBox>
            </MKBox>
          </MKBox>
        </Card>
      </BasicLayout>
    </>
  );
}

export default SignIn;
