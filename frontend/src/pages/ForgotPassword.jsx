import { useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetUrl("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
      // Show reset URL in development mode
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler beim Zurücksetzen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      
      {/* Back Button */}
      <Link 
        to="/login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Zurück zum Login</span>
      </Link>

      {/* Passwort vergessen */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Passwort vergessen?</h2>
          <p className="text-slate-600">Gib deine E-Mail ein, um dein Passwort zurückzusetzen</p>
        </div>

        {/* Nachricht */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("angefordert") || message.includes("erfolgreich")
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        {/* Übung: Link */}
        {resetUrl && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300">
            <p className="font-semibold mb-2">🔧 Entwicklungsmodus:</p>
            <p className="text-sm mb-2">Kopiere diesen Link oder klicke darauf:</p>
            <a 
              href={resetUrl} 
              className="text-blue-600 hover:underline break-all text-sm font-mono"
            >
              {resetUrl}
            </a>
          </div>
        )}

        {/* Form */}
        {!resetUrl && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-Mail-Adresse
                </div>
              </label>
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Wird gesendet..." : "Passwort zurücksetzen"}
            </button>
          </form>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Hinweis:</strong> In der Entwicklungsversion wird der Reset-Link hier angezeigt. 
            In der Produktionsversion würdest du eine E-Mail erhalten.
          </p>
        </div>

        {/* Zurück zum Login */}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Zurück zum Login
          </Link>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}