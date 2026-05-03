import Link from 'next/link';

export function AnalysisEmpty() {
  return (
    <div className="text-center py-12 px-4">
      <span className="text-4xl">📊</span>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Sin datos de analisis</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
        Registra tareas y tu estado emocional para que podamos calcular tu carga academica.
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <Link
          href="/checkin"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Hacer check-in
        </Link>
        <Link
          href="/tareas"
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          Agregar tareas
        </Link>
      </div>
    </div>
  );
}
