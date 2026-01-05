import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Dark Mode Toggle
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/events/upcoming")
      .then(res => setUpcomingEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Ungültiges Datum" : date.toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setMessage("Logout erfolgreich!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Willst du wirklich deinen Account löschen?")) return;

    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      await api.delete("/auth/me");
      localStorage.removeItem("token");
      setMessage("Account erfolgreich gelöscht!");
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Fehler beim Löschen des Accounts");
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 min-h-screen text-gray-100" : "bg-gray-100 min-h-screen text-gray-900"}>
      <PageContainer title="Willkommen zurück!">
        {/* Dark Mode Switch */}
        <div className="flex items-center justify-end mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}

        {/* Suchleiste */}
        <div className="flex max-w-md mb-6">
          <input
            type="text"
            placeholder="Suchbegriff"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-l border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
          >
            Suchen
          </button>
        </div>

        {/* Dashboard-Kacheln */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Link to="/contacts">
            <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg text-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Kontakte</h2>
            </div>
          </Link>

          <Link to="/links">
            <div className="bg-pink-100 dark:bg-pink-900 p-5 rounded-lg text-center cursor-pointer hover:bg-pink-200 dark:hover:bg-pink-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Links</h2>
            </div>
          </Link>

          <Link to="/events">
            <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg text-center cursor-pointer hover:bg-green-200 dark:hover:bg-green-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Termine</h2>
              <ul className="text-left mt-2 max-h-36 overflow-y-auto text-gray-900 dark:text-gray-100">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(ev => (
                    <li key={ev._id}>{ev.title} – {formatDate(ev.start)}</li>
                  ))
                ) : (
                  <li>Keine bevorstehenden Termine</li>
                )}
              </ul>
            </div>
          </Link>

          <Link to="/folders">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg text-center cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ordner</h2>
            </div>
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Account löschen
          </button>
        </div>
      </PageContainer>
    </div>
  );
}




