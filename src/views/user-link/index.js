import React, { useState, useContext, useCallback, useEffect } from "react";

import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";
import Grid from "@mui/material/Grid";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

// draggable components
import DraggableList from "components/Draggable/DraggableList";
import { reorder } from "components/Draggable/helpers";

// context
import { getUserProfile, getCookie } from "api";
import AuthContext from "context/AuthContext";

const UserLink = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: "", link_ref: "", visible: false });
  const [inputLengthTitle, setInputLengthTitle] = useState(0);
  const [inputLengthURL, setInputLengthURL] = useState(0);
  const jtoken = getCookie("fanbies-token");
  const username = localStorage.getItem("fanbies-username");

  const getUserDetails = useCallback(async () => {
    const res = await getUserProfile({ username, jtoken });
    if (res.success) {
      const response = res.response[0];

      dispatch.getDetails(response);
    }
  }, [dispatch]);

  const reFreshIFrame = () => {
    const iframeEle = document.getElementById("profile-preview");
    iframeEle.contentWindow.location.reload();
  };

  useEffect(() => {
    // Fetch User details onces
    getUserDetails();
    return () => null;
  }, []);

  const generateLink = () => {
    setLoading(!loading);
    setTimeout(() => {
      state.userProfile?.custom_links.unshift({ id: String(Date.now()), ...linkForm });
      setLoading(false);
      setInputLengthTitle(0);
      setInputLengthURL(0);
      setLinkForm({ title: "", link_ref: "", visible: false });
    }, 1000);
  };

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(state.userProfile?.custom_links, source.index, destination.index);
    // dispatch here
    dispatch.updateCustomLinks(newItems);
    reFreshIFrame();
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKBox mt={5} mb={3}>
          <MKTypography variant="body2" fontWeight="bold">
            Drag and drop to rearrange box links
          </MKTypography>
        </MKBox>
        <MKButton onClick={generateLink} variant="gradient" color="primary" sx={{ marginTop: 2 }}>
          {loading ? <MKSpinner color="white" size={20} /> : "Create Your Link"}
        </MKButton>
        <MKBox mt={3}>
          {!state.userProfile?.custom_links?.length ? (
            <MKBox display="flex" alignItems="center" flexDirection="column">
              <InsertLinkOutlinedIcon sx={{ height: "3rem", width: "3rem", color: "#c9c2c5" }} />
              <MKTypography
                variant="h4"
                mb={2}
                fontWeight="bold"
                className="text__placeholder_color"
              >
                No Links.
              </MKTypography>
              <MKTypography variant="h4" fontWeight="bold" className="text__placeholder_color">
                Start with the above button.
              </MKTypography>
            </MKBox>
          ) : (
            <DraggableList
              items={state.userProfile?.custom_links}
              linkForm={linkForm}
              setLinkForm={setLinkForm}
              onDragEnd={onDragEnd}
              inputLengthTitle={inputLengthTitle}
              setInputLengthTitle={setInputLengthTitle}
              setInputLengthURL={setInputLengthURL}
              inputLengthURL={inputLengthURL}
            />
          )}
        </MKBox>
      </Grid>
    </Grid>
  );
};

export default UserLink;
