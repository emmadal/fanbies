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
import MKAlert from "components/MKAlert";

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// form validation
import * as regex from "regex";

// api call
import { loginUser } from "api";

function SignInBasic() {
  const [credential, setCredential] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const req = await loginUser(credential);
    if (!req.success) {
      setError("Please verify your Password or Email");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
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
                name="email"
                value={credential.email}
                onChange={handleChange}
                type="email"
                label="Email"
                fullWidth
                success={regex.email.test(credential.email)}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="password"
                name="password"
                label="Password"
                value={credential.password}
                onChange={handleChange}
                fullWidth
              />
            </MKBox>
            <MKBox mt={4} mb={1}>
              <MKButton
                variant="gradient"
                onClick={handleSubmit}
                color="primary"
                fullWidth
                disabled={!regex.email.test(credential.email)}
              >
                Sign in
              </MKButton>
            </MKBox>
            {error ? (
              <MKBox mt={4} mb={1}>
                <MKAlert color="error" dismissible>
                  {error}
                </MKAlert>
              </MKBox>
            ) : null}

            <MKBox mt={3} mb={1} textAlign="center">
              <MKTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MKTypography
                  component={Link}
                  to="/authentication/sign-up/cover"
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MKTypography>
              </MKTypography>
            </MKBox>
          </MKBox>
        </MKBox>
      </Card>
    </BasicLayout>
  );
}

export default SignInBasic;
