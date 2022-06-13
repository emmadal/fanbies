import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

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

  if (!user && !getCookieByName("fanbies-token")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
