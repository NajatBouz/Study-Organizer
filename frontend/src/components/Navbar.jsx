import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Sun, Moon, Globe, LogOut, Trash2, ChevronDown, User } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Navbar({ title, subtitle, showActions = true }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage, t } = useLanguage();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/register");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-slate-900/95 border-white/10' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <Link to="/dashboard">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h1>
              </Link>
              {subtitle && (
                <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-gray-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Center: Search */}
            {showActions && (
              <div className="flex-1 max-w-md mx-8 hidden sm:block">
                <form onSubmit={handleSearch} className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-blue-300' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:ring-blue-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                    } border focus:outline-none focus:ring-2`}
                  />
                </form>
              </div>
            )}

            {/* Right: Actions */}
            {showActions && (
              <div className="flex items-center gap-3">
                
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={language === "de" ? "Switch to English" : "Zu Deutsch wechseln"}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {language.toUpperCase()}
                  </span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-yellow-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 hover:bg-slate-700'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  </button>

                  {showProfileDropdown && (
                    <div className={`absolute right-0 mt-1 w-52 rounded-lg border shadow-lg animate-fade-in z-[9999] ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className={`p-2.5 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                          }`}>
                            <span className="text-white font-bold text-xs">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.name || "User"}
                            </p>
                            <p className={`text-[10px] truncate ${isDarkMode ? 'text-blue-300' : 'text-gray-500'}`}>
                              {user.email || ""}
                            </p>
                          </div>
                        </div>
                        {user.createdAt && (
                          <p className={`text-[10px] mt-1.5 ${isDarkMode ? 'text-blue-200' : 'text-gray-400'}`}>
                            {t("memberSince")} {formatDate(user.createdAt)}
                          </p>
                        )}
                      </div>

                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowLogoutModal(true);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-all ${
                            isDarkMode
                              ? 'hover:bg-slate-700 text-blue-200'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span className="font-medium">{t("logout")}</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowDeleteModal(true);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-all ${
                            isDarkMode
                              ? 'hover:bg-red-500/20 text-red-300'
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="font-medium">{t("deleteAccount")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("logout")}?
            </h2>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {language === "de" 
                ? "Möchtest du dich wirklich abmelden?" 
                : "Do you really want to log out?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("deleteAccount")}?
            </h2>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {language === "de"
                ? "Möchtest du deinen Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!"
                : "Do you really want to delete your account? This action cannot be undone!"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}