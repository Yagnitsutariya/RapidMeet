import "./Login.css";
import { AuthContext } from "../contexts/AuthContext";
import React, { useState, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [openError, setOpenError] = useState(false);

  // 0 = Sign In | 1 = Sign Up
  const [formState, setFormState] = useState(0);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleAuth = async () => {
    try {
      setError("");

      if (formState === 0) {
        const result = await handleLogin(username, password);
        setMessage(result);
        setOpenMessage(true);
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result);
        setOpenMessage(true);
        setFormState(0);
        setName("");
      }

      setUsername("");
      setPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      setOpenError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="title">{formState === 0 ? "SIGN IN" : "SIGN UP"}</h2>

        <div className="auth-toggle">
          <button
            className={formState === 0 ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setFormState(0)}
          >
            Sign In
          </button>
          <button
            className={formState === 1 ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setFormState(1)}
          >
            Sign Up
          </button>
        </div>

        {formState === 1 && (
          <div className="input-group">
            <span className="icon">🧑</span>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
          <span className="icon">👤</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Snackbar
          open={openMessage}
          autoHideDuration={3000}
          onClose={() => {
            setOpenMessage(false);
            setMessage("");
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => { setOpenMessage(false); setMessage(""); }} severity="success" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openError}
          autoHideDuration={4000}
          onClose={() => {
            setOpenError(false);
            setError("");
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => { setOpenError(false); setError(""); }} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <button className="login-btn" onClick={handleAuth}>
          {formState === 0 ? "LOGIN" : "REGISTER"}
        </button>
      </div> 
    </div>
  );
}
