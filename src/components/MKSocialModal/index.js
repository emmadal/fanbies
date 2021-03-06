/* eslint-disable no-unused-expressions */
import { useState, useContext } from "react";

import PropTypes from "prop-types";

// import material components
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// Material Kit 2 React Components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import LinkModal from "components/LinkModal";

// Material Kit 2 colors
import colors from "assets/theme/base/colors";

// Social media context
import SocialMediaContext from "context/SocialMediaContext";

const { dark } = colors;

function MKSocialModal({ isOpen, title, setIsOpen }) {
  const [search, setSearch] = useState("");
  const [item, setItem] = useState({});
  const [open, setOpen] = useState(false);
  const { socialMediaLinks } = useContext(SocialMediaContext);

  const handleClose = () => setIsOpen(false);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleNext = (element) => {
    setOpen(!open);
    setItem(element);
  };

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {title}&nbsp;
        <Icon
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            cursor: "pointer",
          }}
          color="action"
          fontSize="large"
          onClick={handleClose}
        >
          close
        </Icon>
      </DialogTitle>
      <DialogContent>
        <form style={{ position: "relative" }}>
          <input
            type="text"
            name="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="inputSearch"
          />
          {search.length ? (
            <IconButton
              onClick={() => setSearch("")}
              sx={{
                position: "absolute",
                top: 15,
                bottom: 0,
                right: 5,
                margin: "auto",
              }}
            >
              <HighlightOffIcon color="action" fontSize="medium" />
            </IconButton>
          ) : null}
        </form>
        <MKBox sx={{ mt: 2, overflowY: "scroll" }} maxHeight={150}>
          {(!search.length
            ? socialMediaLinks
            : socialMediaLinks?.filter((e) =>
                e?.name?.toLowerCase()?.includes(search.toLowerCase())
              )
          ).map((e) => (
            <MKBox
              key={e.id}
              sx={{ border: `0.2px solid ${dark.main}`, cursor: "pointer" }}
              p={0.5}
              mt={1}
              mb={2}
              onClick={() => (!e?.isAdded ? handleNext(e) : "")}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
              >
                <MKBox display="flex" justifyContent="center" alignItems="center">
                  <Icon fontSize="large">{e.icon}</Icon>&nbsp; {e.name}
                </MKBox>
                {e?.isAdded ? (
                  <MKTypography fontWeight="bold" color="success" variant="body2">
                    Already added
                  </MKTypography>
                ) : (
                  <Icon fontSize="large">chevron_right</Icon>
                )}
              </Stack>
            </MKBox>
          ))}
        </MKBox>
        <LinkModal
          item={item}
          open={open}
          setOpen={setOpen}
          setIsOpen={setIsOpen}
          setSearch={setSearch}
        />
      </DialogContent>
    </Dialog>
  );
}

MKSocialModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default MKSocialModal;
