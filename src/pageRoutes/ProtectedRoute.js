import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const getCookieByName = (tokenName) => {
    let token;
    if (document.cookie) {
      token = document?.cookie
        .split(";")
        .find((row) => row.startsWith(`${tokenName}=`))
        .split("=")[1];
    }
    return token;
  };

  if (
    state.isSignout ||
    getCookieByName("fanbies-token") === undefined ||
    getCookieByName("fanbies-token") === null
  ) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
