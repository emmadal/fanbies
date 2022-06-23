/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

// Material Kit 2 React Components
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

// import material components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";

const DraggableListItem = ({
  item,
  index,
  removeLink,
  handleChange,
  addTitle,
  setIsTitle,
  setCurrLinkId,
  currLinkId,
  isTitle,
}) => (
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
            <form>
              <Stack direction="row" spacing={2}>
                <MKBox
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() => addTitle(item.id, index)}
                >
                  <MKTypography fontWeight="bold" variant="body2">
                    Title&nbsp;
                  </MKTypography>
                  <Icon>edit</Icon>
                </MKBox>
                {isTitle || (item.title && currLinkId === item.id) ? (
                  <MKInput
                    onBlur={() => ""}
                    onChange={(e) => handleChange(index, e)}
                    type="text"
                    variant="standard"
                    name="title"
                    InputProps={{
                      disableUnderline: true,
                      autoFocus: true,
                    }}
                    fullWidth
                  />
                ) : null}
              </Stack>
              <Stack direction="row" spacing={2}>
                <MKBox
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() => ""}
                >
                  <MKTypography fontWeight="bold" variant="body2">
                    URL&nbsp;
                  </MKTypography>
                  <Icon>edit</Icon>
                </MKBox>
                <MKInput
                  type="text"
                  variant="standard"
                  name="url"
                  onChange={(e) => handleChange(index, e)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  fullWidth
                  onBlur={() => ""}
                />
              </Stack>
            </form>
          </Grid>
          <Grid item xs={3} md={3} lg={3} sm={3}>
            <Stack direction="row" alignItems="flex-start" justifyContent="flex-end">
              <Switch />
              <Icon
                sx={{ cursor: "pointer" }}
                fontSize="large"
                color="primary"
                onClick={() => removeLink(index)}
              >
                delete
              </Icon>
            </Stack>
          </Grid>
        </Grid>
      </MKBox>
    )}
  </Draggable>
);

export default DraggableListItem;
