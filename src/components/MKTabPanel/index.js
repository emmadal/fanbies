import * as React from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";
import Box from "@mui/material/Box";

function MKTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <MKBox>{children}</MKBox>
        </Box>
      )}
    </div>
  );
}

MKTabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default MKTabPanel;
