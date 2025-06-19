import React, { useState } from "react";
import { login, register } from "../firebase/login";

type Props = {
  onClose: () => void;
};

const LoginRegisterPopup: React.FC<Props> = ({ onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!email || !password) return setError("Vyplňte email i heslo.");
    if (mode === "register") {
      if (!username) return setError("Zadej uživatelské jméno.");
      if (password.length < 6)
        return setError("Heslo musí mít alespoň 6 znaků.");
    }

    try {
      if (mode === "login") {
        await login(email, password);
        onClose();
      } else {
        await register(email, password, username);
        setError("Registrace úspěšná! Nyní se přihlas.");
        setMode("login");
        resetForm();
      }
    } catch {
      setError(
        mode === "login" ? "Chyba při přihlášení." : "Chyba při registraci."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
          aria-label="Zavřít"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-neutral-800">
          {mode === "login" ? "Přihlášení" : "Registrace"}
        </h2>

        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Uživatelské jméno"
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
            placeholder="Heslo"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            className={`${
              mode === "login"
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } py-2 rounded-md font-semibold transition`}
          >
            {mode === "login" ? "Přihlásit se" : "Zaregistrovat se"}
          </button>

          <div className="text-sm text-center text-gray-600">
            {mode === "login" ? (
              <>
                Nemáš účet?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    resetForm();
                  }}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Registruj se
                </button>
              </>
            ) : (
              <>
                Máš účet?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    resetForm();
                  }}
                  className="text-yellow-500 underline hover:text-yellow-700"
                >
                  Přihlas se
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
