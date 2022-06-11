// Routes
import LandingPage from "views/landing-page";
import SignIn from "views/signin";
import SignUp from "views/signup";
import Admin from "views/admin";
import NoMatch from "views/404";

const indexRoutes = [
  { route: "/signup", name: "signup", component: <SignUp /> },
  { route: "/signin", name: "signin", component: <SignIn /> },
  { route: "/", name: "LandingPage", component: <LandingPage /> },
  { route: "/admin", name: "admin", component: <Admin /> },
  { route: "*", name: "signin", component: <NoMatch /> },
];

export default indexRoutes;
