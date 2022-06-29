import React, { useState } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSocialModal from "components/MKSocialModal";
import MKSpinner from "components/MKSpinner";

// import material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// draggable components
import DraggableList from "components/Draggable/DraggableList";
import DraggableSocial from "components/Draggable/DraggableSocial";
import { reorder } from "components/Draggable/helpers";

// fake data
import social from "data";

const UserLink = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [inputLengthTitle, setInputLengthTitle] = useState(0);
  const [inputLengthURL, setInputLengthURL] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      handleClose(true);
    }, 1000);
  };

  const handleOpen2 = () => setIsOpen(!isOpen);

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(links, source.index, destination.index);
    setLinks(newItems);
  };

  return (
    <Grid container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          Add new link
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText id="alert-dialog-description">
            Choose the type of link you want to add.
          </DialogContentText>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: 2 }}
            alignItems="center"
            justifyContent="center"
          >
            <MKButton onClick={generateLink} variant="gradient" color="primary">
              {loading ? (
                <MKSpinner color="white" size={20} />
              ) : (
                <>
                  <Icon>add_plus</Icon>&nbsp; Custom Link
                </>
              )}
            </MKButton>
            <MKButton variant="gradient" color="primary" onClick={handleOpen2}>
              Social Link
            </MKButton>
          </Stack>
        </DialogContent>
        <MKSocialModal
          title="Add social link"
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          data={social}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
        />
      </Dialog>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKTypography variant="body2" fontWeight="bold">
          Drag and drop to rearrange box links
        </MKTypography>
        <MKButton onClick={handleOpen} sx={{ marginTop: 3 }} variant="gradient" color="primary">
          <Icon>add_plus</Icon>&nbsp; Add new link
        </MKButton>
        <MKBox mt={8}>
          <DraggableList
            items={links}
            onDragEnd={onDragEnd}
            setLinks={setLinks}
            inputLengthTitle={inputLengthTitle}
            setInputLengthTitle={setInputLengthTitle}
            setInputLengthURL={setInputLengthURL}
            inputLengthURL={inputLengthURL}
          />
          <DraggableSocial socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
        </MKBox>
      </Grid>
    </Grid>
  );
};

export default UserLink;
