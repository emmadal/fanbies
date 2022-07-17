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
import { deleteCustomLink, getCookie, createCustomLink } from "api";

// Regex validation
import * as regex from "regex";

const DraggableListItem = ({
  item,
  linkForm,
  setLinkForm,
  setInputLengthTitle,
  inputLengthTitle,
  inputLengthURL,
  setInputLengthURL,
  index,
}) => {
  const [currLinkId, setCurrLinkId] = useState();
  const { state, dispatch } = useContext(AuthContext);
  const [isTitle, setIsTitle] = useState(false);
  const [isURL, setIsURL] = useState(false);
  const jtoken = getCookie("fanbies-token");

  const reFreshIFrame = () => {
    const iframeEle = document.getElementById("profile-preview");
    iframeEle.contentWindow.location.reload();
  };

  const handleChange = (event) => {
    if (state.userProfile?.custom_links[index] === item && currLinkId === index) {
      const { target } = event;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const { name } = target;
      setLinkForm({ ...linkForm, [name]: value });
      setInputLengthTitle(event.target.value.length);
      setInputLengthURL(event.target.value.length);

      // Create a new custom link
      if (target.checked && regex.url.test(linkForm?.link_ref) && linkForm?.title.length >= 3) {
        const newLink = createCustomLink({
          jtoken,
          linktitle: linkForm?.title,
          linkref: linkForm?.link_ref,
          linkvisible: 1,
        });
        if (newLink?.success) {
          dispatch.updateCustomLinks(newLink.response);
          setLinkForm({ title: "", link_ref: "", visible: false });
          setInputLengthTitle(0);
          setInputLengthURL(0);
          reFreshIFrame();
        }
      }
    }
  };

  const addTitle = (id) => {
    if (item?.id === id) {
      setCurrLinkId(index);
      setInputLengthTitle(item?.title.length || 1);
      setIsTitle(true);
    }
  };

  const addURL = (id) => {
    if (item?.id === id) {
      setCurrLinkId(index);
      setInputLengthURL(item?.link_ref.length || 1);
      setIsURL(true);
    }
  };

  const removeLink = async (id) => {
    const req = await deleteCustomLink({ jtoken, id });
    if (req?.success) {
      // dispatch
      dispatch.updateCustomLinks(req.response);
      reFreshIFrame();
    }
    if (req?.message === "No Links.") {
      setLinkForm({ title: "", link_ref: "", visible: false });
      dispatch.updateCustomLinks([]);
      reFreshIFrame();
    }
  };

  return (
    <Draggable draggableId={String(item.id)} index={index}>
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
          key={linkForm.id}
        >
          <form>
            <Grid container>
              <Grid item xs={9} md={9} lg={9} sm={9}>
                <MKBox sx={{ cursor: "pointer" }} onClick={() => addTitle(item.id)}>
                  {(isTitle && inputLengthTitle > 0 && currLinkId === index) ||
                  item?.title.length ? (
                    <MKInput
                      onChange={(e) => handleChange(e)}
                      onBlur={() =>
                        setInputLengthTitle(item?.title.length || linkForm?.title.length)
                      }
                      value={item?.title || linkForm?.title}
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
                <MKBox sx={{ cursor: "pointer" }} onClick={() => addURL(item.id)}>
                  {(isURL && inputLengthURL > 0 && currLinkId === index) || item.link_ref.length ? (
                    <MKInput
                      onChange={(e) => handleChange(e)}
                      onBlur={() =>
                        setInputLengthURL(item?.link_ref.length || linkForm.link_ref.length)
                      }
                      value={item?.link_ref || linkForm.link_ref}
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
                    checked={item?.visible === 1 || linkForm?.visible ? true : false}
                    name="visible"
                    onChange={(e) => handleChange(e)}
                    title="Show/Hide custom link"
                  />
                  <IconButton color="primary" component="span" onClick={() => removeLink(item?.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MKBox>
      )}
    </Draggable>
  );
};
export default DraggableListItem;
