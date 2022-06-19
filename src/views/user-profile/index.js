import React, { useContext, useState } from "react";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKAvatar from "components/MKAvatar";
import MKSpinner from "components/MKSpinner";

// import material components
import { Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

// form validation with Formik
import { useFormik } from "formik";

// context user
import AuthContext from "context/AuthContext";

// api call
import { removeProfilePicture, getCookie, getUserProfile, updateUserProfile } from "api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const removePicture = async () => {
    if (navigator.onLine) {
      setLoading2(!loading2);
      const tk = getCookie("fanbies-token");
      const req = await removeProfilePicture(tk);
      const data = {
        username: localStorage.getItem("fanbies-username") ?? "",
        jtoken: tk,
      };
      if (req.success) {
        const res = await getUserProfile(data);
        if (res.success) {
          const response = res.response[0];
          // delete token key in user object
          const { token, ...dataWithoutToken } = response;
          setLoading2(false);
          setUser(dataWithoutToken);
        }
      }
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      useremail: user?.email ?? "",
      bio: user?.bio ?? "",
      fb_id: "",
      ig_id: "",
      linkedin_id: "",
      twitter_id: "",
      tik_id: "",
    },
    onSubmit: async (values) => {
      if (type === "UPDATE_PROFILE") {
        setLoading1(!loading1);
        const { name, useremail, bio } = values;
        const jtoken = getCookie("fanbies-token");
        const req = await updateUserProfile({ name, useremail, bio, jtoken });
        if (req.success) {
          const res = await getUserProfile({
            username: localStorage.getItem("fanbies-username") ?? "",
            jtoken,
          });
          if (res.success) {
            setLoading1(false);
            const response = res.response[0];
            // delete token key in user object
            const { token, ...dataWithoutToken } = response;
            setLoading2(false);
            setUser(dataWithoutToken);
            setType("");
          }
        }
      }
      if (type === "UPDATE_SOCIAL_LINKS") {
        setLoading3(!loading3);
      }
    },
  });
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKTypography textAlign="start" mt={2} mb={2}>
          About me
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox display="flex" flexDirection="row" justifyContent="center">
            <MKBox mx={1}>
              <MKAvatar
                alt="user image"
                variant="circular"
                size="xxl"
                src={`${user?.picture}`}
                sx={{ border: "2px solid rgba(0, 0, 0, 0.05)", cursor: "pointer" }}
              />
            </MKBox>
            <MKBox mx={1} alignSelf="center">
              <MKButton
                variant="gradient"
                color="primary"
                size="small"
                sx={{ marginLeft: 1, marginRight: 1 }}
              >
                Upload an image
              </MKButton>
              <MKButton
                variant="outlined"
                color="error"
                size="small"
                sx={{ marginLeft: 1, marginRight: 1 }}
                onClick={removePicture}
              >
                {loading2 ? <MKSpinner color="error" size={20} /> : "Remove image"}
              </MKButton>
              {error ? (
                <MKBox mt={2} mb={1}>
                  <MKTypography variant="button" color="error" fontWeight="bold">
                    {error}
                  </MKTypography>
                </MKBox>
              ) : null}
            </MKBox>
          </MKBox>
          <MKBox component="form" role="form">
            <MKBox mt={2} mb={2}>
              <MKInput
                type="text"
                variant="standard"
                name="name"
                label="Name"
                value={validation.values.name}
                onChange={validation.handleChange}
                fullWidth
              />
            </MKBox>
            <MKBox mt={2} mb={2}>
              <MKInput
                type="email"
                variant="standard"
                name="useremail"
                label="Email"
                value={validation.values.useremail}
                onChange={validation.handleChange}
                error={!!(validation.touched.useremail && validation.errors.useremail)}
                fullWidth
              />
              {validation.touched.useremail && validation.errors.useremail ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.useremail}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mt={4} mb={2}>
              <MKInput
                type="text"
                multiline
                rows={3}
                maxLength={10}
                name="bio"
                label="Bio"
                value={validation.values.bio}
                onChange={validation.handleChange}
                fullWidth
                error={!!(validation.touched.bio && validation.errors.bio)}
              />
              {validation.touched.bio && validation.errors.bio ? (
                <MKTypography variant="button" color="error">
                  {validation.errors.bio}
                </MKTypography>
              ) : null}
            </MKBox>
            <MKBox mt={3}>
              <MKButton
                variant="gradient"
                onClick={(e) => {
                  e.preventDefault();
                  setType("UPDATE_PROFILE");
                  validation.handleSubmit();
                  return false;
                }}
                color="primary"
              >
                {loading1 ? <MKSpinner color="white" size={20} /> : "Save details"}
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
        <MKTypography textAlign="start" mt={2} mb={2}>
          Social media
        </MKTypography>
        <MKBox color="white" bgColor="white" borderRadius="lg" shadow="lg" opacity={1} p={2}>
          <MKBox component="form" role="form">
            <MKBox mb={2}>
              <MKInput
                name="fb_id"
                value={validation.values.fb_id || ""}
                onChange={validation.handleChange}
                type="text"
                placeholder="Facebook name"
                fullWidth
                InputProps={{
                  className: "fanbies_input_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      facebook.com/
                    </InputAdornment>
                  ),
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="ig_id"
                value={validation.values.ig_id || ""}
                onChange={validation.handleChange}
                type="text"
                placeholder="Instagram name"
                fullWidth
                InputProps={{
                  className: "fanbies_input_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      instagram.com/
                    </InputAdornment>
                  ),
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="linkedin_id"
                value={validation.values.linkedin_id || ""}
                onChange={validation.handleChange}
                type="text"
                placeholder="Linkedin name"
                fullWidth
                InputProps={{
                  className: "fanbies_input_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      linkedin.com/in/
                    </InputAdornment>
                  ),
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="twitter_id"
                value={validation.values.twitter_id || ""}
                onChange={validation.handleChange}
                type="text"
                placeholder="Twitter name"
                fullWidth
                InputProps={{
                  className: "fanbies_input_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      twitter.com/
                    </InputAdornment>
                  ),
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="tik_id"
                value={validation.values.tik_id || ""}
                onChange={validation.handleChange}
                type="text"
                placeholder="Tiktok name"
                fullWidth
                InputProps={{
                  className: "fanbies_input_placeholder",
                  startAdornment: (
                    <InputAdornment position="start" sx={{ padding: "0" }}>
                      tiktok.com/@
                    </InputAdornment>
                  ),
                }}
              />
            </MKBox>
            <MKBox mt={3}>
              <MKButton
                variant="gradient"
                onClick={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  setType("UPDATE_SOCIAL_LINKS");
                  return false;
                }}
                color="primary"
              >
                {loading3 ? <MKSpinner color="white" size={20} /> : "Save details"}
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
      </Grid>
    </Grid>
  );
};

export default Profile;
