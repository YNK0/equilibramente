import { Wind } from 'lucide-react';

export function RegulationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
        <Wind className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">Regulación emocional</h3>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        Ejercicios de respiración, audios relajantes y pausas activas para reducir el estrés.
      </p>
    </div>
  );
}
