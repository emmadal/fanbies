import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

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

// api call
import { updatePassword, validateResetHash } from "api";

// validation word need for reset
const validateWord = "rand";

function RestForgotten() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setTokenValid] = useState(false);
  const { search: locationHash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // regex search matching word
    if (locationHash.search(`\\b${validateWord}\\b`) < 0) return navigate("/", { replace: true });
    let controller = new AbortController();
    const hash = locationHash?.match(/rand=(.*$)/)[1];
    (async () => {
      const res = await validateResetHash({ hash }, controller);
      if (!res?.success) {
        setTokenValid(true);
        setError(res?.message);
      } else {
        setTokenValid(false);
      }
      controller = null;
    })();
    return () => controller?.abort();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validate: (values) => {
      setError("");
      setSuccess("");
      const errors = {};
      if (values.password !== values.confirm_password) {
        errors.confirm_password = "Password doesn't match. Try again";
      }
      return errors;
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Enter your new password"),
    }),
    onSubmit: async (values) => {
      if (
        values.confirm_password === values.password &&
        locationHash.search(`\\b${validateWord}\\b`) >= 0
      ) {
        setIsLoading(!isLoading);
        const hash = locationHash?.match(/rand=(.*$)/)[1];
        const res = await updatePassword({ password: values.password, hash });
        if (!res.success) {
          setIsLoading(false);
          setError(res.message);
        } else {
          setIsLoading(false);
          setSuccess(res.message);
        }
      }
    },
    validateOnChange: true,
  });

  return (
    <>
      <BasicLayout image={bgImage}>
        <MKTypography variant="h3" mt={5} textAlign="center" fontWeight="bold" color="white" mb={3}>
          Reset your Fanbies password
        </MKTypography>
        <Card>
          <MKBox pt={4} pb={3} px={3}>
            <MKBox component="form" role="form">
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
                  disabled={!validation.values.password || isTokenValid}
                >
                  {isLoading ? <MKSpinner color="white" size={20} /> : "Reset Password"}
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

export default RestForgotten;
