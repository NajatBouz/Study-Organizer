import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      setMessage("Registrierung erfolgreich!");
      navigate("/login"); // nach Registrierung zum Login weiterleiten
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler bei der Registrierung");
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrieren</button>
      </form>
      <p>{message}</p>
      <p>
        Schon einen Account? <Link to="/login">Hier einloggen</Link>
      </p>
    </div>
  );
}

