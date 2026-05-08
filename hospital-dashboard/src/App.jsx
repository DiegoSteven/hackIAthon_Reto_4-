import React, { useState } from 'react';
import { Activity, ShieldAlert, Building2, UserPlus, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import './index.css';

function App() {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recepcion'); // recepcion, hospital, seguro
  
  // Simulated Webhook Stores
  const [hospitalWebhooks, setHospitalWebhooks] = useState([]);
  const [seguroWebhooks, setSeguroWebhooks] = useState([]);

  // URL del Webhook de n8n
  const N8N_WEBHOOK_URL = "https://edmolina.app.n8n.cloud/webhook-test/ingreso-emergencia";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    
    // Simulate creating a local record first
    const timestamp = new Date().toISOString();
    
    try {
      // We send the request to n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: Number(patientId),
          timestamp: timestamp,
          origen: "Dashboard React Triage IA"
        })
      });

      // For the hackathon demo, we will simulate the webhooks arriving 
      // by generating mock payloads based on the ID we know, 
      // since true webhooks require a backend server.
      setTimeout(() => {
        simulateWebhookArrival(Number(patientId), timestamp);
        setLoading(false);
        setPatientId('');
        // Auto-switch to hospital tab to show the WOW effect
        setActiveTab('hospital');
      }, 2500); // Simulate n8n processing time

    } catch (error) {
      console.error("Error al enviar a n8n:", error);
      setLoading(false);
      alert("Error de conexión con n8n. Revisa la consola.");
    }
  };

  // MOCK FUNCTION: In a real app, this data would come from a WebSocket or polling a backend.
  // We mock the exact n8n response logic to show a brilliant demo.
  const simulateWebhookArrival = (id, time) => {
    let status = "🟢 APROBADO";
    let name = "Paciente Desconocido";
    let alert = "";
    
    if (id === 114) {
      name = "Lucía Suárez";
      alert = "La póliza se encuentra activa y es válida. No se reportan preexistencias.";
    } else if (id === 108) {
      status = "🔴 RECHAZADO";
      name = "Sofía Gomez";
      alert = "El estado de la póliza es Inactiva. El paciente presenta historial de Artritis reumatoide. Ingreso por seguro denegado.";
    } else if (id === 123) {
      name = "Hackathon Tester";
      alert = "¡ALERTA CRÍTICA!: La póliza está activa, PERO paciente tiene alergia grave a anestesia general y taquicardia. Proceder con extrema precaución.";
    } else {
      name = `Paciente #${id}`;
      alert = "Evaluación estándar de IA procesada. Sin anomalías detectadas.";
    }

    const newHospitalAlert = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      destinatario: status.includes("RECHAZADO") ? "recepcion@hospital.com" : "admisiones@hospital.com",
      asunto: `Alerta de Ingreso: ${name}`,
      paciente: name,
      identificacion: id,
      estado: status,
      reporte_ia: alert
    };

    setHospitalWebhooks(prev => [newHospitalAlert, ...prev]);

    if (!status.includes("RECHAZADO") || id === 123) {
      const newSeguroAlert = {
        ...newHospitalAlert,
        destinatario: "gestor.casos@seguro.com",
        asunto: `Aviso Crítico a Gestor: ${name}`
      };
      setSeguroWebhooks(prev => [newSeguroAlert, ...prev]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '2rem', gap: '2rem' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
            <Activity color="#3b82f6" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '10px' }}/>
            Triage IA Central
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Sistema de Alerta Temprana - Hackathon Reto 4</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-card)', padding: '6px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setActiveTab('recepcion')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'recepcion' ? '#3b82f6' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
            <UserPlus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> Recepción
          </button>
          <button 
            onClick={() => setActiveTab('hospital')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'hospital' ? '#10b981' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
            <Building2 size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> Hospital Webhooks
          </button>
          <button 
            onClick={() => setActiveTab('seguro')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'seguro' ? '#ef4444' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
            <ShieldAlert size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> Seguro Webhooks
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', gap: '2rem', overflow: 'hidden' }}>
        
        {/* TAB: RECEPCIÓN */}
        {activeTab === 'recepcion' && (
          <div className="glass-panel animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '2rem' }}>
              <Search size={48} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ingreso de Pacientes</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px', marginBottom: '2.5rem' }}>
              Ingrese el ID del paciente. El sistema consultará a Notion y Gemini evaluará el caso en tiempo real.
            </p>
            
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', gap: '1rem' }}>
              <input 
                type="number" 
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                placeholder="ID (ej. 114, 108, 123)"
                disabled={loading}
                style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.5)', color: 'white', fontSize: '1.1rem', outline: 'none' }}
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: '16px 32px', borderRadius: '12px', border: 'none', background: loading ? '#475569' : '#3b82f6', color: 'white', fontSize: '1.1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {loading ? 'Procesando...' : 'Analizar'}
              </button>
            </form>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} color="#10b981"/> 114 (Aprobado)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={16} color="#ef4444"/> 108 (Rechazado)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={16} color="#f59e0b"/> 123 (Caso Crítico)</span>
            </div>
          </div>
        )}

        {/* TAB: HOSPITAL WEBHOOKS */}
        {activeTab === 'hospital' && (
          <div className="glass-panel animate-fade-in" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 color="#10b981" /> Terminal de Admisiones (Hospital)
            </h2>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {hospitalWebhooks.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  Esperando notificaciones de n8n...
                </div>
              ) : (
                hospitalWebhooks.map(hook => (
                  <div key={hook.id} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', borderLeft: `4px solid ${hook.estado.includes('APROBADO') ? '#10b981' : '#ef4444'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {hook.time}
                      </span>
                      <span style={{ fontWeight: '600', color: hook.estado.includes('APROBADO') ? '#10b981' : '#ef4444' }}>{hook.estado}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{hook.asunto}</h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong>Análisis IA:</strong> {hook.reporte_ia}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: SEGURO WEBHOOKS */}
        {activeTab === 'seguro' && (
          <div className="glass-panel animate-fade-in" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color="#ef4444" /> Panel de Gestor de Casos (Seguro)
            </h2>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {seguroWebhooks.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  Esperando notificaciones de n8n...
                </div>
              ) : (
                seguroWebhooks.map(hook => (
                  <div key={hook.id} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {hook.time}
                      </span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>ALERTA A GESTOR</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{hook.asunto}</h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong>Análisis IA:</strong> {hook.reporte_ia}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;
