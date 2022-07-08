import { createContext } from "react";

// create Authentication context
const AuthContext = createContext({ state: {}, dispatch: {} });

export default AuthContext;
