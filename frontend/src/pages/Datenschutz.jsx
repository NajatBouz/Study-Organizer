import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Datenschutz() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title="Datenschutzerklärung" showActions={false} />

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
          <div className="flex items-center gap-3 mb-8">
            <Shield className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Datenschutzerklärung
            </h1>
          </div>

          <div className="space-y-8">
            {/* Einleitung */}
            <div>
              <p className={`${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie 
                über die Verarbeitung personenbezogener Daten bei der Nutzung dieser Website gemäß der 
                Datenschutz-Grundverordnung (DSGVO).
              </p>
            </div>

            {/* Verantwortlicher */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  1. Verantwortlicher
                </h2>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p className="mb-2">Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p>Najat Bouzerouata</p>
                  <p>Müsli Schale 123</p>
                  <p>12345 Haferflocken</p>
                  <p>E-Mail: Najat@müsli.com</p>
                </div>
              </div>
            </div>

            {/* Datenerfassung */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  2. Welche Daten werden erfasst?
                </h2>
              </div>
              <div className={`text-sm space-y-3 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <div>
                  <h3 className="font-semibold mb-1">Registrierungsdaten</h3>
                  <p>
                    Bei der Registrierung erfassen wir: Name, E-Mail-Adresse und ein selbst gewähltes Passwort. 
                    Diese Daten sind zur Nutzung des Dienstes erforderlich.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Nutzungsdaten</h3>
                  <p>
                    Während der Nutzung speichern wir die von Ihnen eingegebenen Daten wie Kontakte, Links, 
                    Termine und Ordner. Diese Daten werden ausschließlich zur Bereitstellung der Funktionalität 
                    der Anwendung verwendet.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Technische Daten</h3>
                  <p>
                    Bei jedem Zugriff auf unsere Website werden automatisch Informationen erfasst, darunter 
                    IP-Adresse, Browsertyp, Betriebssystem, Zugriffszeitpunkt und aufgerufene Seiten. Diese 
                    Daten dienen der Sicherheit und technischen Bereitstellung des Dienstes.
                  </p>
                </div>
              </div>
            </div>

            {/* Rechtsgrundlage */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  3. Rechtsgrundlage der Verarbeitung
                </h2>
              </div>
              <div className={`text-sm space-y-2 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p>
                  Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
                  <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                  <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)</li>
                </ul>
              </div>
            </div>

            {/* Speicherdauer */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  4. Speicherdauer
                </h2>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p>
                  Ihre Daten werden gespeichert, solange Ihr Benutzerkonto aktiv ist. Nach Löschung Ihres Accounts 
                  werden alle personenbezogenen Daten unwiderruflich gelöscht, sofern keine gesetzlichen 
                  Aufbewahrungspflichten bestehen.
                </p>
              </div>
            </div>

            {/* Ihre Rechte */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  5. Ihre Rechte
                </h2>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p className="mb-2">Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
                  <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                  <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                  <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
                  <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                  <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                </ul>
              </div>
            </div>

            {/* Datensicherheit */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  6. Datensicherheit
                </h2>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p>
                  Wir verwenden technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige 
                  oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu 
                  schützen. Dazu gehören:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Verschlüsselte Datenübertragung (HTTPS/SSL)</li>
                  <li>Verschlüsselte Speicherung von Passwörtern</li>
                  <li>Regelmäßige Sicherheitsupdates</li>
                  <li>Zugriffsbeschränkungen</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  7. Cookies und lokale Speicherung
                </h2>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p>
                  Diese Website verwendet lokale Speichertechnologien (LocalStorage) um Ihre Sitzung und 
                  Einstellungen zu speichern. Diese Daten verbleiben auf Ihrem Gerät und werden nicht an Server 
                  übertragen. Sie können diese Daten jederzeit über Ihre Browsereinstellungen löschen.
                </p>
              </div>
            </div>

            {/* Änderungen */}
            <div>
              <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                8. Änderungen dieser Datenschutzerklärung
              </h2>
              <div className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                <p>
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder 
                  bei Änderungen des Dienstes anzupassen. Die jeweils aktuelle Datenschutzerklärung ist stets auf 
                  dieser Seite abrufbar.
                </p>
              </div>
            </div>

            {/* Hinweis */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <p className="text-sm">
                <strong>Hinweis:</strong> Dies ist ein Studien-/Lernprojekt. Diese Datenschutzerklärung dient als 
                Vorlage und muss vor produktivem Einsatz an die tatsächlichen Gegebenheiten angepasst werden.
              </p>
            </div>

            {/* Stand */}
            <div className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              <p>Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}