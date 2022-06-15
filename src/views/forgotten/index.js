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
import MKSpinner from "components/MKSpinner";

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import fanbiesImage from "assets/images/fanbies/fanbies_white.png";
import bgImage from "assets/images/vr-bg.jpg";

// form validation with Formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Regex validation
import * as regex from "regex";

// api call
import { forgottenPassword } from "api";

function Forgotten() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validate: (values) => {
      setError("");
      setSuccess("");
      const errors = {};
      if (!regex.email.test(values.email)) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Enter a valid Email"),
    }),
    onSubmit: async (values) => {
      setIsLoading(!isLoading);
      const res = await forgottenPassword({ useremail: values.email });
      if (!res.success) {
        setIsLoading(false);
        setError(res.message);
      } else {
        setIsLoading(false);
        setSuccess(res.message);
      }
    },
    validateOnChange: true,
  });

  return (
    <>
      <BasicLayout image={bgImage}>
        <MKTypography variant="h3" mt={5} fontWeight="bold" color="white" mb={3}>
          Forgot your Fanbies password?
        </MKTypography>
        <MKTypography variant="body2" color="white" mb={2}>
          Enter the email address for your account, and we will email you a link to reset your
          password
        </MKTypography>
        <Card>
          <MKBox pt={4} pb={3} px={3}>
            <MKBox component="form" role="form">
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
                  disabled={!validation.values.email}
                >
                  {isLoading ? <MKSpinner color="white" size={20} /> : "Send reset link"}
                </MKButton>
              </MKBox>
              {error ? (
                <MKBox mt={2} mb={1}>
                  <MKTypography variant="h6" color="error">
                    {error}
                  </MKTypography>
                </MKBox>
              ) : null}
              {success ? (
                <MKBox mt={2} mb={1}>
                  <MKTypography variant="h6" color="dark">
                    {success}
                  </MKTypography>
                </MKBox>
              ) : null}
            </MKBox>
          </MKBox>
          <MKBox textAlign="center">
            <MKTypography
              component={Link}
              to="/signin"
              variant="caption"
              color="primary"
              fontWeight="medium"
              textGradient
            >
              Back to login
            </MKTypography>
          </MKBox>
        </Card>
        <MKTypography component={Link} to="/">
          <MKBox
            component="img"
            src={fanbiesImage}
            alt="fanbies logo"
            width="125px"
            position="relative"
            zIndex={1}
            display="flex"
            mx="auto"
          />
        </MKTypography>
      </BasicLayout>
    </>
  );
}

export default Forgotten;
