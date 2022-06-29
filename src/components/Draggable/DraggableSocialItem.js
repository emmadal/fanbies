/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */

import { Draggable } from "react-beautiful-dnd";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

// import material components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";

const DraggableSocialItem = ({ item, index }) => (
  <Draggable draggableId={`${item.id}`} index={index}>
    {(provided, snapshot) => (
      <MKBox
        color="white"
        bgColor="white"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={snapshot.isDragging ? { background: "rgb(235,235,235)" } : ""}
        borderRadius="lg"
        shadow="lg"
        opacity={1}
        p={2}
        mt={3}
        mb={3}
        key={item.id}
      >
        <Grid container>
          <Grid item xs={9} md={9} lg={9} sm={9}>
            <MKTypography fontWeight="bold" variant="body2">
              {item?.name}
            </MKTypography>
          </Grid>
          <Grid item xs={3} md={3} lg={3} sm={3}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center">
              <Switch defaultChecked />
              <Icon sx={{ cursor: "pointer" }} fontSize="large" color="primary" onClick={() => ""}>
                mode_edit
              </Icon>
            </Stack>
          </Grid>
        </Grid>
      </MKBox>
    )}
  </Draggable>
);

export default DraggableSocialItem;
