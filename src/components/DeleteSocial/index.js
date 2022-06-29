import React, { useState } from "react";
import PropTypes from "prop-types";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// import material components
import Icon from "@mui/material/Icon";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

// fake data
import social from "data";

const DeleteSocial = ({ open, item, setOpen }) => {
  const [url, setUrl] = useState(item?.url || "");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const handleChange = (e) => setUrl(e.target.value);

  const handleSave = () => {
    const arr = [];
    setLoading(!loading);
    setTimeout(() => {
      arr.push(Object.assign(item, { url }));
      setLinks([...social, ...links]);
      setLoading(false);
      setOpen(false);
    }, 1000);
  };

  const handleRemove = () => {
    const arr = [];
    setLoading2(!loading2);
    setTimeout(() => {
      arr.push(Object.assign(item, { isAdded: false, url: "" }));
      setLinks([...social, ...links]);
      setLoading2(false);
      setOpen(false);
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
        Edit {item?.name} Link
        <Icon
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            cursor: "pointer",
          }}
          color="action"
          fontSize="large"
          onClick={() => setOpen(false)}
        >
          close
        </Icon>
      </DialogTitle>
      <DialogContent>
        <MKInput
          type="text"
          value={url}
          variant="standard"
          name="url"
          fullWidth
          onChange={handleChange}
        />
        <MKButton
          onClick={(e) => {
            e.preventDefault();
            handleSave();
          }}
          sx={{ marginTop: 3 }}
          variant="gradient"
          color="primary"
          fullWidth
        >
          {loading ? <MKSpinner color="white" size={20} /> : "Save"}
        </MKButton>
        <MKButton
          onClick={(e) => {
            e.preventDefault();
            handleRemove();
          }}
          sx={{ marginTop: 3 }}
          variant="outlined"
          color="primary"
          fullWidth
        >
          {loading2 ? <MKSpinner color="primary" size={20} /> : "Remove Link"}
        </MKButton>
      </DialogContent>
    </Dialog>
  );
};

DeleteSocial.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
    desc: PropTypes.string,
    placeholder: PropTypes.string,
    url: PropTypes.string,
    isAdded: PropTypes.bool,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default DeleteSocial;
