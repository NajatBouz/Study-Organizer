import { useState, useEffect } from "react";
import { api, setAuthToken } from "../api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Users, LinkIcon, Calendar, Folder, ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    console.log("🔍 URL Query Parameter:", urlQuery);
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    console.log("🔎 Suche nach:", searchQuery);
    if (!searchQuery.trim()) return;

    const token = localStorage.getItem("token");
    console.log("🔑 Token vorhanden:", !!token);
    setAuthToken(token);

    setLoading(true);
    try {
      console.log("📡 API Call wird gestartet...");
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      console.log("✅ Suchergebnisse erhalten:", res.data);
      console.log("📊 Anzahl Kontakte:", res.data.contacts?.length || 0);
      console.log("📊 Anzahl Links:", res.data.links?.length || 0);
      console.log("📊 Anzahl Events:", res.data.events?.length || 0);
      console.log("📊 Anzahl Folders:", res.data.folders?.length || 0);
      setResults(res.data);
    } catch (err) {
      console.error("❌ Fehler bei der Suche:", err);
      console.error("❌ Error Response:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    performSearch(query);
    // Update URL
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
  };

  const totalResults = results 
    ? (results.contacts?.length || 0) + 
      (results.links?.length || 0) + 
      (results.events?.length || 0) + 
      (results.folders?.length || 0)
    : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Ungültiges Datum" : date.toLocaleDateString("de-DE");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      {/* Header */}
      <Navbar 
        title="Suche" 
        subtitle={results ? `${totalResults} ${totalResults === 1 ? "Ergebnis" : "Ergebnisse"} gefunden` : undefined}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Zurück</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4 ${
              isDarkMode ? 'border-blue-400' : 'border-blue-600'
            }`}></div>
            <p className={isDarkMode ? 'text-blue-200' : 'text-gray-600'}>Suche läuft...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results && (
          <div className="space-y-8">
            
            {/* No Results */}
            {totalResults === 0 && (
              <div className="text-center py-20">
                <SearchIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Keine Ergebnisse gefunden
                </h3>
                <p className={isDarkMode ? 'text-blue-200' : 'text-gray-600'}>
                  Versuche einen anderen Suchbegriff
                </p>
              </div>
            )}

            {/* Kontakte */}
            {results.contacts && results.contacts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Kontakte ({results.contacts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.contacts.map(contact => (
                    <Link key={contact._id} to="/contacts">
                      <div className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        isDarkMode
                          ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                          : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                          }`}>
                            <span className="text-white font-bold">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {contact.name}
                            </h3>
                            {contact.role && <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>{contact.role}</p>}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          {contact.email && (
                            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {results.links && results.links.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <LinkIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Links ({results.links.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.links.map(link => (
                    <div key={link._id} className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-xl ${
                      isDarkMode
                        ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                        : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-purple-500 to-purple-700'
                        }`}>
                          <LinkIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className={`text-lg font-bold truncate flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {link.title}
                        </h3>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm mb-2 ${
                          isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{link.url}</span>
                      </a>
                      {link.category && (
                        <span className={`inline-block text-xs px-2 py-1 rounded-full border ${
                          isDarkMode
                            ? 'bg-purple-500/20 border-purple-400/30 text-purple-200'
                            : 'bg-purple-50 border-purple-200 text-purple-700'
                        }`}>
                          {link.category}
                        </span>
                      )}
                      <div className="mt-3">
                        <Link 
                          to="/links"
                          className={`text-sm hover:underline ${
                            isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          Zu allen Links →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Termine */}
            {results.events && results.events.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Termine ({results.events.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.events.map(event => (
                    <Link key={event._id} to="/events">
                      <div className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        isDarkMode
                          ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                          : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-green-500 to-green-700'
                          }`}>
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </h3>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                          📅 {formatDate(event.start)}
                        </p>
                        {event.description && (
                          <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                            {event.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ordner */}
            {results.folders && results.folders.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Folder className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Ordner ({results.folders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.folders.map(folder => (
                    <Link key={folder._id} to="/folders">
                      <div className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        isDarkMode
                          ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                          : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-yellow-500 to-yellow-700'
                          }`}>
                            <Folder className="w-5 h-5 text-white" />
                          </div>
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {folder.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State (no search yet) */}
        {!loading && !results && (
          <div className="text-center py-20">
            <SearchIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gib einen Suchbegriff ein
            </h3>
            <p className={isDarkMode ? 'text-blue-200' : 'text-gray-600'}>
              Durchsuche deine Kontakte, Links, Termine und Ordner
            </p>
          </div>
        )}
      </div>
    </div>
  );
}