import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (
      password === "roadwarrior2026"
    ) {
      localStorage.setItem(
        "adminToken",
        "authenticated"
      );

      navigate("/dashboard");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}