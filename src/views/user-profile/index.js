import React, { useContext, useState, useRef } from "react";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKAvatar from "components/MKAvatar";
import MKSocialModal from "components/MKSocialModal";
import MKSpinner from "components/MKSpinner";

// import material components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

// form validation with Formik
import { useFormik } from "formik";

// App context
import AuthContext from "context/AuthContext";
import SocialMediaContext from "context/SocialMediaContext";

// draggable components
import DraggableSocial from "components/Draggable/DraggableSocial";
import { reorder } from "components/Draggable/helpers";

// api call
import { removeProfilePicture, getCookie, uploadProfilePicture, updateUserProfile } from "api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { socialMediaLinks, setSocialMediaLinks } = useContext(SocialMediaContext);
  const [value, setValue] = React.useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [type, setType] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const ref = useRef();

  const removePicture = async () => {
    if (navigator.onLine) {
      setLoading2(!loading2);
      const tk = getCookie("fanbies-token");
      const req = await removeProfilePicture(tk);
      if (req.success) {
        setLoading2(false);
        setImageURL("");
      }
    } else {
      setError("You're offline. Please check your network connection...");
    }
  };

  const uploadPicture = () => {
    const { rand_: userId } = user;
    document.getElementById("input_file").click();
    document.getElementById("input_file").addEventListener("change", async () => {
      const data = new FormData();
      data.append("file", ref.current.files[0]);
      data.append("id", userId);
      if (navigator.onLine) {
        setLoading3(!loading3);
        const res = await uploadProfilePicture(data);
        if (res.success) {
          setLoading3(false);
          setImageURL(res.response);
        }
      } else {
        setLoading3(false);
        setError("You're offline. Please check your network connection...");
      }
    });
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
          setType("");
          setLoading1(false);
          const iframeEle = document.getElementById("profile-preview");
          iframeEle.contentWindow.location.reload();
        }
      }
      if (type === "UPDATE_SOCIAL_LINKS") {
        setLoading3(!loading3);
      }
    },
  });

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(socialMediaLinks, source.index, destination.index);
    setSocialMediaLinks(newItems);
  };

  const handleOpen = () => setIsOpen(!isOpen);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Grid container>
      <MKSocialModal title="Add social link" setIsOpen={setIsOpen} isOpen={isOpen} />
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
                src={imageURL.length ? imageURL : user?.picture}
                sx={{ border: "2px solid rgba(0, 0, 0, 0.05)", cursor: "pointer" }}
              />
            </MKBox>
            <MKBox mx={1} alignSelf="center">
              <Stack direction="row" spacing={2}>
                <input type="file" accept="image/*" id="input_file" ref={ref} hidden />
                <MKButton
                  variant="outlined"
                  color="primary"
                  onClick={uploadPicture}
                  size="large"
                  iconOnly
                  className="border-none"
                >
                  <FileUploadOutlinedIcon />
                  {loading3 && <MKSpinner color="info" size={20} />}
                </MKButton>
                <MKButton
                  iconOnly
                  variant="outlined"
                  color="error"
                  size="large"
                  className="border-none"
                  onClick={removePicture}
                >
                  <DeleteForeverOutlinedIcon />
                  {loading2 && <MKSpinner color="error" size={20} />}
                </MKButton>
              </Stack>

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
          <MKBox>
            <MKTypography textAlign="start" mb={2} variant="body2">
              Display links to your email, social profiles, and more on your Fanbies.
            </MKTypography>
            <MKBox mb={2}>
              <MKButton variant="gradient" onClick={handleOpen} color="primary" fullWidth mb={2}>
                Add Link
              </MKButton>
            </MKBox>
            <MKTypography textAlign="start" variant="body2">
              Reorder links by dragging
            </MKTypography>
            <MKBox mt={2}>
              <DraggableSocial onDragEnd={onDragEnd} />
            </MKBox>
            <MKBox mt={2}>
              <MKTypography textAlign="start" variant="body2" fontWeight="bold">
                Position
              </MKTypography>
              <MKTypography textAlign="start" variant="button">
                Positionning social media at the :
              </MKTypography>
              <MKBox>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="top" control={<Radio />} label="Top" />
                    <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
                  </RadioGroup>
                </FormControl>
              </MKBox>
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
