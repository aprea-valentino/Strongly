
import React, { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser as loginUserThunk, logout } from "../redux/authSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const loginUser = (credentials) => dispatch(loginUserThunk(credentials));
  const logoutUser = () => dispatch(logout());

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
