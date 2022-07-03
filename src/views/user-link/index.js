import React, { useState } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// import material components
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

// draggable components
import DraggableList from "components/Draggable/DraggableList";
import { reorder } from "components/Draggable/helpers";

const UserLink = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [inputLengthTitle, setInputLengthTitle] = useState(0);
  const [inputLengthURL, setInputLengthURL] = useState(0);

  const generateLink = () => {
    setLoading(!loading);
    const data = [];
    const link = {
      id: new Date().getTime(),
      title: "",
      url: "",
      isShow: false,
    };
    setTimeout(() => {
      data.unshift(link);
      setLinks([...links, ...data]);
      setLoading(false);
      setInputLengthTitle(0);
      setInputLengthURL(0);
    }, 1000);
  };

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(links, source.index, destination.index);
    setLinks(newItems);
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
          {loading ? (
            <MKSpinner color="white" size={20} />
          ) : (
            <>
              <AddOutlinedIcon />
              Custom Link
            </>
          )}
        </MKButton>
        <MKBox mt={3}>
          {!links.length ? (
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
              items={links}
              onDragEnd={onDragEnd}
              setLinks={setLinks}
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
