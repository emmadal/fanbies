import React, { useState, useContext } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";
import MKDeleteModal from "components/MKDeleteModal";
import MKModal from "components/MKModal";
import MKInput from "components/MKInput";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";

// import material components
import { Grid } from "@mui/material";

// context
import AuthContext from "context/AuthContext";

// Form validation
import * as Yup from "yup";
import { useFormik } from "formik";

// api call
import { deleteAccount, updateUserPasswordById, getCookie } from "api";

const Settings = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMssg, setResponseMssg] = useState("");
  const [openToolSnack, setOpenToolSnack] = useState({ open: false, Transition: Fade });
  // eslint-disable-next-line dot-notation
  const { rand_: userId } = state.userProfile;

  const deleteUserAccount = async () => {
    if (navigator.onLine) {
      setOpen(!open);
      const token = getCookie("fanbies-token");
      const req = await deleteAccount(token, userId);
      if (req.success) {
        setOpen(false);
        dispatch.signOut();
      } else {
        setOpen(false);
        setError("Something went wrong. Please try again.");
      }
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };

  const logOut = (e) => {
    e.preventDefault();
    if (navigator.onLine) {
      setIsLoading(!isLoading);
      setTimeout(() => {
        setIsLoading(false);
        dispatch.signOut();
      }, 2000);
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validate: (values) => {
      const errors = {};
      if (values.password !== values.confirm_password) {
        errors.confirm_password = "Password doesn't match. Try again";
      }
      return errors;
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Enter your password"),
    }),
    onSubmit: async (values) => {
      if (values.confirm_password === values.password) {
        const token = getCookie("fanbies-token");
        const userObject = {
          password: values.password,
          uid: userId,
          jwtoken: token,
        };
        const res = await updateUserPasswordById(userObject);
        if (!res?.success) {
          setError(res?.message);
          return;
        }
        if (res.success) {
          setResponseMssg(res.message);
          setOpenToolSnack({
            open: true,
            Fade,
          });
        }
      }
    },
    validateOnChange: true,
  });

  const restRequest = async () => {
    validation.handleSubmit();

    if (!validation.isValid) return;

    setOpenResetModal(false);
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
        <MKDeleteModal
          title="Delete User"
          message="This action is irreversible. Do you want to perform this action ?"
          isOpen={open}
          confirmDelete={deleteUserAccount}
          cancelAction={setOpen}
        />
        <MKTypography textAlign="start" mt={2} mb={2}>
          Action account for fanbies
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox mt={2} mb={2}>
            <MKBox display="flex" flexDirection="column">
              <MKButton
                sx={{ maxWidth: "200px", marginBottom: "10px" }}
                variant="gradient"
                color="secondary"
                mb={2}
                onClick={() => setOpenResetModal(!open)}
              >
                Update password
              </MKButton>
              <MKButton
                variant="gradient"
                color="error"
                onClick={logOut}
                mb={2}
                size="small"
                sx={{ maxWidth: "200px", marginBottom: "10px" }}
              >
                {isLoading ? <MKSpinner color="white" size={20} /> : "Logout"}
              </MKButton>
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
          <MKButton variant="gradient" color="error" fullWidth onClick={() => setOpen(!open)}>
            Delete account
          </MKButton>
          {error ? (
            <MKBox mt={2} mb={1}>
              <MKTypography variant="button" color="error" fontWeight="bold">
                {error}
              </MKTypography>
            </MKBox>
          ) : null}
        </MKBox>
        <MKModal
          title="Reset Password"
          isOpen={openResetModal}
          confirm={restRequest}
          cancel={setOpenResetModal}
        >
          <MKBox component="form" role="form" p={2}>
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
          </MKBox>
        </MKModal>
      </Grid>
    </Grid>
  );
};

export default Settings;
