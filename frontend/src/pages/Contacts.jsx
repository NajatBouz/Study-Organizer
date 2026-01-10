import { useEffect, useState, useRef } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, Plus, Edit2, Trash2, Mail, Phone, Tag, ArrowLeft, X, Save } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [message, setMessage] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const contactRefs = useRef({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    category: ""
  });

  useEffect(() => {
    loadContacts();
    
    // Check for highlight parameter
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (highlight) {
      setHighlightId(highlight);
      // Scroll after short delay to ensure items are rendered
      setTimeout(() => {
        const element = contactRefs.current[highlight];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      
      // Remove highlight after 3 seconds
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [location]);

  const loadContacts = () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/contacts")
      .then(res => setContacts(res.data))
      .catch(err => {
        console.log(err);
        setMessage(t("error"));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact._id}`, formData);
        setMessage(t("contactUpdated"));
      } else {
        await api.post("/contacts", formData);
        setMessage(t("contactCreated"));
      }
      
      loadContacts();
      closeModal();
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
    }
  };

  const handleDelete = (id) => {
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      await api.delete(`/contacts/${contactToDelete}`);
      setMessage(t("contactDeleted"));
      loadContacts();
      setShowDeleteModal(false);
      setContactToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", email: "", phone: "", role: "", category: "" });
    setEditingContact(null);
    setShowAddModal(true);
  };

  const openEditModal = (contact) => {
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      role: contact.role || "",
      category: contact.category || ""
    });
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingContact(null);
    setFormData({ name: "", email: "", phone: "", role: "", category: "" });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title={t("myContacts")} subtitle={`${contacts.length} ${t("contactsSaved")}`} />

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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">{t("addContact")}</span>
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

        {contacts.length === 0 ? (
          <div className="text-center py-20 mt-16">
            <Users className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("noContacts")}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("addFirstContact")}
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {t("addContact")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {contacts.map(contact => (
              <div
                key={contact._id}
                ref={el => contactRefs.current[contact._id] = el}
                className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  highlightId === contact._id
                    ? isDarkMode 
                      ? 'bg-yellow-500/30 border-yellow-400 shadow-2xl shadow-yellow-500/50 scale-105'
                      : 'bg-yellow-100 border-yellow-400 shadow-2xl shadow-yellow-300/50 scale-105'
                    : isDarkMode
                      ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                      : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                    }`}>
                      <span className="text-white font-bold text-base">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {contact.name}
                      </h3>
                      {contact.role && (
                        <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                          {contact.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {contact.email && (
                    <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                      <Mail className={`w-3 h-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                      <a href={`mailto:${contact.email}`} className="text-xs hover:underline truncate">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                      <Phone className={`w-3 h-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                      <a href={`tel:${contact.phone}`} className="text-xs hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}

                  {contact.category && (
                    <div className="flex items-center gap-1.5">
                      <Tag className={`w-3 h-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        isDarkMode 
                          ? 'bg-blue-500/20 border-blue-400/30 text-blue-200'
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {contact.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`flex gap-1.5 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <button
                    onClick={() => openEditModal(contact)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                      isDarkMode
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-400/30'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                    }`}
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="font-medium">{t("edit")}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                      isDarkMode
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-400/30'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
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
                {editingContact ? t("editContact") : t("newContact")}
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
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("name")} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="Max Mustermann"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="max@beispiel.de"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("role")}
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="z.B. Professor, Kommilitone"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("category")}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="z.B. Uni, Arbeit, Privat"
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingContact ? t("update") : t("add")}
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
                {t("delete")} {t("contacts").slice(0, -1)}?
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("deleteContactConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setContactToDelete(null);
                }}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
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