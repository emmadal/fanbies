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
      <AppBar position="static" style={{ paddingTop: 15 }}>
        <Tabs value={activeTab} onChange={handleTabType}>
          <Tab label="Links" {...a11yProps(0)} />
          <Tab label="Profile" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
        <MKTabPanel value={activeTab} index={0}>
          Links Tab
        </MKTabPanel>
        <MKTabPanel value={activeTab} index={1}>
          <Profile />
        </MKTabPanel>
        <MKTabPanel value={activeTab} index={2}>
          <Settings />
        </MKTabPanel>
      </AppBar>
    </Grid>
  );
}

export default DashboardNavigation;
