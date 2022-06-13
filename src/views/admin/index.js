import { useContext } from "react";

// Authentication pages components
import DashboardLayout from "components/DashboardLayout";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// context
import AuthContext from "context/AuthContext";

// Stats page components
import DashboardNavigation from "components/DashboardNavigation";

function Admin() {
  const { user } = useContext(AuthContext);
  return (
    <DashboardLayout>
      <MKBox height="100vh">
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} lg={8} sm={8}>
            <MKBox minHeight="100vh">
              <DashboardNavigation />
            </MKBox>
          </Grid>
          <Grid item md={1} lg={1} sm={1} xs={1}>
            <Divider orientation="vertical" flexItem style={{ width: "5px" }} />
          </Grid>
          <Grid item xs={12} md={3} lg={3} sm={3}>
            <MKBox
              minHeight="100vh"
              display="flex"
              justifyContent="center"
              textAlign="center"
              position="fixed"
            >
              <MKTypography textAlign="center" fontWeight="bold" variant="h6" pt={3}>
                My Fanbies:{" "}
                <MKTypography
                  color="primary"
                  fontWeight="bold"
                  variant="button"
                  component="a"
                  href={`https://fanbies.com/${process.env.PUBLIC_URL}${user?.username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`https://fanbies.com/${process.env.PUBLIC_URL}${user?.username}`}
                </MKTypography>
              </MKTypography>
              <iframe
                className="phone phone_translate"
                height="100%"
                width="100%"
                loading="eager"
                title="john"
                src={`${process.env.PUBLIC_URL}/john`}
              />
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </DashboardLayout>
  );
}

export default Admin;
