import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Nutzungsbedingungen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title="Nutzungsbedingungen" showActions={false} />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 mb-6 rounded-lg transition-all duration-300 ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Zurück</span>
        </button>

        <div className={`rounded-2xl p-8 border backdrop-blur-sm ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
        }`}>
          
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <FileText className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Nutzungsbedingungen
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                Stand: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className={`space-y-6 ${isDarkMode ? 'text-blue-100' : 'text-gray-700'}`}>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-400/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`font-semibold ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                ⚠️ Hinweis: Dies ist eine Projekt-Vorlage
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-yellow-100' : 'text-yellow-700'}`}>
                Diese Nutzungsbedingungen sind ein Template und müssen vor dem produktiven Einsatz an die tatsächlichen Gegebenheiten angepasst werden.
              </p>
            </div>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                1. Geltungsbereich
              </h2>
              <p>
                Diese Nutzungsbedingungen regeln die Nutzung der Webanwendung "Study Organizer" (im Folgenden "Dienst" genannt). Mit der Registrierung und Nutzung des Dienstes erklären Sie sich mit diesen Bedingungen einverstanden.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                2. Kostenlose Nutzung
              </h2>
              <p className="mb-2">
                Der Study Organizer ist ein <strong>kostenloses Projekt</strong> und wird ohne Gewährleistung bereitgestellt. Die Nutzung des Dienstes ist für alle Benutzer kostenfrei.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Keine Registrierungsgebühren</li>
                <li>Keine monatlichen oder jährlichen Kosten</li>
                <li>Keine versteckten Gebühren</li>
                <li>Vollständig kostenloser Zugang zu allen Funktionen</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                3. Registrierung und Benutzerkonto
              </h2>
              <p className="mb-2">
                Zur Nutzung des Dienstes ist eine Registrierung erforderlich. Sie verpflichten sich:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Wahrheitsgemäße Angaben bei der Registrierung zu machen</li>
                <li>Ihre Zugangsdaten vertraulich zu behandeln</li>
                <li>Uns unverzüglich zu informieren, wenn Sie vermuten, dass Dritte Kenntnis von Ihren Zugangsdaten erlangt haben</li>
                <li>Für alle Aktivitäten unter Ihrem Account verantwortlich zu sein</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                4. Nutzungsrechte und -pflichten
              </h2>
              <p className="mb-2">
                Sie dürfen den Dienst ausschließlich für persönliche, nicht-kommerzielle Zwecke nutzen. Untersagt ist insbesondere:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Die Nutzung für illegale Zwecke</li>
                <li>Das Hochladen von schädlicher Software, Viren oder ähnlichem</li>
                <li>Die Verletzung von Rechten Dritter (Urheberrechte, Persönlichkeitsrechte, etc.)</li>
                <li>Die Weitergabe Ihrer Zugangsdaten an Dritte</li>
                <li>Versuche, die Sicherheit des Dienstes zu kompromittieren</li>
                <li>Die automatisierte Nutzung (Bots, Scraper, etc.) ohne ausdrückliche Genehmigung</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                5. Ihre Daten und Inhalte
              </h2>
              <p className="mb-2">
                Sie behalten alle Rechte an den von Ihnen im Dienst gespeicherten Inhalten (Kontakte, Links, Termine, Dateien, etc.). Wir nutzen Ihre Daten ausschließlich zur Bereitstellung des Dienstes.
              </p>
              <p className="mb-2">
                <strong>Wichtig:</strong> Sie sind selbst für die Sicherung Ihrer Daten verantwortlich. Wir empfehlen regelmäßige Backups Ihrer wichtigen Informationen.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                6. Verfügbarkeit und Haftung
              </h2>
              <p className="mb-2">
                Der Dienst wird "wie besehen" ohne Gewährleistung bereitgestellt. Wir bemühen uns um eine hohe Verfügbarkeit, können diese jedoch nicht garantieren.
              </p>
              <p className="mb-2">
                <strong>Haftungsbeschränkung:</strong> Als kostenloses Projekt übernehmen wir keine Haftung für:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Datenverlust oder -beschädigung</li>
                <li>Unterbrechungen oder Ausfälle des Dienstes</li>
                <li>Indirekte oder Folgeschäden</li>
                <li>Die Richtigkeit oder Vollständigkeit der gespeicherten Daten</li>
              </ul>
              <p className="mt-2">
                Die Haftung für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit bleibt hiervon unberührt.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                7. Löschung des Accounts
              </h2>
              <p>
                Sie können Ihren Account jederzeit selbstständig über die Einstellungen löschen. Mit der Löschung werden alle Ihre Daten unwiderruflich entfernt. Wir empfehlen, vor der Löschung ein Backup Ihrer wichtigen Daten anzulegen.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                8. Änderungen der Nutzungsbedingungen
              </h2>
              <p>
                Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Wesentliche Änderungen werden wir Ihnen per E-Mail oder durch einen Hinweis beim Login mitteilen. Durch die weitere Nutzung des Dienstes nach Inkrafttreten der Änderungen stimmen Sie den geänderten Bedingungen zu.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                9. Beendigung der Nutzung
              </h2>
              <p>
                Wir behalten uns das Recht vor, Accounts bei Verstößen gegen diese Nutzungsbedingungen zu sperren oder zu löschen. In schwerwiegenden Fällen kann dies ohne vorherige Ankündigung erfolgen.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                10. Datenschutz
              </h2>
              <p>
                Für den Umgang mit Ihren personenbezogenen Daten gelten unsere <a href="/datenschutz" className={`underline font-semibold ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}>Datenschutzbestimmungen</a>, die Bestandteil dieser Nutzungsbedingungen sind.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                11. Schlussbestimmungen
              </h2>
              <p className="mb-2">
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist [Ihr Gerichtsstand], soweit gesetzlich zulässig.
              </p>
              <p>
                Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
              </p>
            </section>

            <section className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'}`}>
              <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                📧 Kontakt
              </h2>
              <p>
                Bei Fragen zu diesen Nutzungsbedingungen können Sie uns kontaktieren unter:<br />
                <strong>E-Mail:</strong> Najat@müsli.com<br />
                <strong>Adresse:</strong> Müsli Schale 123, 12345 Haferflocken
              </p>
              <p className="text-sm mt-2 opacity-75">
                (Hinweis: Kontaktdaten müssen vor Produktiveinsatz angepasst werden)
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}