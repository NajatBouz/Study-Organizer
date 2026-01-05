import { useState } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Dark Mode Toggle
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setMessage("Login erfolgreich!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler beim Login");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
        
        {/* Dark Mode Switch */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Login</h2>

          {message && <p className="mb-4 text-green-500">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Noch keinen Account? <Link className="text-blue-500 hover:underline" to="/register">Hier registrieren</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

