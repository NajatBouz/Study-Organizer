import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Kein Token gefunden. Bitte fordere einen neuen Reset-Link an.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwörter stimmen nicht überein");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword
      });
      
      setMessage(response.data.message);
      setSuccess(true);
      
      //hier nach 3 sekunden zurück zum login weiterleiten
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler beim Zurücksetzen des Passworts");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      
      {/* Zurück Button */}
      <Link 
        to="/login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Zurück zum Login</span>
      </Link>

      {/* Reset Password Karte */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br rounded-full mb-4 ${
            success ? 'from-green-600 to-green-800' : 'from-blue-600 to-blue-800'
          }`}>
            {success ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {success ? "Passwort zurückgesetzt!" : "Neues Passwort setzen"}
          </h2>
          <p className="text-slate-600">
            {success 
              ? "Du wirst in Kürze zum Login weitergeleitet" 
              : "Gib dein neues Passwort ein"
            }
          </p>
        </div>

        {/* Nachricht */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            success
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        {!success && token && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Neues Passwort
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">
                Mindestens 6 Zeichen
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Passwort bestätigen
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Wird gesetzt..." : "Passwort zurücksetzen"}
            </button>
          </form>
        )}

        {/* Success - Login Link */}
        {success && (
          <div className="text-center">
            <Link 
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Jetzt anmelden
            </Link>
          </div>
        )}

        {/* kein Token - Passwort vergessen Link */}
        {!token && (
          <div className="text-center">
            <Link 
              to="/forgot-password"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Neuen Link anfordern
            </Link>
          </div>
        )}
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