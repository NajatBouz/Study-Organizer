import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { Users, LinkIcon, Calendar, Folder } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    // Benutzername aus Token holen (optional)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || "");

    api.get("/events/upcoming")
      .then(res => setUpcomingEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Ungültiges Datum" : date.toLocaleDateString("de-DE");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Willst du wirklich deinen Account löschen? Diese Aktion kann nicht rückgängig gemacht werden!")) return;

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

  const dashboardCards = [
    {
      title: "Kontakte",
      icon: Users,
      color: isDarkMode ? "from-blue-500 to-blue-700" : "from-blue-400 to-blue-600",
      hoverColor: isDarkMode ? "hover:from-blue-600 hover:to-blue-800" : "hover:from-blue-500 hover:to-blue-700",
      link: "/contacts",
      description: "Verwalte deine Kontakte"
    },
    {
      title: "Links",
      icon: LinkIcon,
      color: isDarkMode ? "from-purple-500 to-purple-700" : "from-purple-400 to-purple-600",
      hoverColor: isDarkMode ? "hover:from-purple-600 hover:to-purple-800" : "hover:from-purple-500 hover:to-purple-700",
      link: "/links",
      description: "Organisiere deine Links"
    },
    {
      title: "Termine",
      icon: Calendar,
      color: isDarkMode ? "from-green-500 to-green-700" : "from-green-400 to-green-600",
      hoverColor: isDarkMode ? "hover:from-green-600 hover:to-green-800" : "hover:from-green-500 hover:to-green-700",
      link: "/events",
      description: "Plane deine Termine"
    },
    {
      title: "Ordner",
      icon: Folder,
      color: isDarkMode ? "from-yellow-500 to-yellow-700" : "from-yellow-400 to-yellow-600",
      hoverColor: isDarkMode ? "hover:from-yellow-600 hover:to-yellow-800" : "hover:from-yellow-500 hover:to-yellow-700",
      link: "/folders",
      description: "Strukturiere deine Dateien"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      {/* Header mit Navbar */}
      <Navbar title="Study Organizer" subtitle={userName ? `Hallo, ${userName}!` : undefined} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("erfolgreich") 
              ? isDarkMode ? "bg-green-500/20 text-green-200 border border-green-400/30" : "bg-green-100 text-green-700 border border-green-300"
              : isDarkMode ? "bg-red-500/20 text-red-200 border border-red-400/30" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-left mb-8">
          <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            Willkommen zurück{userName ? `, ${userName}` : ""}!
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
            Was möchtest du heute organisieren?
          </p>
        </div>

        {/* Dashboard Cards Grid - mit viel mehr Abstand nach oben */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.link}>
                <div className={`relative overflow-hidden bg-gradient-to-br ${card.color} ${card.hoverColor} rounded-2xl p-6 shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                  isDarkMode ? 'hover:shadow-blue-500/50' : 'hover:shadow-xl'
                }`}>
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10 text-white" />
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.description}</p>

                  {/* Termine Preview */}
                  {card.title === "Termine" && upcomingEvents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs text-white/70 mb-2">Nächste Termine:</p>
                      <ul className="space-y-1">
                        {upcomingEvents.slice(0, 2).map(ev => (
                          <li key={ev._id} className="text-xs text-white/90 truncate">
                            • {ev.title} – {formatDate(ev.start)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Decorative Element */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Schnellübersicht
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-1`}>-</div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>Kontakte</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mb-1`}>-</div>
              <div className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>Links</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>{upcomingEvents.length}</div>
              <div className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-gray-600'}`}>Termine</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mb-1`}>-</div>
              <div className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Ordner</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}