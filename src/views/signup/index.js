import { useState } from "react";

// react-router-dom component
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Authentication layout components
import CoverLayout from "pages/Authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Form validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Regex validation
import * as regex from "regex";

// api call
import { registerUser } from "api";

function SignUp() {
  const [error, setError] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      confirm_password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!regex.email.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!regex.username.test(values.username)) {
        errors.username = "alphanumeric characters without space accepted";
      }
      if (values.password !== values.confirm_password) {
        errors.confirm_password = "Password doesn't match. Try again";
      }
      return errors;
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Enter a valid Email"),
      name: Yup.string().required("Enter your Name"),
      username: Yup.string().required("Enter a username"),
      password: Yup.string().required("Enter your password"),
      confirm_password: Yup.string().required("Confirm your password"),
    }),
    onSubmit: async (values) => {
      if (values.confirm_password === values.password) {
        const { confirm_password: ConfirmPassword, ...userData } = values;
        const res = await registerUser(userData);
        if (!res?.success) {
          setError(res?.message);
          return;
        }
        if (res.success) {
          window.console.log(values);
        }
      }
    },
  });
  return (
    <CoverLayout image={bgImage}>
      <Card style={{ width: "415px" }}>
        <MKBox
          variant="gradient"
          bgColor="primary"
          borderRadius="lg"
          coloredShadow="primary"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Register
          </MKTypography>
        </MKBox>
        <MKBox p={3}>
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
                name="name"
                value={validation.values.name || ""}
                onChange={validation.handleChange}
                type="text"
                label="Name"
                fullWidth
                error={!!(validation.touched.name && validation.errors.name)}
              />
              {validation.touched.name && validation.errors.name ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.name}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="email"
                value={validation.values.email || ""}
                onChange={validation.handleChange}
                type="email"
                label="Email"
                fullWidth
                error={!!(validation.touched.email && validation.errors.email)}
              />
              {validation.touched.email && validation.errors.email ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.email}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="password"
                value={validation.values.password || ""}
                onChange={validation.handleChange}
                type="password"
                label="Password"
                fullWidth
                error={!!(validation.touched.password && validation.errors.password)}
              />
              {validation.touched.password && validation.errors.password ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.password}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="confirm_password"
                value={validation.values.confirm_password || ""}
                onChange={validation.handleChange}
                type="password"
                label="Confirm Password"
                fullWidth
                error={
                  !!(validation.touched.confirm_password && validation.errors.confirm_password)
                }
              />
              {validation.touched.confirm_password && validation.errors.confirm_password ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.confirm_password}
                </MKTypography>
              ) : null}
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

            <MKBox mt={3} mb={1}>
              <MKButton
                variant="gradient"
                color="primary"
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                Register
              </MKButton>
            </MKBox>
            {error ? (
              <MKBox mt={2} mb={1}>
                <MKTypography variant="button" color="error">
                  {error}
                </MKTypography>
              </MKBox>
            ) : null}
            <MKBox mt={3} mb={1} textAlign="center">
              <MKTypography variant="button" color="text">
                Already have an account?{" "}
                <MKTypography
                  component={Link}
                  to="/signin"
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MKTypography>
              </MKTypography>
            </MKBox>
          </MKBox>
        </MKBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;
