// Authentication pages components
import DashboardLayout from "components/DashboardLayout";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";

// @mui material components
import Grid from "@mui/material/Grid";

// Stats page components
import DashboardNavigation from "components/DashboardNavigation";

function Admin() {
  return (
    <DashboardLayout>
      <MKBox>
        <Grid container>
          <Grid item xs={12} md={8} lg={8} sm={8}>
            <DashboardNavigation />
          </Grid>
          <Grid item xs={12} md={4} lg={4} sm={4}>
            <MKBox width="100%" minHeight="100vh" justifyContent="center" alignItems="center">
              <iframe
                className="phone phone_translate"
                height="100%"
                width="100%"
                loading="eager"
                title="usertest"
                src={`${process.env.PUBLIC_URL}/user/usertest`}
              />
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </DashboardLayout>
  );
}

export default Admin;
