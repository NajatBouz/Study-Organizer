import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, User, Search, Trash2, ChevronDown, Globe } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { setAuthToken, api } from "../api";

export default function Navbar({ title, subtitle, showActions = true }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState("DE");
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Lade User-Daten und Sprache aus localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const savedLang = localStorage.getItem("language") || "DE";
    setUserData(user);
    setLanguage(savedLang);

    // Schließe Dropdown wenn außerhalb geklickt wird
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "DE" ? "EN" : "DE";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const formatDate = (dateString) => {
    if (!dateString) return language === "DE" ? "Unbekannt" : "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "DE" ? "de-DE" : "en-US", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setShowLogoutModal(false);
    setShowSuccessMessage(language === "DE" ? "Erfolgreich ausgeloggt!" : "Successfully logged out!");
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleDeleteClick = () => {
    setShowProfileDropdown(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      await api.delete("/auth/me");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowDeleteModal(false);
      setShowSuccessMessage(language === "DE" ? "Account erfolgreich gelöscht!" : "Account successfully deleted!");
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      console.error(err);
      setShowSuccessMessage(language === "DE" ? "Fehler beim Löschen des Accounts" : "Error deleting account");
    }
  };

  const t = {
    searchPlaceholder: language === "DE" ? "Suche Kontakte, Links, Termine..." : "Search Contacts, Links, Events...",
    logout: language === "DE" ? "Logout" : "Logout",
    deleteAccount: language === "DE" ? "Account löschen" : "Delete Account",
    memberSince: language === "DE" ? "Mitglied seit" : "Member since",
    confirmLogout: language === "DE" ? "Möchtest du dich wirklich ausloggen?" : "Do you really want to log out?",
    confirmDelete: language === "DE" ? "Möchtest du deinen Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!" : "Do you really want to delete your account? This action cannot be undone!",
    cancel: language === "DE" ? "Abbrechen" : "Cancel",
    delete: language === "DE" ? "Löschen" : "Delete"
  };

  return (
    <>
      <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/90'} backdrop-blur-md border-b ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            
            {/* Links: Title - weiter nach links */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${isDarkMode ? 'from-blue-400 to-blue-600' : 'from-blue-500 to-blue-700'} rounded-lg flex items-center justify-center`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title || "Study Organizer"}
                </h1>
                {subtitle && (
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Mittig: Suchleiste */}
            {showActions && (
              <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block mx-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 pl-10 rounded-lg border transition-all ${
                      isDarkMode
                        ? 'bg-white/10 border-white/20 text-white placeholder-blue-200 focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent`}
                  />
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-blue-200' : 'text-gray-400'}`} />
                </div>
              </form>
            )}

            {/* Rechts: Language Toggle, Dark Mode Toggle & Profile Dropdown - ganz rechts */}
            {showActions && (
              <div className="flex items-center gap-3 ml-auto pl-4">
                
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  }`}
                  title="Sprache wechseln / Change Language"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{language}</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300' 
                      : 'bg-slate-700/20 hover:bg-slate-700/30 text-slate-700'
                  }`}
                  title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Profile Dropdown */}
                {userData && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                      }`}>
                        <span className="text-white font-bold text-xs">
                          {userData.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu - direkt unter dem Button */}
                    {showProfileDropdown && (
                      <div className={`absolute right-0 mt-1 w-52 rounded-lg shadow-2xl border overflow-hidden z-[9999] ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
                          : 'bg-white border-gray-200'
                      }`}>
                        {/* User Info */}
                        <div className={`p-2.5 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                            }`}>
                              <span className="text-white font-bold text-xs">
                                {userData.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-xs truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {userData.name || "Unbekannt"}
                              </p>
                              <p className={`text-[10px] truncate ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                                {userData.email || "keine@email.de"}
                              </p>
                            </div>
                          </div>
                          <div className={`text-[10px] ${isDarkMode ? 'text-blue-300' : 'text-gray-500'}`}>
                            📅 {t.memberSince}: {formatDate(userData.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-1.5">
                          <button
                            onClick={handleLogoutClick}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-xs ${
                              isDarkMode
                                ? 'hover:bg-white/10 text-blue-200'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="font-medium">{t.logout}</span>
                          </button>
                          
                          <button
                            onClick={handleDeleteClick}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-xs ${
                              isDarkMode
                                ? 'hover:bg-red-500/20 text-red-300'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="font-medium">{t.deleteAccount}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Erfolgreiche Nachricht */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`p-4 rounded-lg shadow-2xl ${
            showSuccessMessage.includes("erfolgreich") || showSuccessMessage.includes("Successfully")
              ? isDarkMode ? 'bg-green-500/20 text-green-200 border border-green-400/30' : 'bg-green-100 text-green-700 border border-green-300'
              : isDarkMode ? 'bg-red-500/20 text-red-200 border border-red-400/30' : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            <p className="font-semibold">
              {(showSuccessMessage.includes("erfolgreich") || showSuccessMessage.includes("Successfully")) ? "✓" : "✗"} {showSuccessMessage}
            </p>
          </div>
        </div>
      )}

      {/* Logout Bestätigung Modal hier: */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.logout}?
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t.confirmLogout}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Löschfunktion hier: */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.deleteAccount}?
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t.confirmDelete}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
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