/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";

// react-router-dom component
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// user context
import AuthContext from "context/AuthContext";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";
import FooterLogoTxt from "components/utils/FooterLogoTxt";

// Authentication layout components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// @mui material components
import InputAdornment from "@mui/material/InputAdornment";

// Images
import bgImage from "assets/images/vr-bg.jpg";

// Form validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Regex validation
import * as regex from "regex";

// api call
import { registerUser } from "api";

function SignUp() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
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
      username: Yup.string()
        .matches(
          /^[a-zA-Z0-9\-_]{3,30}$/,
          "Usernames cannot be longer than 30 characters and minimum 3 characters"
        )
        .required("Enter a username"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Enter your password"),
    }),
    onSubmit: async (values) => {
      if (values.confirm_password === values.password) {
        setIsLoading(!isLoading);
        const userObject = {
          username: values.username,
          useremail: values.email,
          uname: "",
          password: values.password,
          phone: "",
        };
        const res = await registerUser(userObject);
        if (!res?.success) {
          setIsLoading(false);
          setError(res?.message);
          return;
        }
        if (res.success) {
          setIsLoading(false);
          const obj = res.response;
          // delete token key in user object
          const { token, ...dataWithoutToken } = obj;
          localStorage.setItem("fanbies-username", dataWithoutToken.username);
          document.cookie = `fanbies-token=${token}; path="/admin; Secure; SameSite=true"`;
          setUser(dataWithoutToken);
          navigate("/admin", { replace: true });
        }
      }
    },
    validateOnChange: true,
  });
  return (
    <>
      <BasicLayout image={bgImage}>
        <MKTypography variant="h3" mt={5} fontWeight="bold" color="white" mb={1}>
          Create your Fanbies page now
        </MKTypography>
        <MKTypography variant="body2" color="white">
          Join the millions of creators and business owners on Fanbies with your personal URL.
        </MKTypography>
        <MKTypography variant="caption" color="white" fontWeight="bold" textAlign="center">
          Free forever. No payment needed.
        </MKTypography>
        <Card mb={10}>
          <MKBox p={2}>
            <MKBox component="form" role="form" p={2}>
              <MKBox mb={2}>
                <MKInput
                  name="username"
                  placeholder="username"
                  value={validation.values.username || ""}
                  onChange={validation.handleChange}
                  type="text"
                  fullWidth
                  error={!!(validation.touched.username && validation.errors.username)}
                  InputProps={{
                    className: "fanbies_input_placeholder",
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
                  disabled={
                    !validation.values.username ||
                    !validation.values.email ||
                    !validation.values.password
                  }
                >
                  {isLoading ? <MKSpinner color="white" size={20} /> : "Sign up"}
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
        <FooterLogoTxt dark={false} />
      </BasicLayout>
    </>
  );
}

export default SignUp;
