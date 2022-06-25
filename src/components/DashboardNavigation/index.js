import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";

// import TabPanel from "@mui/material/TabPanel";
import MKTabPanel from "components/MKTabPanel";
import Tab from "@mui/material/Tab";

// import custom components
import Settings from "views/user-settings";
import Profile from "views/user-profile";
import UserLink from "views/user-link";
import CreatorPage from "views/creatorToolPage";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DashboardNavigation() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabType = (event, newValue) => setActiveTab(newValue);

  return (
    <Grid container item justifyContent="center" xs={12} mx="auto">
      <AppBar position="static" style={{ paddingTop: 5 }}>
        <Tabs value={activeTab} onChange={handleTabType}>
          <Tab label="Links" {...a11yProps(0)} />
          <Tab label="Profile" {...a11yProps(1)} />
          <Tab label="Creator tools" {...a11yProps(2)} />
          <Tab label="Settings" {...a11yProps(3)} />
        </Tabs>
        <MKTabPanel value={activeTab} index={0}>
          <UserLink />
        </MKTabPanel>
        <MKTabPanel value={activeTab} index={1}>
          <Profile />
        </MKTabPanel>
        <MKTabPanel value={activeTab} index={2}>
          <CreatorPage />
        </MKTabPanel>
        <MKTabPanel value={activeTab} index={3}>
          <Settings />
        </MKTabPanel>
      </AppBar>
    </Grid>
  );
}

export default DashboardNavigation;
