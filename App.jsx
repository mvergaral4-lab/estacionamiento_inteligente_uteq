import React, { useState } from 'react';
import { useEspacios } from './hooks/useEspacios';

export function App() {
  const { espacios, loading } = useEspacios();
  const [selectedEspacio, setSelectedEspacio] = useState(null);
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterColumna, setFilterColumna] = useState('Todas');
  const [simulatedData, setSimulatedData] = useState({});

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f4f6f8' }}>
        <h2>Cargando monitoreo UTEQ...</h2>
      </div>
    );
  }

  const currentSelected = espacios.find(e => e.id === selectedEspacio?.id) || selectedEspacio;

  const displayEspacio = currentSelected ? {
    ...currentSelected,
    ...(simulatedData[currentSelected.id] || {})
  } : null;

  const total = espacios.length;
  const libres = espacios.filter(e => e.estado === 'libre').length;
  const ocupados = espacios.filter(e => e.estado === 'ocupado').length;
  const porcLibres = total > 0 ? Math.round((libres / total) * 100) : 0;
  const porcOcupados = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  const espaciosFiltrados = espacios.filter(e => {
    const matchEstado = filterEstado === 'Todos' ? true :
                       filterEstado === 'Libres' ? e.estado === 'libre' :
                       e.estado === 'ocupado';
    const matchCol = filterColumna === 'Todas' ? true : e.columna === Number(filterColumna);
    return matchEstado && matchCol;
  });

  const getCodigoCorto = (e) => {
    const letra = String.fromCharCode(64 + e.columna);
    const num = String(e.numero || e.id.slice(-2)).padStart(2, '0');
    return `${letra}${num}`;
  };

  const handleSimularCambio = () => {
    if (!displayEspacio) return;

    const esOcupado = displayEspacio.estado === 'ocupado';
    const nuevoEstado = esOcupado ? 'libre' : 'ocupado';
    const nuevaDistancia = esOcupado ? Math.floor(Math.random() * 80) + 110 : Math.floor(Math.random() * 30) + 10;

    setSimulatedData(prev => ({
      ...prev,
      [displayEspacio.id]: {
        estado: nuevoEstado,
        distanciaDetectada: nuevaDistancia,
        fechaHora: Date.now()
      }
    }));
  };

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      
      {/* Navbar Superior */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0f5132', color: '#fff', fontWeight: 'bold', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            U
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f5132' }}>UTEQ Smart Parking</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Monitoreo telemático del parqueadero</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: '#475569' }}>
          <span style={{ fontWeight: '600', color: '#0f5132', borderBottom: '2px solid #0f5132', paddingBottom: '4px' }}>Resumen</span>
          <span>Parqueadero</span>
          <span>Geometría</span>
          <span style={{ background: '#e6f4ea', color: '#137333', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#137333', borderRadius: '50%' }}></span> RTDB en vivo
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
          <div>
            <small style={{ color: '#0f5132', fontWeight: 'bold', letterSpacing: '1px', fontSize: '11px' }}>CAMPUS UTEQ • QUEVEDO</small>
            <h1 style={{ margin: '4px 0 8px 0', fontSize: '32px', color: '#0f172a' }}>Parqueadero inteligente</h1>
            <p style={{ margin: 0, color: '#64748b', maxWidth: '650px', fontSize: '14px', lineHeight: '1.5' }}>
              Simulación de 80 sensores ultrasónicos organizados en cuatro columnas. Cada cuadro representa una plaza y se actualiza como si recibiera eventos desde Firebase Realtime Database.
            </p>
          </div>
          <button style={{ background: '#0f5132', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            Descargar JSON para RTDB
          </button>
        </div>

        {/* Métricas generales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px' }}>TOTAL</small>
            <h2 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#0f172a' }}>{total}</h2>
            <small style={{ color: '#94a3b8', fontSize: '12px' }}>espacios monitoreados</small>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '11px' }}>DISPONIBLES</small>
            <h2 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#16a34a' }}>{libres}</h2>
            <small style={{ color: '#94a3b8', fontSize: '12px' }}>{porcLibres}% del parqueadero</small>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '11px' }}>OCUPADOS</small>
            <h2 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#dc2626' }}>{ocupados}</h2>
            <small style={{ color: '#94a3b8', fontSize: '12px' }}>{porcOcupados}% del parqueadero</small>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <small style={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px' }}>DISTRIBUCIÓN</small>
            <h2 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#0f172a' }}>4 × 20</h2>
            <small style={{ color: '#94a3b8', fontSize: '12px' }}>columnas × espacios</small>
          </div>
        </div>

        {/* Matriz y Panel Lateral */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>
          
          {/* Matriz 4x20 */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <small style={{ color: '#0f5132', fontWeight: 'bold', fontSize: '11px' }}>VISTA OPERATIVA</small>
                <h3 style={{ margin: '2px 0 0 0', color: '#0f172a' }}>Disponibilidad por espacio</h3>
              </div>
              <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                <span>🟢 Libre</span>
                <span>🔴 Ocupado</span>
                <span>⚪ Seleccionado</span>
              </div>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
                {['Todos', 'Libres', 'Ocupados'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterEstado(f)}
                    style={{
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: filterEstado === f ? '#fff' : 'transparent',
                      color: filterEstado === f ? '#0f172a' : '#64748b'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
                {['Todas', '1', '2', '3', '4'].map((col) => {
                  const label = col === 'Todas' ? 'Todas' : String.fromCharCode(64 + Number(col));
                  return (
                    <button
                      key={col}
                      onClick={() => setFilterColumna(col)}
                      style={{
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: filterColumna === col ? '#fff' : 'transparent',
                        color: filterColumna === col ? '#0f172a' : '#64748b'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            <div style={{ background: '#18191c', borderRadius: '12px', padding: '20px' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #334155', paddingBottom: '12px', marginBottom: '20px', color: '#94a3b8', fontSize: '12px', letterSpacing: '4px', fontWeight: 'bold' }}>
                --- ENTRADA ---
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                {[1, 2, 3, 4].map(col => (
                  <div key={col}>
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '1px' }}>
                      COLUMNA {String.fromCharCode(64 + col)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {espaciosFiltrados
                        .filter(e => e.columna === col)
                        .map(e => {
                          const localState = simulatedData[e.id] || e;
                          const isOccupied = localState.estado === 'ocupado';
                          const isSelected = displayEspacio?.id === e.id;
                          return (
                            <div
                              key={e.id}
                              onClick={() => setSelectedEspacio(e)}
                              style={{
                                background: isOccupied ? '#c53030' : '#22252a',
                                border: isSelected ? '2px solid #38a169' : isOccupied ? '1px solid #e53e3e' : '1px solid #2d3748',
                                borderRadius: '6px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: isOccupied ? '#ffffff' : '#cbd5e1' }}>
                                {getCodigoCorto(e)}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: isOccupied ? '#ffffff' : '#64748b' }}>
                                {isOccupied ? `${localState.distanciaDetectada} cm` : `LIBRE ${localState.distanciaDetectada} cm`}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'sticky', top: '20px' }}>
            <small style={{ color: '#0f5132', fontWeight: 'bold', fontSize: '11px', letterSpacing: '0.5px' }}>SENSOR SELECCIONADO</small>
            
            {displayEspacio ? (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h2 style={{ margin: 0, fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{getCodigoCorto(displayEspacio)}</h2>
                  <span style={{
                    background: displayEspacio.estado === 'libre' ? '#e6f4ea' : '#fce8e6',
                    color: displayEspacio.estado === 'libre' ? '#137333' : '#c5221f',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    {displayEspacio.estado.toUpperCase()}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #f1f5f9' }}>
                  <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>Distancia detectada</small>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0' }}>
                    {displayEspacio.distanciaDetectada} <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>cm</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min((displayEspacio.distanciaDetectada / 200) * 100, 100)}%`,
                      height: '100%',
                      background: displayEspacio.estado === 'libre' ? '#16a34a' : '#dc2626',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <small style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginTop: '8px' }}>Umbral del sensor: 100 cm</small>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>ID RTDB</span>
                    <strong style={{ fontFamily: 'monospace', color: '#334155' }}>{displayEspacio.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>COLUMNA / NÚMERO</span>
                    <strong>{String.fromCharCode(64 + displayEspacio.columna)} / {displayEspacio.numero || displayEspacio.id.slice(-2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>CENTRO GEOGRÁFICO</span>
                    <strong>{displayEspacio.ubicacion?.latitud?.toFixed(5)}, {displayEspacio.ubicacion?.longitud?.toFixed(5)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>ÚLTIMA ACTUALIZACIÓN</span>
                    <strong>{new Date(displayEspacio.fechaHora).toLocaleTimeString()}</strong>
                  </div>
                </div>

                <button
                  onClick={handleSimularCambio}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f5132',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Simular cambio de estado
                </button>

              </div>
            ) : (
              <div style={{ padding: '50px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                Haz clic en cualquier cuadro de la matriz para inspeccionar los datos telemáticos del sensor.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;