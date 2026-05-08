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
  const [successMessage, setSuccessMessage] = useState('');

  // URL del Webhook de Producción de n8n
  const N8N_WEBHOOK_URL = "https://edmolina.app.n8n.cloud/webhook/ingreso-emergencia-final";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    const timestamp = new Date().toISOString();
    
    try {
      // 1. Hacemos la petición real al Webhook de n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: Number(patientId),
          timestamp: timestamp,
          origen: "Dashboard React Triage IA"
        })
      });

      // Como n8n está enviando la respuesta a webhook.site, 
      // mostramos un mensaje de éxito en pantalla.
      setLoading(false);
      setPatientId('');
      setSuccessMessage('📡 Datos enviados. Revisa la bandeja de Webhook.site para ver el resultado de la IA.');
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error("Error al enviar a n8n:", error);
      setLoading(false);
      alert("Error de conexión con n8n. Asegúrate de que el webhook devuelva un JSON.");
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

              {successMessage && (
                <div className="alert-card border-green animate-fade-in" style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{successMessage}</p>
                </div>
              )}
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
