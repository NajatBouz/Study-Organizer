import { Link } from "react-router-dom";
import { Calendar, Users, Folder, Link as LinkIcon, BookOpen, Clock } from "lucide-react";
import Footer from "../components/Footer";

export default function Home() {
  const features = [
    { icon: Calendar, label: "Termine verwalten", delay: "0s", color: "text-blue-400" },
    { icon: Users, label: "Kontakte organisieren", delay: "0.2s", color: "text-purple-400" },
    { icon: Folder, label: "Ordner strukturieren", delay: "0.4s", color: "text-green-400" },
    { icon: LinkIcon, label: "Links sammeln", delay: "0.6s", color: "text-yellow-400" },
    { icon: BookOpen, label: "Lernmaterial", delay: "0.8s", color: "text-pink-400" },
    { icon: Clock, label: "Zeit planen", delay: "1s", color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="max-w-4xl w-full">
          
          {/* Header mit Buttons */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Study Organizer
            </h1>
            <p className="text-xl lg:text-3xl text-blue-200 mb-4">
              Verwalte deine Termine, Kontakte, Ordner & Links – ganz einfach an einem Ort
            </p>
            <p className="text-lg text-blue-300 mb-8">
              Bitte logge dich ein oder erstelle einen kostenlosen Account, um loszulegen.
            </p>

            {/* Buttons direkt unter dem Text */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/login" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-64 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(to right, #68A4F1, #4A8BD8)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #5B95E0, #3A7BC7)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #68A4F1, #4A8BD8)'}
                >
                  Login
                </button>
              </Link>
              
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-64 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/50 shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Registrieren
                </button>
              </Link>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="floating-icon bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: feature.delay
                  }}
                >
                  <Icon className={`w-12 h-12 ${feature.color} mb-3 mx-auto`} />
                  <p className="text-white font-medium text-center">
                    {feature.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 flex justify-center items-center gap-4 text-blue-200">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-slate-900"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 border-2 border-slate-900"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 border-2 border-slate-900"></div>
            </div>
            <p className="text-sm">
              Bereits von <span className="font-bold text-white">200+</span> Kursteilnehmern genutzt
            </p>
          </div>
        </div>
      </div>

      {/* Footer ganz unten */}
      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

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
          animation: fade-in 0.8s ease-out;
        }

        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}