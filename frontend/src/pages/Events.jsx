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

  
  const toLocalDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 16);
  };

  const localToUTC = (localDateTime) => {
    if (!localDateTime) return "";
    return new Date(localDateTime).toISOString();
  };

  
  useEffect(() => {
    loadEvents();

    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (highlight) {
      setHighlightId(highlight);
      setTimeout(() => {
        const el = eventRefs.current[highlight];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [location]);

  
  const loadEvents = () => {
    setAuthToken(localStorage.getItem("token"));
    api.get("/events")
      .then(res => setEvents(res.data))
      .catch(() => setMessage(t("error")));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      start: localToUTC(formData.start),
      end: localToUTC(formData.end)
    };

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload);
        setMessage(t("eventUpdated"));
      } else {
        await api.post("/events", payload);
        setMessage(t("eventCreated"));
      }
      loadEvents();
      closeModal();
    } catch {
      setMessage(t("error"));
    }
  };

  const handleDelete = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/events/${eventToDelete}`);
      setMessage(t("eventDeleted"));
      loadEvents();
    } catch {
      setMessage(t("error"));
    } finally {
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
      title: event.title,
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
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const isUpcoming = (date) => new Date(date) > new Date();

 
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50"}`}>
      <Navbar title={t("myEvents")} subtitle={`${events.length} ${t("eventsSaved")}`} />

      {/*  Lösch MODAL  */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-sm w-full shadow-2xl border ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20"
              : "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-200"
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {t("confirmDelete")}
            </h3>

            <p className={`mb-6 ${isDarkMode ? "text-green-200" : "text-gray-700"}`}>
              {t("deleteEventWarning")}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold transition-all"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
