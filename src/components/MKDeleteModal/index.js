import PropTypes from "prop-types";

// import material components
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

// Material Kit 2 React Components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 colors
import colors from "assets/theme/base/colors";

const { light } = colors;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: light.main,
  borderRadius: 3,
  border: `1px solid ${light.main}`,
  boxShadow: 24,
  p: 4,
};

function MKDeleteModal({ isOpen, confirmDelete, title, message, cancelAction }) {
  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MKBox sx={style}>
          <MKTypography id="modal-modal-title" color="error" variant="h5" fontWeight="bold">
            {title}
          </MKTypography>
          <MKTypography
            color="dark"
            variant="subtitle2"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {message}
          </MKTypography>
          <Divider variant="fullWidth" />
          <Stack direction="row" spacing={2}>
            <MKButton variant="outlined" color="primary" onClick={() => cancelAction(false)}>
              Cancel
            </MKButton>
            <MKButton variant="gradient" color="error" onClick={confirmDelete}>
              Confirm
            </MKButton>
          </Stack>
        </MKBox>
      </Modal>
    </div>
  );
}

MKDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  cancelAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default MKDeleteModal;
