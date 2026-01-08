import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Users, LinkIcon, Calendar, ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "contact": return Users;
      case "link": return LinkIcon;
      case "event": return Calendar;
      default: return SearchIcon;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case "contact": return isDarkMode ? "from-blue-400 to-blue-600" : "from-blue-500 to-blue-700";
      case "link": return isDarkMode ? "from-purple-400 to-purple-600" : "from-purple-500 to-purple-700";
      case "event": return isDarkMode ? "from-green-400 to-green-600" : "from-green-500 to-green-700";
      default: return isDarkMode ? "from-gray-400 to-gray-600" : "from-gray-500 to-gray-700";
    }
  };

  const totalResults = results.reduce((sum, category) => sum + category.results.length, 0);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar 
        title={t("search")} 
        subtitle={query ? `"${query}"` : undefined} 
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex items-center justify-start gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{t("back")}</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <SearchIcon className={`w-16 h-16 mx-auto mb-4 animate-pulse ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("loading")}
            </p>
          </div>
        ) : !query ? (
          <div className="text-center py-20">
            <SearchIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("search")}
            </h3>
            <p className={`${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("searchPlaceholder")}
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("noResults")}
            </h3>
            <p className={`${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("tryDifferentSearch")}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalResults === 1 
                  ? `1 ${t("resultsFound")}` 
                  : `${totalResults} ${t("resultsFoundPlural")}`}
              </p>
            </div>

            {results.map((category) => (
              category.results.length > 0 && (
                <div key={category.type}>
                  <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.type === "contact" && t("contacts")}
                    {category.type === "link" && t("links")}
                    {category.type === "event" && t("events")}
                    <span className={`text-sm font-normal ${isDarkMode ? 'text-blue-200' : 'text-gray-500'}`}>
                      ({category.results.length})
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.results.map((item) => {
                      const Icon = getResultIcon(category.type);
                      const color = getResultColor(category.type);

                      return (
                        <div
                          key={item._id}
                          className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                            isDarkMode
                              ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                              : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${color} flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Contact */}
                              {category.type === "contact" && (
                                <>
                                  <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {item.name}
                                  </h3>
                                  {item.role && (
                                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                                      {item.role}
                                    </p>
                                  )}
                                  <div className="space-y-1">
                                    {item.email && (
                                      <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                                        <Mail className="w-3 h-3" />
                                        <a href={`mailto:${item.email}`} className="hover:underline truncate">
                                          {item.email}
                                        </a>
                                      </div>
                                    )}
                                    {item.phone && (
                                      <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                                        <Phone className="w-3 h-3" />
                                        <a href={`tel:${item.phone}`} className="hover:underline">
                                          {item.phone}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* Link */}
                              {category.type === "link" && (
                                <>
                                  <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {item.title}
                                  </h3>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1.5 text-xs hover:underline mb-2 ${
                                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {t("visit")}
                                  </a>
                                  {item.note && (
                                    <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-purple-100' : 'text-gray-600'}`}>
                                      {item.note}
                                    </p>
                                  )}
                                </>
                              )}

                              {/* Event */}
                              {category.type === "event" && (
                                <>
                                  <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {item.title}
                                  </h3>
                                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-green-200' : 'text-gray-600'}`}>
                                    {formatDateTime(item.start)}
                                  </p>
                                  {item.description && (
                                    <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-green-100' : 'text-gray-600'}`}>
                                      {item.description}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}