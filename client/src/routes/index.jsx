import LandingPage from "views/LandingPage/LandingPage.jsx";
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import Request from "views/CustomerForm/Request.jsx";
import VideoRequest from "views/CustomerForm/VideoRequest.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import RegisterPage from "views/RegisterPage/RegisterPage.jsx";
import ConfirmRequest from "views/CustomerForm/ConfirmRequest.jsx";
import Join from "views/CustomerForm/Join.jsx";
import Recommend from "views/CustomerForm/Recommend.jsx";
import TandC from "views/CustomerForm/TermsandCondition";
import FAQ from "views/CustomerForm/faq";
import EmailSent from "views/CustomerForm/EmailSent.jsx";
import SearchPage from "views/SearchPage/SearchPage.jsx";
import ProfileSetting from "views/ProfilePage/ProfileSetting.jsx";
import Forgotten from "views/LoginPage/Forgotten.jsx";
import ResetPass from "views/LoginPage/Resetpass.jsx";
import Fulfillment from "views/RequestPage/StartRec.jsx";
import SuccessRequest from "views/Payment/Success.jsx";
import ErrorPayment from "views/Payment/Failed.jsx";
import PendingRequest from "views/CustomerForm/PendingRequest.jsx";
import CompletedRequest from "views/CustomerForm/CompletedRequest.jsx";
import CompletedVideoRequest from "views/CustomerForm/CompletedVideoRequest.jsx";
import ClaimPage from "views/CustomerForm/ClaimPage.jsx";
import Referral from "views/CustomerForm/Referral.jsx";
import DirectMessage from "views/ProfilePage/DirectMessage";
import Conversations from "views/ProfilePage/Conversations";
import ReservedBooking from "views/LoginPage/ReservationBooking.jsx";
import VideoCallReservationBooking from "views/LoginPage/VideoCallReservationBooking.jsx";

import VideoFulfillment from "views/RequestPage/StartVideocall.jsx";
import Articles from "views/Articles/index.jsx";
import ArticleWhyOffer1vs1Call from "views/Articles/WhyOffer1vs1.jsx";

var indexRoutes = [
  { path: "/f", name: "SearchPage", component: SearchPage },
  { path: "/join", name: "Join", component: Join },
  { path: "/referral", name: "Referral", component: Referral },
  { path: "/recommend", name: "Recommend", component: Recommend },
  { path: "/faq", name: "FAQ", component: FAQ },
  { path: "/terms", name: "Terms", component: TandC },
  { path: "/confirmation", name: "EmailSent", component: EmailSent },
  { path: "/message", name: "DirectMessage", component: DirectMessage },
  { path: "/dm", name: "Conversations", component: Conversations },
  { path: "/rec", name: "FulfillmentPage", component: Fulfillment },
  {
    path: "/videocall",
    name: "VideoFulfillmentPage",
    component: VideoFulfillment
  },
  { path: "/forgotten", name: "ForgottenPage", component: Forgotten },
  { path: "/resetpass", name: "ResetPassPage", component: ResetPass },
  {
    path: "/reservebooking",
    name: "ReservedBooking",
    component: ReservedBooking
  },
  {
    path: "/videocallreservebooking",
    name: "VideoCallReservedBooking",
    component: VideoCallReservationBooking
  },
  { path: "/claim", name: "ClaimPage", component: ClaimPage },
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
  { path: "/request/:username", name: "Request", component: Request },
  {
    path: "/videorequest/:username",
    name: "Video Request",
    component: VideoRequest
  },
  {
    path: "/pending/:username",
    name: "PendingRequestPage",
    component: PendingRequest
  },
  {
    path: "/completed/:username",
    name: "CompletedRequestPage",
    component: CompletedRequest
  },
  {
    path: "/completedvcalls/:username",
    name: "CompletedVideoRequestPage",
    component: CompletedVideoRequest
  },
  {
    path: "/usersetting/:username",
    name: "ProfileSetting",
    component: ProfileSetting
  },
  {
    path: "/confirmrequest",
    name: "ConfirmRequest",
    component: ConfirmRequest
  },
  {
    path: "/requested",
    name: "SuccessRequest",
    component: SuccessRequest
  },
  {
    path: "/paymentcancelled",
    name: "ErrorPayment",
    component: ErrorPayment
  },
  {
    path: "/articles",
    name: "Article",
    component: Articles
  },
  {
    path: "/article/WhyOffer1vs1Call",
    name: "OfferCallArticle",
    component: ArticleWhyOffer1vs1Call
  },
  { path: "/dashboard", name: "LandingPage", component: LandingPage },
  { path: "/user/:username", name: "ProfilePage", component: ProfilePage },
  { path: "/:username", name: "ProfilePage", component: ProfilePage },
  { path: "/", name: "LandingPage", component: LandingPage }
];

export default indexRoutes;
