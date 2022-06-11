import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// form validation with Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// api call
import { loginUser } from "api";

function SignIn() {
  const [error, setError] = useState("");
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
      const res = await loginUser(values);
      if (!res.success) {
        setError("Invalid username and/or password");
      }
      // Redirect on user profile after signin. if success and remove error message
    },
  });

  return (
    <BasicLayout image={bgImage}>
      <Card style={{ width: "415px" }}>
        <MKBox
          variant="gradient"
          bgColor="primary"
          borderRadius="lg"
          coloredShadow="primary"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MKTypography>
        </MKBox>
        <MKBox pt={4} pb={3} px={3}>
          <MKBox component="form" role="form">
            <MKBox mb={2}>
              <MKInput
                name="username"
                value={validation.values.username || ""}
                onChange={validation.handleChange}
                type="text"
                label="fanbies.com/Username"
                fullWidth
                error={!!(validation.touched.username && validation.errors.username)}
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
                  to="/terms-conditions"
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  textGradient
                >
                  terms & conditions
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
                Sign in
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
  );
}

export default SignIn;
