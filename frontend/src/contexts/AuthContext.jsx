import React, { createContext, useContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // ✅ REGISTER
  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === HttpStatusCode.Created) {
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  // ✅ LOGIN
  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === HttpStatusCode.Ok) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        return "Login successful";
      }
    } catch (error) {
      throw error;
    }
  };

  // ✅ VERY IMPORTANT: EXPORT EVERYTHING
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  };

  return (
  <AuthContext.Provider value={data}>
    {children}
  </AuthContext.Provider>
);
};
