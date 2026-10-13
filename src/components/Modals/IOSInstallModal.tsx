import React from 'react';
import { Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-[#1D3A4C] text-white">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://appdesignproyectos.com/tribuicono.png" 
              alt="Tribu" 
              className="w-7 h-7 rounded-lg object-contain bg-white/10 p-0.5" 
            />
            <h3 className="text-sm font-semibold">Instalar en iPhone o iPad</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            Para instalar <strong className="text-slate-900 font-semibold">Tribu Wellness Club</strong> como una aplicación independiente en tu pantalla de inicio:
          </p>

          <ol className="space-y-3">
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                1
              </div>
              <div>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  Toca el botón Compartir <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Ubicado en la barra de navegación inferior de Safari.</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-[#B4901E] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                2
              </div>
              <div>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  Selecciona "Agregar a Inicio" <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" />
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Desplázate hacia abajo en el menú de opciones.</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                3
              </div>
              <div>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  Confirma tocando "Agregar" <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">El icono aparecerá inmediatamente en la pantalla de inicio de tu dispositivo.</p>
              </div>
            </li>
          </ol>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1D3A4C] text-white text-xs font-semibold hover:bg-[#152a37] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
