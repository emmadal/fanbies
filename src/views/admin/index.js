import { useContext } from "react";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

// context
import AuthContext from "context/AuthContext";

// Stats page components
import DashboardLayout from "components/DashboardLayout";
import DashboardNavigation from "components/DashboardNavigation";

// Images
import fanbiesLogo from "assets/images/favicon.png";

function Admin() {
  const { state } = useContext(AuthContext);
  return (
    <DashboardLayout>
      <MKBox height="100vh">
        <Grid container spacing={0}>
          <Grid item xs={12} md={1} lg={1} sm={1}>
            <MKBox
              component="div"
              justifyContent="center"
              display="flex"
              sx={{
                alignItems: "start",
                height: "100%",
                backgroundColor: "#fff",
                borderRight: "1px solid #d7ddd1",
              }}
              className="admin__sidebar"
            >
              <MKBox
                mt={2}
                component="img"
                src={fanbiesLogo}
                alt="Fanbies Logo"
                className="dropShadow_logo side-bar__logo"
                sx={{ width: "40px" }}
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} md={7} lg={7} sm={7}>
            <MKBox minHeight="100vh">
              <DashboardNavigation />
            </MKBox>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            sm={4}
            sx={{
              backgroundColor: "#fff",
              borderLeft: "1px solid #d7ddd1",
            }}
            className="dashboard_preview_panel"
          >
            <MKBox display="flex" flexDirection="column" justifyContent="center" textAlign="center">
              <MKTypography
                mb={2}
                fontWeight="bold"
                sx={{
                  borderBottom: "1px solid #d7ddd1",
                  fontSize: ".7em",
                  position: "relative",
                  paddingBottom: "10px",
                  top: "15px",
                }}
              >
                Your Link:{" "}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  underline="always"
                  href={`https://fanbies.com/${process.env.PUBLIC_URL}${state.userProfile?.username}`}
                  color="primary"
                >
                  {`https://fanbies.com/${process.env.PUBLIC_URL}${state.userProfile?.username}`}
                </Link>
              </MKTypography>
              <MKBox display="flex" textAlign="center" justifyContent="center">
                <iframe
                  className="phone phone_translate"
                  height="100%"
                  id="profile-preview"
                  width="100%"
                  loading="eager"
                  title={`${state.userProfile?.username}`}
                  src={`${process.env.PUBLIC_URL}/${state.userProfile?.username}`}
                />
              </MKBox>
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </DashboardLayout>
  );
}

export default Admin;
