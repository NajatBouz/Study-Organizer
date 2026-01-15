import { useEffect, useState, useRef } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Plus, Edit2, Trash2, Clock, FileText, ArrowLeft, X, Save } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const eventRefs = useRef({});

  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: ""
  });

  // Hilfsfunktionen für Datum/Uhrzeit
  const toLocalDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 16);
  };

  const localToUTC = (localDateTime) => {
    if (!localDateTime) return "";
    const date = new Date(localDateTime);
    return date.toISOString();
  };

  useEffect(() => {
    loadEvents();
    
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (highlight) {
      setHighlightId(highlight);
      setTimeout(() => {
        const element = eventRefs.current[highlight];
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [location]);

  const loadEvents = () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/events")
      .then(res => setEvents(res.data))
      .catch(err => {
        console.log(err);
        setMessage(t("error"));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        start: localToUTC(formData.start),
        end: localToUTC(formData.end)
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload);
        setMessage(t("eventUpdated"));
      } else {
        await api.post("/events", payload);
        setMessage(t("eventCreated"));
      }

      loadEvents();
      closeModal();
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
    }
  };

  const handleDelete = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await api.delete(`/events/${eventToDelete}`);
      setMessage(t("eventDeleted"));
      loadEvents();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const openAddModal = () => {
    setFormData({ title: "", start: "", end: "", description: "" });
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const openEditModal = (event) => {
    setFormData({
      title: event.title || "",
      start: toLocalDateTime(event.start),
      end: toLocalDateTime(event.end),
      description: event.description || ""
    });
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setFormData({ title: "", start: "", end: "", description: "" });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title={t("myEvents")} subtitle={`${events.length} ${t("eventsSaved")}`} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation / Buttons */}
        <div className="flex items-center justify-start gap-4 mb-6">
          <button onClick={() => navigate("/dashboard")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'}`}>
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{t("back")}</span>
          </button>

          <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">{t("addEvent")}</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes(t("success")) || message.includes("erfolgreich") || message.includes("successfully") ? isDarkMode ? "bg-green-500/20 text-green-200 border border-green-400/30" : "bg-green-100 text-green-700 border border-green-300" : isDarkMode ? "bg-red-500/20 text-red-200 border border-red-400/30" : "bg-red-100 text-red-700 border border-red-300"}`}>
            {message}
          </div>
        )}

        {/* Event Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20 mt-16">
            <Calendar className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-green-300' : 'text-gray-400'}`} />
            <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t("noEvents")}</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-green-200' : 'text-gray-600'}`}>{t("addFirstEvent")}</p>
            <button onClick={openAddModal} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
              {t("addEvent")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {events.map(event => (
              <div key={event._id} ref={el => eventRefs.current[event._id] = el} className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${highlightId === event._id ? isDarkMode ? 'bg-green-500/30 border-green-400 shadow-2xl shadow-green-500/50 scale-105' : 'bg-green-100 border-green-400 shadow-2xl shadow-green-300/50 scale-105' : isDarkMode ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15' : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'} ${isUpcoming(event.start) ? '' : 'opacity-75'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isUpcoming(event.start) ? isDarkMode ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-green-500 to-green-700' : isDarkMode ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 'bg-gradient-to-br from-gray-500 to-gray-700'}`}>
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                      {isUpcoming(event.start) && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-700'}`}>{t("upcoming")}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className={`flex items-start gap-1.5 ${isDarkMode ? 'text-green-100' : 'text-gray-700'}`}>
                    <Clock className={`w-3 h-3 mt-0.5 ${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />
                    <div className="text-xs flex-1">
                      <div>Start: {formatDateTime(event.start)}</div>
                      <div>Ende: {formatDateTime(event.end)}</div>
                    </div>
                  </div>

                  {event.description && (
                    <div className={`flex items-start gap-1.5 ${isDarkMode ? 'text-green-100' : 'text-gray-700'}`}>
                      <FileText className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />
                      <p className="text-xs line-clamp-2">{event.description}</p>
                    </div>
                  )}
                </div>

                <div className={`flex gap-1.5 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <button onClick={() => openEditModal(event)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${isDarkMode ? 'bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-400/30' : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'}`}>
                    <Edit2 className="w-3 h-3" />
                    <span className="font-medium">{t("edit")}</span>
                  </button>
                  <button onClick={() => handleDelete(event._id)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 border text-xs ${isDarkMode ? 'bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-400/30' : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'}`}>
                    <Trash2 className="w-3 h-3" />
                    <span className="font-medium">{t("delete")}</span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingEvent ? t("editEvent") : t("newEvent")}
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
                  {t("title")} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-green-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("startTime")} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({...formData, start: e.target.value})}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-green-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("endTime")} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({...formData, end: e.target.value})}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-green-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {t("description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-green-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingEvent ? t("update") : t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t("confirmDelete")}
              </h2>
            </div>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("deleteEventWarning")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEventToDelete(null);
                }}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
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

