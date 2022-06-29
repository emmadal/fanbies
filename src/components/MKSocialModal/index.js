/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";

import PropTypes from "prop-types";

// import material components
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";

// Material Kit 2 React Components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import LinkModal from "components/LinkModal";

// Material Kit 2 colors
import colors from "assets/theme/base/colors";

const { dark } = colors;

const inputSearch = {
  bgcolor: dark.main,
  borderRadius: 20,
  border: `1px solid ${dark.main}`,
  boxShadow: 24,
  padding: 12,
  marginTop: 15,
  width: "100%",
};

function MKSocialModal({ isOpen, title, data, setIsOpen, socialLinks, setSocialLinks }) {
  const [search, setSearch] = useState("");
  const [link, setLink] = useState();
  const [open, setOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleNext = (item) => {
    setOpen(!open);
    setLink(item);
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
        <input
          type="text"
          name="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          style={inputSearch}
        />
        <MKBox sx={{ mt: 2, overflowY: "scroll" }} maxHeight={150}>
          {(search === ""
            ? data
            : data?.filter((e) => e?.name?.toLowerCase()?.includes(search.toLowerCase()))
          ).map((item) => (
            <MKBox
              key={item.id}
              sx={{ border: `0.2px solid ${dark.main}`, cursor: "pointer" }}
              p={0.5}
              mt={1}
              mb={2}
              onClick={() => handleNext(item)}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
              >
                <MKBox display="flex" justifyContent="center" alignItems="center">
                  <Icon fontSize="large">{item.icon}</Icon>&nbsp; {item.name}
                </MKBox>
                {item?.isAdded ? (
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
          item={link}
          open={open}
          setOpen={setOpen}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
        />
      </DialogContent>
    </Dialog>
  );
}

MKSocialModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};

export default MKSocialModal;
