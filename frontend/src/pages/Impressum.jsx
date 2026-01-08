import { ArrowLeft, Mail, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Impressum() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title="Impressum" showActions={false} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Zurück</span>
          </button>
        </div>

        {/* Content */}
        <div className={`rounded-xl p-8 border ${
          isDarkMode
            ? 'bg-white/10 backdrop-blur-sm border-white/20'
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Impressum
          </h1>

          <div className="space-y-6">
            {/* Angaben gemäß § 5 TMG */}
            <div>
              <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Angaben gemäß § 5 TMG
              </h2>
              <div className="space-y-2">
                <div className={`flex items-start gap-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                  <User className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  <div>
                    <p className="font-semibold">Najat Bouzerouata</p>
                    <p className="text-sm">Study Organizer</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                  <MapPin className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  <div>
                    <p>Müsli Schale 123</p>
                    <p>12345 Haferflocken</p>
                    <p>Deutschland</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Kontakt
              </h2>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  <a href="mailto:Najat@müsli.com" className="hover:underline">
                    Najat@müsli.com
                  </a>
                </div>
              </div>
            </div>

            {/* Haftungsausschluss */}
            <div>
              <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Haftungsausschluss
              </h2>
              <div className={`space-y-3 text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <div>
                  <h3 className="font-semibold mb-1">Haftung für Inhalte</h3>
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                    allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                    verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                    zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                    Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                    Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Urheberrecht</h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                    Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </div>
            </div>

            {/* Hinweis */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <p className="text-sm">
                <strong>Hinweis:</strong> Dies ist ein Studien-/Lernprojekt. Die angegebenen Kontaktdaten sind Platzhalter 
                und müssen vor produktivem Einsatz durch echte Daten ersetzt werden.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}