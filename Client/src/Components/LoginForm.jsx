import { useState } from "react";
import Button from "./Button";

function LoginForm({ onLogin, error }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin({
      username: userName,   // ✅ MUST MATCH DTO
      password: password,
    });
  };

  return (
    <form className="login-form " onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="error">{error}</p>}

      <Button type="submit" label="Login" />
    </form>
  );
}

export default LoginForm;