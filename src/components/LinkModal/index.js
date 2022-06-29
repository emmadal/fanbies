/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import { useState } from "react";
import PropTypes from "prop-types";

// import material components
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

import social from "data";

function LinkModal({ item, open, setOpen, socialLinks, setSocialLinks }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLink = () => {
    setLoading(!loading);
    const arr = [];
    setTimeout(() => {
      const obj = Object.assign(item, { isAdded: true, url, isShow: true });
      arr.push(obj);
      setSocialLinks([...socialLinks, ...arr]);
      setLoading(false);
      setOpen(false);
      setUrl("");
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
          <Icon
            sx={{ cursor: "pointer" }}
            color="action"
            fontSize="large"
            onClick={() => {
              setOpen(false);
              setUrl("");
            }}
          >
            chevron_left
          </Icon>
          <MKTypography>{`Add ${item?.name} Icon`}</MKTypography>
          <Icon
            sx={{ cursor: "pointer" }}
            color="action"
            fontSize="large"
            onClick={() => {
              setOpen(false);
              setUrl("");
            }}
          >
            close
          </Icon>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <MKInput
          label={`${item?.desc}`}
          name="url"
          value={url}
          variant="filled"
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          type="text"
          placeholder={`${item?.placeholder}`}
          fullWidth
          sx={{ marginTop: 2, marginBottom: 5 }}
        />
        <MKButton
          onClick={generateLink}
          sx={{ marginBottom: 2 }}
          variant="gradient"
          color="primary"
          fullWidth
          disabled={!url.length}
        >
          {loading ? <MKSpinner color="white" size={20} /> : "Add to Fanbies"}
        </MKButton>
      </DialogContent>
    </Dialog>
  );
}

LinkModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default LinkModal;
