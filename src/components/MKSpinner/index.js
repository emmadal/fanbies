import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MKSpinner
import MKSpinnerRoot from "components/MKSpinner/MKSpinnerRoot";

const MKSpinner = forwardRef(({ color, size }, ref) => (
  <MKSpinnerRoot ref={ref} ownerState={{ color, size }} size={size} />
));

MKSpinner.propTypes = {
  color: PropTypes.oneOf([
    "inherit",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text",
    "white",
  ]).isRequired,
  size: PropTypes.number.isRequired,
};

export default MKSpinner;
