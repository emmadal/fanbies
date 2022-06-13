// @mui material components
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

export default styled(CircularProgress)(({ theme, ownerState }) => {
  const { palette } = theme;
  const { color, size } = ownerState;

  // color value
  const colorValue = palette[color].main;

  return {
    color: colorValue,
    size,
  };
});
