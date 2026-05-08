document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admissionForm');
    const input = document.getElementById('pacienteId');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const spinner = document.querySelector('.spinner');
    const statusMessage = document.getElementById('statusMessage');

    // CONFIGURACIÓN: URL del Webhook
    // CONFIGURACIÓN: URL del Webhook de n8n
    const WEBHOOK_URL = 'https://edmolina.app.n8n.cloud/webhook-test/ingreso-emergencia';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const pacienteId = input.value.trim();
        if (!pacienteId) return;

        // UI: Mostrar estado de carga
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
        statusMessage.classList.add('hidden');
        statusMessage.className = 'status-message hidden';

        try {
            // Enviar datos al webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paciente_id: Number(pacienteId),
                    timestamp: new Date().toISOString(),
                    origen: "Portal Web Urgencias"
                })
            });

            // webhook.site a veces no retorna CORS, el modo 'no-cors' previene errores de navegador
            // pero para fines demostrativos asumiremos que responde bien.
            
            if (response.ok || response.type === 'opaque') {
                showStatus('Ingreso registrado exitosamente. Notificación enviada al sistema central.', 'success');
                input.value = ''; // Limpiar input
            } else {
                throw new Error('Error en la respuesta del servidor');
            }

        } catch (error) {
            console.error('Error al contactar el webhook:', error);
            showStatus('Error de conexión. No se pudo registrar el ingreso. Intente nuevamente.', 'error');
        } finally {
            // Restaurar UI
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'status-success', 'status-error');
        statusMessage.classList.add(`status-${type}`);
    }
});
