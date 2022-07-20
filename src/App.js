import { useEffect, useState, useReducer, useMemo } from "react";

// react-router components
import { Route, useLocation, Routes, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// App Context
import AuthContext from "context/AuthContext";
import SocialMediaContext from "context/SocialMediaContext";

// api call
import { getCookie, getInAppConfig } from "api";

// routes
import indexRoutes from "pageRoutes";
import "./App.css";

// Themes app
import {
  DarkTheme,
  LightTheme,
  SkyTheme,
  BlurTheme,
  SunsetTheme,
  NatureTheme,
  SnowTheme,
  CheeseTheme,
  MineralTheme,
} from "assets/theme";

// fake data
import social from "data";
import { defaultProfilePic } from "utils";

export const FANBIES_DISPATCH = {
  LOGIN: "LOGIN",
  FETCH_DETAILS: "FETCH_DETAILS",
  UPDATE_CUSTOMER_LINK: "UPDATE_CUSTOMER_LINK",
  SIGN_OUT: "SIGN_OUT",
  SIGN_UP: "SIGN_UP",
  FETCH_INAPP_VIDEO_RATES: "FETCH_INAPP_VIDEO_RATES",
  FETCH_INAPP_SOCIAL_MEDIA: "FETCH_INAPP_SOCIAL_MEDIA",
  UPDATE_PROFILE_PICTURE: "UPDATE_PROFILE_PICTURE",
  CHANGE_THEME: "CHANGE_THEME",
};

const fanbiesStore = "FANBIES_STORE";

export default function App() {
  const { pathname } = useLocation();
  const [socialMediaLinks, setSocialMediaLinks] = useState(social);
  const navigate = useNavigate();
  const jtoken = getCookie("fanbies-token");

  const initialState = {
    isRequest: false,
    error: null,
    isSignout: true,
    userToken: null,
    fanbiesMessageToolrates: [],
    fanbiesSupportedSocials: "",
    userProfile: {
      active: 0,
      bio: "",
      custom_links: [],
      email: "",
      mediaUrl: null,
      mypage: false,
      name: null,
      picture: defaultProfilePic,
      rand_: 0,
      remarks: "",
      slots: 0,
      theme: "DEFAULT",
      username: "",
      usertype: 0,
      video_message_fee: 0,
      video_message_status: 0,
    },
  };

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case FANBIES_DISPATCH.LOGIN:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, ...action.payload },
            isSignout: false,
          };
        case FANBIES_DISPATCH.SIGN_UP:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, ...action.payload },
            isSignout: false,
          };
        case FANBIES_DISPATCH.FETCH_DETAILS:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, ...action.payload },
          };
        case FANBIES_DISPATCH.UPDATE_PROFILE_PICTURE:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, picture: action.payload },
          };
        case FANBIES_DISPATCH.SIGN_OUT:
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userProfile: null,
          };
        case FANBIES_DISPATCH.UPDATE_CUSTOMER_LINK:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, custom_links: action.payload },
          };
        case FANBIES_DISPATCH.FETCH_INAPP_VIDEO_RATES:
          return {
            ...prevState,
            fanbiesMessageToolrates: action.payload,
          };
        case FANBIES_DISPATCH.FETCH_INAPP_SOCIAL_MEDIA:
          return {
            ...prevState,
            fanbiesSupportedSocials: action.payload,
          };
        case FANBIES_DISPATCH.CHANGE_THEME:
          return {
            ...prevState,
            userProfile: { ...prevState.userProfile, theme: action.payload },
          };
        default:
          return { ...prevState };
      }
    },
    initialState,
    (initial) => JSON.parse(localStorage.getItem(fanbiesStore)) || initial
  );
  // Keep the Application persistence
  const saveStateToLocalStorage = (currentState) => {
    const serializedState = JSON.stringify(currentState);
    localStorage.setItem(fanbiesStore, serializedState);
  };

  useEffect(() => {
    // This is a side-effect and belongs in an effect
    saveStateToLocalStorage(state);
  }, [state]);

  const authContext = useMemo(
    () => ({
      state,
      dispatch: {
        logIn: async (data) => {
          // Redirect on user profile after signin. if success and remove error message
          localStorage.setItem("fanbies-username", data.username);
          document.cookie = `fanbies-token=${data.token}; path="/admin; Secure; SameSite=true"`;
          // delete token key in user object
          const tk = "token";
          // eslint-disable-next-line no-param-reassign
          delete data[tk];
          dispatch({
            type: FANBIES_DISPATCH.LOGIN,
            payload: data,
          });
          navigate("/admin", { replace: true });
        },
        signUp: (data) => {
          // delete token key in user object
          // const { token, ...dataWithoutToken } = data;
          localStorage.setItem("fanbies-username", data.username);
          document.cookie = `fanbies-token=${data.token}; path="/admin; Secure; SameSite=true"`;
          // delete token key in user object
          const tk = "token";
          // eslint-disable-next-line no-param-reassign
          delete data[tk];
          dispatch({ type: FANBIES_DISPATCH.SIGN_UP, payload: data });
          navigate("/admin", { replace: true });
        },
        signOut: () => {
          document.cookie = `fanbies-token=; Max-Age=0; path=/; domain=${
            process.env.PUBLIC_URL
          };expires=${new Date().toLocaleDateString()}`;
          localStorage.removeItem("fanbies-username");
          saveStateToLocalStorage({});
          dispatch({ type: FANBIES_DISPATCH.SIGN_OUT });

          navigate("/", { replace: true });
        },
        updateCustomLinks: (data) => {
          dispatch({ type: FANBIES_DISPATCH.UPDATE_CUSTOMER_LINK, payload: data });
        },
        getInAppConfigRate: (videoRates) => {
          const rate = JSON.stringify(videoRates);
          dispatch({ type: FANBIES_DISPATCH.FETCH_INAPP_VIDEO_RATES, payload: rate });
        },
        getInAppConfigSocial: (data) => {
          dispatch({ type: FANBIES_DISPATCH.FETCH_INAPP_SOCIAL_MEDIA, payload: data });
        },
        getDetails: async (data) => {
          dispatch({
            type: FANBIES_DISPATCH.FETCH_DETAILS,
            payload: data,
          });
        },
        updatePicture: async (data) => {
          dispatch({
            type: FANBIES_DISPATCH.UPDATE_PROFILE_PICTURE,
            payload: data,
          });
        },
        changeTheme: (data) => {
          dispatch({
            type: FANBIES_DISPATCH.CHANGE_THEME,
            payload: data,
          });
        },
      },
    }),
    [state]
  );

  useEffect(() => {
    const loadFanbiesAsync = async () => {
      try {
        // Check if user is authenticated
        if (!state.isSignout && jtoken != null) {
          // Call the application creative tool request message rates...
          const getRequestToolRate = await getInAppConfig(jtoken, "getVideoMessageRate");
          if (getRequestToolRate.success) {
            const videoRates = getRequestToolRate?.response[0]?.value?.split(",");
            authContext.dispatch.getInAppConfigRate(videoRates);
          }
          // Get application config for supported social links
          const responseInAppSocial = await getInAppConfig(jtoken, "getSupportedSocialMedia");
          if (responseInAppSocial.success) {
            const links = responseInAppSocial?.response[0]?.value?.split(",");
            authContext.dispatch.getInAppConfigSocial(links);
          }
        }
      } catch (e) {
        window.console.warn("Error", e);
      }
    };

    loadFanbiesAsync();

    return () => null;
  }, [state?.isSignout]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getAllRoutes = (r) =>
    r.map((prop) => <Route exact path={prop.route} key={prop.name} element={prop.component} />);

  const theme = useMemo(() => {
    switch (state?.userProfile?.theme) {
      case "LIGHT":
        return createTheme({ ...LightTheme });
      case "SKY":
        return createTheme({ ...SkyTheme });
      case "DEFAULT":
        return createTheme({ ...DarkTheme });
      case "BLURED":
        return createTheme({ ...BlurTheme });
      case "SUNSET":
        return createTheme({ ...SunsetTheme });
      case "NATURE":
        return createTheme({ ...NatureTheme });
      case "SNOW":
        return createTheme({ ...SnowTheme });
      case "CHEESE":
        return createTheme({ ...CheeseTheme });
      case "MINERAL":
        return createTheme({ ...MineralTheme });
      default:
        return createTheme({ ...DarkTheme });
    }
  }, [state?.userProfile?.theme]);

  return (
    <AuthContext.Provider value={authContext}>
      <SocialMediaContext.Provider value={{ socialMediaLinks, setSocialMediaLinks }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>{getAllRoutes(indexRoutes)}</Routes>
        </ThemeProvider>
      </SocialMediaContext.Provider>
    </AuthContext.Provider>
  );
}
