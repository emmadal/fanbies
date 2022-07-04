import PropTypes from "prop-types";

// import material components
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
// @mui material components
import Grid from "@mui/material/Grid";

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
  bgcolor: light.main,
  borderRadius: 3,
  border: `1px solid ${light.main}`,
  boxShadow: 24,
  p: 4,
  minWidth: "480px",
};

function MKModal({ isOpen, confirm, title, children, cancel }) {
  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MKBox sx={style}>
          <MKTypography id="modal-modal-title" variant="h5" fontWeight="bold" mb={2}>
            {title}
          </MKTypography>
          <Grid container mx="auto">
            <Grid item xs={12} md={12} lg={12} sm={12}>
              {children}
            </Grid>
          </Grid>
          <Divider variant="fullWidth" />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <MKButton variant="outlined" color="secondary" onClick={() => cancel(false)}>
              Cancel
            </MKButton>
            <MKButton variant="gradient" color="primary" onClick={confirm}>
              Confirm
            </MKButton>
          </Stack>
        </MKBox>
      </Modal>
    </div>
  );
}

MKModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MKModal;
