import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { Users, LinkIcon, Calendar, Folder, Clock, TrendingUp } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    links: 0,
    events: 0,
    folders: 0
  });
  const [nextEvent, setNextEvent] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { t, language } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || "");

    loadDashboardData();
  }, [language]);

  const loadDashboardData = async () => {
    try {
      const [contactsRes, linksRes, eventsRes, foldersRes] = await Promise.all([
        api.get("/contacts"),
        api.get("/links"),
        api.get("/events"),
        api.get("/folders")
      ]);

      setStats({
        contacts: contactsRes.data.length,
        links: linksRes.data.length,
        events: eventsRes.data.length,
        folders: foldersRes.data.length
      });

      const upcomingEvents = eventsRes.data
        .filter(e => new Date(e.start) > new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start));
      
      if (upcomingEvents.length > 0) {
        setNextEvent(upcomingEvents[0]);
      }

      const activities = [];

      const recentContacts = contactsRes.data
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 2);
      recentContacts.forEach(c => {
        activities.push({
          type: "contact",
          icon: Users,
          color: "blue",
          text: `${t("contactAdded")}: ${c.name}`,
          date: c.createdAt,
          link: `/contacts?highlight=${c._id}`
        });
      });

      const recentLinks = linksRes.data
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 2);
      recentLinks.forEach(l => {
        activities.push({
          type: "link",
          icon: LinkIcon,
          color: "purple",
          text: `${t("linkAdded")}: ${l.title}`,
          date: l.createdAt,
          link: `/links?highlight=${l._id}`
        });
      });

      const recentEvents = eventsRes.data
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 2);
      recentEvents.forEach(e => {
        activities.push({
          type: "event",
          icon: Calendar,
          color: "green",
          text: `${t("eventAdded")}: ${e.title}`,
          date: e.createdAt,
          link: `/events?highlight=${e._id}`
        });
      });

      const recentFolders = foldersRes.data
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 2);
      recentFolders.forEach(f => {
        activities.push({
          type: "folder",
          icon: Folder,
          color: "yellow",
          text: `${t("folderCreated")}: ${f.name}`,
          date: f.createdAt,
          link: `/folders?highlight=${f._id}`
        });
      });

      activities.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setRecentActivities(activities.slice(0, 5));

    } catch (err) {
      console.error(err);
      setMessage(t("error"));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeUntilEvent = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return days === 1 ? t("inDays").replace("{0}", days) : t("inDaysPlural").replace("{0}", days);
    if (hours > 0) return hours === 1 ? t("inHours").replace("{0}", hours) : t("inHoursPlural").replace("{0}", hours);
    return t("soon");
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return t("justNow");
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("minutesAgo").replace("{0}", diffMins);
    if (diffHours < 24) return t("hoursAgo").replace("{0}", diffHours);
    if (diffDays < 7) return diffDays === 1 ? t("daysAgo").replace("{0}", diffDays) : t("daysAgoPlural").replace("{0}", diffDays);
    return formatDate(dateString);
  };

  const dashboardCards = [
    {
      title: t("contacts"),
      icon: Users,
      color: isDarkMode ? "from-blue-500 to-blue-700" : "from-blue-400 to-blue-600",
      hoverColor: isDarkMode ? "hover:from-blue-600 hover:to-blue-800" : "hover:from-blue-500 hover:to-blue-700",
      link: "/contacts",
      description: t("manageContacts")
    },
    {
      title: t("links"),
      icon: LinkIcon,
      color: isDarkMode ? "from-purple-500 to-purple-700" : "from-purple-400 to-purple-600",
      hoverColor: isDarkMode ? "hover:from-purple-600 hover:to-purple-800" : "hover:from-purple-500 hover:to-purple-700",
      link: "/links",
      description: t("organizeLinks")
    },
    {
      title: t("events"),
      icon: Calendar,
      color: isDarkMode ? "from-green-500 to-green-700" : "from-green-400 to-green-600",
      hoverColor: isDarkMode ? "hover:from-green-600 hover:to-green-800" : "hover:from-green-500 hover:to-green-700",
      link: "/events",
      description: t("planEvents")
    },
    {
      title: t("folders"),
      icon: Folder,
      color: isDarkMode ? "from-yellow-500 to-yellow-700" : "from-yellow-400 to-yellow-600",
      hoverColor: isDarkMode ? "hover:from-yellow-600 hover:to-yellow-800" : "hover:from-yellow-500 hover:to-yellow-700",
      link: "/folders",
      description: t("structureFiles")
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title="Study Organizer" subtitle={userName ? `${t("welcomeBack").split(" ")[0]}, ${userName}!` : undefined} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes(t("success")) 
              ? isDarkMode ? "bg-green-500/20 text-green-200 border border-green-400/30" : "bg-green-100 text-green-700 border border-green-300"
              : isDarkMode ? "bg-red-500/20 text-red-200 border border-red-400/30" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        <div className="text-left mb-8">
          <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            {t("welcomeBack")}{userName ? `, ${userName}` : ""}!
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
            {t("hereIsYourOverview")}
          </p>
        </div>

        {nextEvent && (
          <Link to="/events">
            <div className={`mb-8 rounded-2xl p-6 border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30 hover:from-green-500/30 hover:to-blue-500/30' 
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-lg hover:shadow-xl'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-green-500/30' : 'bg-green-500'
                  }`}>
                    <Calendar className={`w-7 h-7 ${isDarkMode ? 'text-green-200' : 'text-white'}`} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'} mb-1`}>
                      {t("nextEvent")}
                    </h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {nextEvent.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                      {formatDateTime(nextEvent.start)} • {getTimeUntilEvent(nextEvent.start)}
                    </p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-green-500/30 hover:bg-green-500/40 text-green-200'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}>
                  {t("allEvents")}
                </button>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.link}>
                <div className={`relative overflow-hidden bg-gradient-to-br ${card.color} ${card.hoverColor} rounded-2xl p-6 shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                  isDarkMode ? 'hover:shadow-blue-500/50' : 'hover:shadow-xl'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10 text-white" />
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.description}</p>

                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className={`lg:col-span-1 rounded-2xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t("statistics")}
              </h3>
            </div>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>{t("contacts")}</span>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stats.contacts}</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>{t("links")}</span>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stats.links}</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-gray-600'}`}>{t("events")}</span>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.events}</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>{t("folders")}</span>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.folders}</span>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-2 rounded-2xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t("recentActivities")}
              </h3>
            </div>
            
            {recentActivities.length === 0 ? (
              <p className={`text-center py-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-500'}`}>
                {t("noActivitiesYet")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  const colorClasses = {
                    blue: isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600',
                    purple: isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600',
                    yellow: isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-600',
                    green: isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'
                  };

                  return (
                    <Link key={index} to={activity.link}>
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[activity.color]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activity.text}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-gray-500'}`}>
                            {getRelativeTime(activity.date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}