import { useEffect, useState, useRef } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Link as LinkIcon, Plus, Edit2, Trash2, ExternalLink, Tag, FileText, ArrowLeft, X, Save } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [message, setMessage] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const linkRefs = useRef({});

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "",
    note: ""
  });

  useEffect(() => {
    loadLinks();
    
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (highlight) {
      setHighlightId(highlight);
      setTimeout(() => {
        const element = linkRefs.current[highlight];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [location]);

  const loadLinks = () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/links")
      .then(res => setLinks(res.data))
      .catch(err => {
        console.log(err);
        setMessage(t("error"));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await api.put(`/links/${editingLink._id}`, formData);
        setMessage(t("linkUpdated"));
      } else {
        await api.post("/links", formData);
        setMessage(t("linkCreated"));
      }
      
      loadLinks();
      closeModal();
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
    }
  };

  const handleDelete = (id) => {
    setLinkToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await api.delete(`/links/${linkToDelete}`);
      setMessage(t("linkDeleted"));
      loadLinks();
      setShowDeleteModal(false);
      setLinkToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
      setShowDeleteModal(false);
      setLinkToDelete(null);
    }
  };

  const openAddModal = () => {
    setFormData({ title: "", url: "", category: "", note: "" });
    setEditingLink(null);
    setShowAddModal(true);
  };

  const openEditModal = (link) => {
    setFormData({
      title: link.title || "",
      url: link.url || "",
      category: link.category || "",
      note: link.note || ""
    });
    setEditingLink(link);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingLink(null);
    setFormData({ title: "", url: "", category: "", note: "" });
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title={t("myLinks")} subtitle={`${links.length} ${t("linksSaved")}`} />

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

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">{t("addLink")}</span>
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes(t("success")) || message.includes("erfolgreich") || message.includes("successfully")
              ? isDarkMode ? "bg-green-500/20 text-green-200 border border-green-400/30" : "bg-green-100 text-green-700 border border-green-300"
              : isDarkMode ? "bg-red-500/20 text-red-200 border border-red-400/30" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        {links.length === 0 ? (
          <div className="text-center py-20 mt-16">
            <LinkIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-purple-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("noLinks")}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>
              {t("addFirstLink")}
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {t("addLink")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {links.map(link => (
              <div
                key={link._id}
                ref={el => linkRefs.current[link._id] = el}
                className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  highlightId === link._id
                    ? isDarkMode 
                      ? 'bg-purple-500/30 border-purple-400 shadow-2xl shadow-purple-500/50 scale-105'
                      : 'bg-purple-100 border-purple-400 shadow-2xl shadow-purple-300/50 scale-105'
                    : isDarkMode
                      ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                      : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-purple-500 to-purple-700'
                    }`}>
                      <LinkIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {link.title}
                      </h3>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`}>
                        {getDomainFromUrl(link.url)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-xs hover:underline ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{t("visit")}</span>
                    </a>
                  )}

                  {link.note && (
                    <div className={`flex items-start gap-1.5 ${isDarkMode ? 'text-purple-100' : 'text-gray-700'}`}>
                      <FileText className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                      <p className="text-xs line-clamp-2">{link.note}</p>
                    </div>
                  )}

                  {link.category && (
                    <div className="flex items-center gap-1.5">
                      <Tag className={`w-3 h-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        isDarkMode 
                          ? 'bg-purple-500/20 border-purple-400/30 text-purple-200'
                          : 'bg-purple-50 border-purple-200 text-purple-700'
                      }`}>
                        {link.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`flex gap-1.5 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <button
                    onClick={() => openEditModal(link)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                      isDarkMode
                        ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/30'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'
                    }`}
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="font-medium">{t("edit")}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                      isDarkMode
                        ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/30'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="font-medium">{t("delete")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingLink ? t("editLink") : t("newLink")}
              </h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  {t("title")} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="Google"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  {t("url")} *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="https://google.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  {t("category")}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="z.B. Arbeit, Uni, Privat"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  {t("note")}
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="Optionale Notiz zum Link..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingLink ? t("update") : t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t("delete")} Link?
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("deleteLinkConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setLinkToDelete(null);
                }}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
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

      <Footer />
    </div>
  );
}