// Authentication pages components
import DashboardLayout from "components/DashboardLayout";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";

// Stats page components
import DashboardNavigation from "components/DashboardNavigation";

function Admin() {
  return (
    <DashboardLayout>
      <MKBox textAlign="center">
        <DashboardNavigation />
        {/* <MKTypography variant="h4" fontWeight="medium" color="dark" mt={1}>
          Admin Dashboard
        </MKTypography> */}
      </MKBox>
    </DashboardLayout>
  );
}

export default Admin;
