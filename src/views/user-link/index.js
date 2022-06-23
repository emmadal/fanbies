/* eslint-disable no-unused-vars */
import React, { useState } from "react";

// Material Kit 2 React Components
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKSpinner from "components/MKSpinner";

// import material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// draggable components
import DraggableList from "components/Draggable/DraggableList";
import { getItems, reorder } from "components/Draggable/helpers";

const UserLink = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState(getItems(10));
  // const [currLinkId, setCurrLinkId] = useState();
  // const [isTitle, setIsTitle] = useState(false);
  // const [isURL, setIsURL] = useState(false);

  const generateLink = () => {
    setLoading(!loading);
    const data = [];
    const link = {
      id: new Date().getTime(),
      title: "",
      url: "",
      isShow: false,
    };
    setTimeout(() => {
      data.unshift(link);
      setLinks([...links, ...data]);
      setLoading(false);
    }, 1000);
  };

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(items, source.index, destination.index);
    setItems(newItems);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} sm={12}>
        <MKTypography variant="body2" fontWeight="bold">
          Drag and drop to rearrange box links
        </MKTypography>
        <MKButton onClick={generateLink} sx={{ marginTop: 3 }} variant="gradient" color="primary">
          {loading ? (
            <MKSpinner color="white" size={20} />
          ) : (
            <>
              <Icon>add_plus</Icon>&nbsp; Add new link to top
            </>
          )}
        </MKButton>
        <MKBox mt={8}>
          <DraggableList items={links} onDragEnd={onDragEnd} setLinks={setLinks} />
          {/* {links.map((link, key) => (
            <MKBox
              color="white"
              bgColor="white"
              borderRadius="lg"
              shadow="lg"
              opacity={1}
              p={2}
              mt={3}
              mb={3}
              key={link.id}
            >
              <Grid container>
                <Grid item xs={9} md={9} lg={9} sm={9}>
                  <form onSubmit={onSubmit}>
                    <Stack direction="row" spacing={2}>
                      <MKBox
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ cursor: "pointer" }}
                        onClick={() => addTitle(link.id, key)}
                      >
                        <MKTypography fontWeight="bold" variant="body2">
                          Title&nbsp;
                        </MKTypography>
                        <Icon>edit</Icon>
                      </MKBox>
                      {isTitle || (link.title && currLinkId === link.id) ? (
                        <MKInput
                          onBlur={() => setIsTitle(false)}
                          onChange={(e) => handleChange(key, e)}
                          value={link.title}
                          type="text"
                          variant="standard"
                          name="title"
                          InputProps={{
                            disableUnderline: true,
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
                        onClick={() => addURL(link.id, key)}
                      >
                        <MKTypography fontWeight="bold" variant="body2">
                          URL&nbsp;
                        </MKTypography>
                        <Icon>edit</Icon>
                      </MKBox>
                      {isURL || (link.url && currLinkId === link.id) ? (
                        <MKInput
                          type="text"
                          variant="standard"
                          name="url"
                          onChange={(e) => handleChange(key, e)}
                          value={link.url}
                          InputProps={{
                            disableUnderline: true,
                            autoFocus: true,
                          }}
                          fullWidth
                          onBlur={() => setIsURL(false)}
                        />
                      ) : null}
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
                      onClick={() => removeLink(key)}
                    >
                      delete
                    </Icon>
                  </Stack>
                </Grid>
              </Grid>
            </MKBox>
          ))} */}
        </MKBox>
      </Grid>
    </Grid>
  );
};

export default UserLink;
