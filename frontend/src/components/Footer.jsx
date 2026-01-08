import { Github, Linkedin, FileText, Shield } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function Footer() {
  const { isDarkMode } = useDarkMode();

  return (
    <footer className={`mt-20 border-t ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Name & Copyright */}
          <div className={`text-center md:text-left ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} Najat Bouzerouata - Study Organizer
            </p>
          </div>

          {/* Center: Legal Links */}
          <div className="flex items-center gap-6">
            <a
              href="/impressum"
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isDarkMode
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Impressum</span>
            </a>
            <a
              href="/datenschutz"
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isDarkMode
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Datenschutz</span>
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/NajatBouz"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/najat-b-747637316/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-blue-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
              }`}
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}