// Routes
import LandingPage from "views/landing-page";
import SignIn from "views/signin";
import SignUp from "views/signup";
import Admin from "views/admin";
import NoMatch from "views/404";
import FAQ from "views/faq";
import Terms from "views/terms";
import PublicProfile from "views/public-profile";
import ForgottenPassword from "views/forgotten";
import ResetPassword from "views/resetPasswordPage";

// Protected Route
import ProtectedRoute from "pageRoutes/ProtectedRoute";

const indexRoutes = [
  { route: "/faq", name: "faq", component: <FAQ /> },
  { route: "/terms", name: "terms", component: <Terms /> },
  { route: "/signup", name: "signup", component: <SignUp /> },
  { route: "/signin", name: "signin", component: <SignIn /> },
  { route: "/resetpass", name: "resetpass", component: <ResetPassword /> },
  { route: "/forgotten", name: "forgotten", component: <ForgottenPassword /> },
  { route: "/", name: "LandingPage", component: <LandingPage /> },
  {
    route: "/admin",
    name: "admin",
    component: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  { route: "/:username", name: "username", component: <PublicProfile /> },
  { route: "*", name: "nomatch", component: <NoMatch /> },
];

export default indexRoutes;
