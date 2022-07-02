import React, { useState, useContext } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";
import MKDeleteModal from "components/MKDeleteModal";

// react router components
import { useNavigate } from "react-router-dom";

// import material components
import { Grid } from "@mui/material";

// context
import AuthContext from "context/AuthContext";

// api call
import { deleteAccount } from "api";

const Settings = () => {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line dot-notation
  const userId = user["rand_"];
  const navigate = useNavigate();

  const getCookieByName = (cookieName) => {
    let token;
    if (document.cookie) {
      token = document?.cookie
        .split(";")
        .find((row) => row.startsWith(`${cookieName}=`))
        .split("=")[1];
    }
    return token === undefined ? "" : token;
  };

  const deleteUserAccount = async () => {
    if (navigator.onLine) {
      setOpen(!open);
      const token = getCookieByName("fanbies-token");
      const req = await deleteAccount(token, userId);
      if (req.success) {
        setOpen(false);
        localStorage.removeItem("fanbies-username");
        document.cookie = `fanbies-token=; Max-Age=0; path=/; domain=${
          process.env.PUBLIC_URL
        };expires=${new Date().toLocaleDateString()}`;
        setOpen(false);
        navigate("/", { replace: true });
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
        document.cookie = `fanbies-token=; Max-Age=0; path=/; domain=${
          process.env.PUBLIC_URL
        };expires=${new Date().toLocaleDateString()}`;
        localStorage.removeItem("fanbies-username");
        localStorage.removeItem("fanbies-social-links");
        localStorage.removeItem("fanbies-tool-request-rates");
        navigate("/", { replace: true });
      }, 2000);
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
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
      </Grid>
    </Grid>
  );
};

export default Settings;
