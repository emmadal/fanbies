/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */

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
  currLinkId,
  isTitle,
  setInputLengthTitle,
  inputLengthTitle,
  inputLengthURL,
  setInputLengthURL,
  addURL,
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
              <MKBox sx={{ cursor: "pointer" }} onClick={() => addTitle(item.id, index)}>
                {(isTitle && currLinkId === item.id && inputLengthTitle > 0) ||
                item.title.length ? (
                  <MKInput
                    onChange={(e) => handleChange(index, e)}
                    onBlur={() => setInputLengthTitle(item.title.length)}
                    value={item.title}
                    type="text"
                    placeholder="Title"
                    variant="standard"
                    name="title"
                    InputProps={{
                      disableUnderline: true,
                      autoFocus: true,
                    }}
                    fullWidth
                  />
                ) : (
                  <MKTypography fontWeight="bold" variant="body2">
                    Title&nbsp;
                    <Icon>edit</Icon>
                  </MKTypography>
                )}
              </MKBox>
              <MKBox sx={{ cursor: "pointer" }} onClick={() => addURL(item.id, index)}>
                {(isTitle && currLinkId === item.id && inputLengthURL > 0) || item.url.length ? (
                  <MKInput
                    onChange={(e) => handleChange(index, e)}
                    onBlur={() => setInputLengthURL(item.url.length)}
                    value={item.url}
                    type="text"
                    placeholder="URL"
                    variant="standard"
                    name="url"
                    InputProps={{
                      disableUnderline: true,
                      autoFocus: true,
                    }}
                    fullWidth
                  />
                ) : (
                  <MKTypography fontWeight="bold" variant="body2">
                    URL&nbsp;
                    <Icon>edit</Icon>
                  </MKTypography>
                )}
              </MKBox>
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
