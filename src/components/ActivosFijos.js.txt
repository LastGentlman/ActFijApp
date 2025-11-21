import React, { useState, useMemo } from 'react';
import { Download, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const ActivosFijos = () => {
  const datosIniciales = [
    // ... (aquí va tu lista completa de 45 activos)
    { id: 1, categoria: 'Estación de Trabajo', item: 'PC', valor: 8546, fuente: 'Amazon' },
    { id: 2, categoria: 'Estación de Trabajo', item: 'Monitor Samsung Curvo', valor: 1999, fuente: 'Amazon' },
    // ... etc.
  ];

  const [activos, setActivos] = useState(datosIniciales);
  // ... (el resto del código de tu componente que ya tienes, sin cambios en la lógica)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({ categoria: '', item: '', valor: '', fuente: '' });

  const totalesPorCategoria = useMemo(() => {
    const totales = {};
    activos.forEach(activo => {
      if (!totales[activo.categoria]) {
        totales[activo.categoria] = 0;
      }
      totales[activo.categoria] += activo.valor;
    });
    return totales;
  }, [activos]);

  const totalGeneral = useMemo(() => {
    return activos.reduce((sum, activo) => sum + activo.valor, 0);
  }, [activos]);

  const abrirModal = (activo = null) => {
    if (activo) {
      setEditando(activo.id);
      setFormulario({ categoria: activo.categoria, item: activo.item, valor: activo.valor.toString(), fuente: activo.fuente });
    } else {
      setEditando(null);
      setFormulario({ categoria: '', item: '', valor: '', fuente: '' });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setFormulario({ categoria: '', item: '', valor: '', fuente: '' });
  };

  const guardarActivo = () => {
    // ... (tu lógica de guardado)
  };

  const eliminarActivo = (id) => {
    // ... (tu lógica de borrado)
  };

  const exportToCSV = () => {
    // ... (tu lógica de exportación)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* --- ENCABEZADO RESPONSIVO --- */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center md:text-left">
              Registro de Activos Fijos
            </h1>
            <div className="flex gap-3 justify-center md:justify-end">
              <button onClick={() => abrirModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar</span>
              </button>
              <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                <Download size={20} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* ... tus tarjetas de resumen ... */}
          </div>
        </div>

        {/* ... tu resumen por categoría ... */}

        {/* --- VISTA DE TARJETAS PARA MÓVIL --- */}
        <div className="md:hidden space-y-4">
          {activos.map((activo) => (
            <div key={activo.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-gray-800">{activo.item}</p>
                  <p className="text-sm text-gray-500">{activo.categoria}</p>
                </div>
                <div className="flex gap-3 flex-shrink-0 ml-2">
                  <button onClick={() => abrirModal(activo)} className="text-blue-600"><Edit2 size={18} /></button>
                  <button onClick={() => eliminarActivo(activo.id)} className="text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">Fuente: {activo.fuente}</p>
                <p className="text-lg font-semibold text-green-700">
                  ${activo.valor.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- VISTA DE TABLA PARA ESCRITORIO --- */}
        <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* ... tu código de tabla existente ... */}
            </table>
          </div>
        </div>
      </div>

      {/* ... tu código del modal ... */}
    </div>
  );
};

export default ActivosFijos;
