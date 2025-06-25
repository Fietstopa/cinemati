import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, registerThunk } from "../stores/authSlice";
import type { RootState, AppDispatch } from "../stores/store";

type Props = {
  onClose: () => void;
};

const LoginRegisterPopup: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [localError, setLocalError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setLocalError("");
  };

  useEffect(() => {
    const handleOpenLogin = () => {
      setMode("login");
      resetForm();
    };

    window.addEventListener("open-login", handleOpenLogin as EventListener);
    return () =>
      window.removeEventListener(
        "open-login",
        handleOpenLogin as EventListener
      );
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) return setLocalError("Enter email and password.");
    if (mode === "register") {
      if (!username) return setLocalError("Enter your username.");
      if (password.length < 6)
        return setLocalError("Password has to be at least 6 characters long.");
    }

    setLocalError("");

    try {
      if (mode === "login") {
        await dispatch(loginThunk({ email, password })).unwrap();
        onClose();
      } else {
        await dispatch(registerThunk({ email, password, username })).unwrap();
        setMode("login");
        resetForm();
        setLocalError("Registration successful. You can now log in.");
      }
    } catch (e: any) {
      setLocalError(e || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-3xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-neutral-800">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {(localError || auth.error) && (
            <div className="text-red-500 text-sm font-medium">
              {localError || auth.error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={auth.loading}
            className={`${
              mode === "login"
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } py-2 rounded-md font-semibold transition disabled:opacity-50`}
          >
            {auth.loading
              ? "Processing..."
              : mode === "login"
              ? "Log in"
              : "Register"}
          </button>

          <div className="text-sm text-center text-gray-600">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    resetForm();
                  }}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Register now
                </button>
              </>
            ) : (
              <>
                Already have account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    resetForm();
                  }}
                  className="text-yellow-500 underline hover:text-yellow-700"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPopup;
