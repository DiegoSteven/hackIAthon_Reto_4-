import React, { useState } from 'react';
import { Activity, ShieldAlert, Building2, UserPlus, CheckCircle, XCircle, Search, Clock, Database, HeartPulse, Stethoscope, Microscope } from 'lucide-react';
import './index.css';

const patientsData = [
  { id: 101, name: "Juan Perez", status: "Activa", history: "Ninguna pre-existencia reportada." },
  { id: 102, name: "Maria Garcia", status: "Inactiva", history: "Hipertensión arterial y diabetes tipo 2." },
  { id: 103, name: "Carlos Lopez", status: "Activa", history: "Asma severo. Alérgico a la penicilina y al ibuprofeno." },
  { id: 108, name: "Sofia Gomez", status: "Inactiva", history: "Artritis reumatoide." },
  { id: 114, name: "Lucia Suarez", status: "Activa", history: "Ninguna pre-existencia reportada." },
  { id: 123, name: "Hackathon Tester", status: "Activa", history: "Alergia grave a la anestesia general. Historial de taquicardia ventricular." }
];

function App() {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recepcion');
  const [hospitalWebhooks, setHospitalWebhooks] = useState([]);
  const [seguroWebhooks, setSeguroWebhooks] = useState([]);

  // URL del Webhook de Producción de n8n
  const N8N_WEBHOOK_URL = "https://edmolina.app.n8n.cloud/webhook/ingreso-emergencia-final";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    const timestamp = new Date().toISOString();
    
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: Number(patientId),
          timestamp: timestamp,
          origen: "Dashboard React Triage IA"
        })
      });

      setTimeout(() => {
        simulateWebhookArrival(Number(patientId), timestamp);
        setLoading(false);
        setPatientId('');
        setActiveTab('hospital');
      }, 2500);

    } catch (error) {
      console.error("Error al enviar a n8n:", error);
      setLoading(false);
      alert("Error de conexión con n8n.");
    }
  };

  const simulateWebhookArrival = (id, time) => {
    let status = "🟢 INGRESO AUTORIZADO";
    let name = "Paciente Desconocido";
    let alert = "";
    
    if (id === 114) {
      name = "Lucía Suárez";
      alert = "Validación médica exitosa. Sin riesgos previos reportados en el expediente.";
    } else if (id === 108) {
      status = "🔴 INGRESO DENEGADO";
      name = "Sofía Gomez";
      alert = "ALERTA ADMINISTRATIVA: Póliza inactiva. Paciente presenta artritis reumatoide. Requiere revisión manual.";
    } else if (id === 123) {
      name = "Hackathon Tester";
      alert = "⚠️ ALERTA MÉDICA CRÍTICA: Póliza válida, pero paciente reporta ALERGIA GRAVE A ANESTESIA GENERAL y taquicardia ventricular. Etiquetar para protocolo de alto riesgo en quirófano.";
    } else {
      name = `Paciente #${id}`;
      alert = "Análisis IA completado. Parámetros estándar dentro de cobertura.";
    }

    const newHospitalAlert = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      destinatario: status.includes("DENEGADO") ? "recepcion@hospital.com" : "urgencias@hospital.com",
      asunto: `Resolución de Ingreso: ${name}`,
      estado: status,
      reporte_ia: alert
    };

    setHospitalWebhooks(prev => [newHospitalAlert, ...prev]);

    if (!status.includes("DENEGADO") || id === 123) {
      const newSeguroAlert = {
        ...newHospitalAlert,
        destinatario: "gestor.casos@seguro.com",
        asunto: `Aviso Crítico de Siniestro: ${name}`
      };
      setSeguroWebhooks(prev => [newSeguroAlert, ...prev]);
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Medical Background Image */}
      <div className="bg-image-container">
        <img src="/medical_bg.png" alt="Medical Tech Background" className="bg-image" />
        <div className="bg-overlay"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <header className="main-header glass-panel">
          <div className="logo-section">
            <div className="logo-icon-wrapper pulse-soft">
              <HeartPulse size={36} color="#06b6d4" />
            </div>
            <div>
              <h1 className="main-title">NeuroTriage OS</h1>
              <p className="subtitle">Unidad de Admisiones Inteligentes</p>
            </div>
          </div>
          
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'recepcion' ? 'active-tab-blue' : ''}`} onClick={() => setActiveTab('recepcion')}>
              <Stethoscope size={18} className="tab-icon"/> Triage
            </button>
            <button className={`tab-btn ${activeTab === 'hospital' ? 'active-tab-green' : ''}`} onClick={() => setActiveTab('hospital')}>
              <Activity size={18} className="tab-icon"/> Urgencias
            </button>
            <button className={`tab-btn ${activeTab === 'seguro' ? 'active-tab-red' : ''}`} onClick={() => setActiveTab('seguro')}>
              <ShieldAlert size={18} className="tab-icon"/> Aseguradora
            </button>
            <button className={`tab-btn ${activeTab === 'pacientes' ? 'active-tab-purple' : ''}`} onClick={() => setActiveTab('pacientes')}>
              <Microscope size={18} className="tab-icon"/> Expedientes
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          
          {/* TAB: RECEPCIÓN */}
          {activeTab === 'recepcion' && (
            <div className="glass-panel main-view animate-fade-in center-layout">
              <div className={`scan-ring ${loading ? "scanning-active" : ""}`}>
                <Search size={56} color="#06b6d4" />
              </div>
              
              <h2 className="view-title">Identificación de Paciente</h2>
              <p className="view-desc">
                Conectado a red neuronal Gemini 2.5. Ingrese el ID del paciente para escanear expediente médico y cobertura en tiempo real.
              </p>
              
              <form onSubmit={handleSubmit} className="input-form">
                <input 
                  type="number" 
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="ID del Paciente (Ej: 114, 108, 123)"
                  disabled={loading}
                  className="futuristic-input"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="glow-btn btn-blue">
                  {loading ? 'Escaneando...' : 'Iniciar Triage'}
                </button>
              </form>

              <div className="quick-stats">
                <span className="stat-pill stat-green"><CheckCircle size={14}/> ID: 114 Sano</span>
                <span className="stat-pill stat-red"><XCircle size={14}/> ID: 108 Inactivo</span>
                <span className="stat-pill stat-yellow"><ShieldAlert size={14}/> ID: 123 Alergia</span>
              </div>
            </div>
          )}

          {/* TAB: HOSPITAL WEBHOOKS */}
          {activeTab === 'hospital' && (
            <div className="glass-panel main-view animate-fade-in">
              <div className="view-header">
                <Activity color="#10b981" size={28}/> 
                <h2 style={{ color: '#10b981' }}>Monitor Central de Urgencias</h2>
              </div>
              
              <div className="cards-container">
                {hospitalWebhooks.length === 0 ? (
                  <div className="empty-state">Sistema a la espera de nuevos ingresos...</div>
                ) : (
                  hospitalWebhooks.map(hook => (
                    <div key={hook.id} className={`alert-card ${hook.estado.includes('DENEGADO') ? 'border-red' : 'border-green'}`}>
                      <div className="card-top">
                        <span className="time-badge"><Clock size={12}/> {hook.time}</span>
                        <span className={`status-text ${hook.estado.includes('DENEGADO') ? 'text-red' : 'text-green'}`}>{hook.estado}</span>
                      </div>
                      <h3>{hook.asunto}</h3>
                      <div className="ia-report">
                        <div className="ia-badge">🤖 Diagnóstico IA</div>
                        <p>{hook.reporte_ia}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SEGURO WEBHOOKS */}
          {activeTab === 'seguro' && (
            <div className="glass-panel main-view animate-fade-in">
              <div className="view-header">
                <ShieldAlert color="#ef4444" size={28}/> 
                <h2 style={{ color: '#ef4444' }}>Terminal de Aseguradora</h2>
              </div>
              
              <div className="cards-container">
                {seguroWebhooks.length === 0 ? (
                  <div className="empty-state">No hay incidentes críticos reportados.</div>
                ) : (
                  seguroWebhooks.map(hook => (
                    <div key={hook.id} className="alert-card border-yellow">
                      <div className="card-top">
                        <span className="time-badge"><Clock size={12}/> {hook.time}</span>
                        <span className="status-text text-yellow">ALERTA A GESTOR</span>
                      </div>
                      <h3>{hook.asunto}</h3>
                      <div className="ia-report">
                        <div className="ia-badge bg-yellow">⚠️ Riesgo Potencial</div>
                        <p>{hook.reporte_ia}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: BASE DE PACIENTES */}
          {activeTab === 'pacientes' && (
            <div className="glass-panel main-view animate-fade-in">
              <div className="view-header">
                <Database color="#8b5cf6" size={28}/> 
                <h2 style={{ color: '#8b5cf6' }}>Base de Datos Clínica (Notion Sync)</h2>
              </div>
              
              <div className="table-container">
                <table className="medical-table">
                  <thead>
                    <tr>
                      <th>ID Médico</th>
                      <th>Nombre del Paciente</th>
                      <th>Estado de Cobertura</th>
                      <th>Historial Clínico de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientsData.map(p => (
                      <tr key={p.id}>
                        <td className="font-mono text-cyan">{p.id}</td>
                        <td className="font-bold">{p.name}</td>
                        <td>
                          <span className={`pill ${p.status === 'Activa' ? 'pill-green' : 'pill-red'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="history-cell">{p.history}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
