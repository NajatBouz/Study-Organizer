import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      setMessage("Registrierung erfolgreich! Du wirst weitergeleitet...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Fehler bei der Registrierung");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      
      
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Zurück</span>
      </Link>

      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in">
        
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Account erstellen</h2>
          <p className="text-slate-600">Registriere dich und starte durch</p>
        </div>

        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("erfolgreich") 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Dein Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email-Adresse
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Passwort
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-xs text-slate-500">
              Mindestens 6 Zeichen
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Registrieren
          </button>
        </form>

        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">oder</span>
          </div>
        </div>

        
        <div className="text-center">
          <p className="text-slate-600">
            Hast du schon einen Account?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Jetzt anmelden
            </Link>
          </p>
        </div>

        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Mit der Registrierung stimmst du unseren{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Nutzungsbedingungen
            </a>{" "}
            und der{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Datenschutzerklärung
            </a>{" "}
            zu.
          </p>
        </div>
      </div>

      
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
