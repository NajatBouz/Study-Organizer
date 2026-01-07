import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, Plus, Edit2, Trash2, ExternalLink, Tag, FileText, ArrowLeft, X, Save } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "",
    note: ""
  });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/links")
      .then(res => setLinks(res.data))
      .catch(err => {
        console.log(err);
        setMessage("Fehler beim Laden der Links");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        // Update existing link
        await api.put(`/links/${editingLink._id}`, formData);
        setMessage("Link erfolgreich aktualisiert!");
      } else {
        // Create new link
        await api.post("/links", formData);
        setMessage("Link erfolgreich hinzugefügt!");
      }
      
      loadLinks();
      closeModal();
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler beim Speichern des Links");
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
      setMessage("Link erfolgreich gelöscht!");
      loadLinks();
      setShowDeleteModal(false);
      setLinkToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler beim Löschen des Links");
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      {/* Header */}
      <Navbar title="Meine Links" subtitle={`${links.length} Links gespeichert`} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        
        {/* Back Button & Add Button Row */}
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
            <span className="font-medium">Zurück</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Link hinzufügen</span>
          </button>
        </div>

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

        {/* Links Grid */}
        {links.length === 0 ? (
          <div className="text-center py-20 mt-16">
            <LinkIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-purple-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Keine Links vorhanden
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              Füge deinen ersten Link hinzu!
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Link hinzufügen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {links.map(link => (
              <div
                key={link._id}
                className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isDarkMode
                    ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                    : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Link Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-purple-500 to-purple-700'
                    }`}>
                      <LinkIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {link.title}
                      </h3>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`}>
                        {getDomainFromUrl(link.url)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Link URL */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 mb-3 p-2 rounded-md transition-all group ${
                    isDarkMode
                      ? 'text-blue-300 hover:text-blue-200 bg-white/5 hover:bg-white/10'
                      : 'text-blue-600 hover:text-blue-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs truncate">{link.url}</span>
                </a>

                {/* Category & Note */}
                <div className="space-y-1.5 mb-3">
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
                  
                  {link.note && (
                    <div className={`flex items-start gap-1.5 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                      <FileText className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                      <p className="text-xs line-clamp-2">{link.note}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
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
                    <span className="font-medium">Bearbeiten</span>
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                      isDarkMode
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-400/30'
                        : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="font-medium">Löschen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingLink ? "Link bearbeiten" : "Neuer Link"}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  Titel *
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
                  placeholder="z.B. GitHub Repository"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  URL *
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
                  placeholder="https://beispiel.de"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  Kategorie
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
                  placeholder="z.B. Uni, Arbeit, Privat"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                  Notiz
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="Optionale Notiz zum Link..."
                />
              </div>

              {/* Form Actions */}
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
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingLink ? "Aktualisieren" : "Hinzufügen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lösch bestätigungs Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Link löschen?
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              Möchtest du diesen Link wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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
                Abbrechen
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Löschen
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
    </div>
  );
}