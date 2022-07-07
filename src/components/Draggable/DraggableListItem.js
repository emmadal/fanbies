/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// context
import AuthContext from "context/AuthContext";

// API call
import { deleteCustomLink, getCookie, createCustomLink, updateCustomLink } from "api";

// Regex validation
import * as regex from "regex";

const DraggableListItem = ({
  item,
  items,
  setInputLengthTitle,
  inputLengthTitle,
  inputLengthURL,
  setInputLengthURL,
  setLinks,
  index,
}) => {
  const [currLinkId, setCurrLinkId] = useState();
  const { setUser, user } = useContext(AuthContext);
  const [isTitle, setIsTitle] = useState(false);
  const [isURL, setIsURL] = useState(false);
  const data = [...items];

  const handleChange = async (i, event) => {
    if (event.target.name === "title") {
      data[i][event.target.name] = event.target.value;
      setInputLengthTitle(event.target.value.length);
      setLinks(data);
    }
    if (event.target.name === "link_ref") {
      data[i][event.target.name] = event.target.value;
      setInputLengthURL(event.target.value.length);
      setLinks(data);
    }
    if (event.target.name === "visible") {
      if (event.target.checked) {
        data[i][event.target.name] = 1;
        setLinks(data);
      } else {
        data[i][event.target.name] = 0;
        setLinks(data);
      }
    }
    // for add a custom link
    if (
      regex.url.test(item?.link_ref) &&
      item?.title.length >= 5 &&
      !item?.owner_id &&
      event.target.checked
    ) {
      const jtoken = getCookie("fanbies-token");
      const newLink = await createCustomLink({
        jtoken,
        linktitle: item.title,
        linkref: item.link_ref,
        linkvisible: 1,
      });
      if (newLink?.success) {
        setUser({ ...user, ...{ custom_links: newLink.response } });
        setInputLengthTitle(0);
        setInputLengthURL(0);
      }
    }
    // for updating
    if (Object.keys(data[i]).length && data[i]?.id === item?.id) {
      const jtoken = getCookie("fanbies-token");
      const updateLink = await updateCustomLink(jtoken, item);
      if (updateLink?.success && updateLink?.message === "updated") {
        if (updateLink?.success) {
          setUser({ ...user, ...{ custom_links: updateLink.response } });
        }
      }
    }
  };

  const addTitle = (id, key) => {
    const u = items.find((e) => e.id === id);
    if (items[key]?.id === u.id) {
      setInputLengthTitle(1);
      setCurrLinkId(u?.id);
      setIsTitle(true);
    }
  };

  const addURL = (id, key) => {
    const u = items.find((e) => e.id === id);
    if (items[key]?.id === u.id) {
      setInputLengthURL(1);
      setCurrLinkId(u?.id);
      setIsURL(true);
    }
  };

  const removeLink = async (id) => {
    const jtoken = getCookie("fanbies-token");
    const req = await deleteCustomLink({ jtoken, id });
    if (req?.success && req?.message === "deleted") {
      setUser({ ...user, ...{ custom_links: req.response } });
    }
    if (!req?.success && req?.message === "No Links.") {
      setUser({ ...user, ...{ custom_links: [] } });
    }
  };

  return (
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
          <MKBox component="form">
            <Grid container>
              <Grid item xs={9} md={9} lg={9} sm={9}>
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
                  {(isURL && currLinkId === item.id && inputLengthURL > 0) ||
                  item.link_ref.length ? (
                    <MKInput
                      onChange={(e) => handleChange(index, e)}
                      onBlur={() => setInputLengthURL(item.link_ref.length)}
                      value={item.link_ref}
                      type="text"
                      placeholder="URL"
                      variant="standard"
                      name="link_ref"
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
              </Grid>
              <Grid item xs={3} md={3} lg={3} sm={3}>
                <Stack direction="row" alignItems="flex-start" justifyContent="flex-end">
                  <Switch
                    checked={item?.visible === 1 ? true : false}
                    name="visible"
                    onChange={(e) => handleChange(index, e)}
                    title="Show/Hide custom link"
                  />
                  <IconButton color="primary" component="span" onClick={() => removeLink(item?.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </MKBox>
        </MKBox>
      )}
    </Draggable>
  );
};
export default DraggableListItem;
