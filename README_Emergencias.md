# Sistema de Alerta Temprana de Ingresos a Emergencias con Agente de IA (Gemini)

Este proyecto implementa un flujo de trabajo en **n8n** diseñado para automatizar y agilizar el proceso de ingresos de asegurados a la emergencia del hospital. Ahora incluye un **Agente de IA impulsado por Google Gemini** que evalúa instantáneamente la información del paciente desde una base de datos de **Notion**.

## Arquitectura del Flujo (n8n + Gemini + Notion)

1. **Webhook Trigger**: 
   - **Propósito**: Recibe una petición HTTP POST desde el sistema de registro del hospital.
   - **Datos de entrada esperados**: `paciente_id`.

2. **Notion Node (Consultar)**:
   - **Propósito**: Busca el registro que coincida con el ID del paciente en la base de datos de Notion.
   - **Datos extraídos**: Estado de la póliza y el historial de pre-existencias médicas.

3. **Agente IA (Google Gemini Node)**:
   - **Propósito**: Actúa como un experto en seguros y triage médico.
   - **Acción**: Analiza el estado de la póliza y las pre-existencias que obtuvo de Notion. El agente determina si la póliza es válida y genera un "Resumen de Alerta" donde advierte sobre posibles complicaciones basadas en el historial del paciente.
   - **Salida**: Genera un objeto JSON estructurado con los campos `valido` (booleano) y `resumen_alerta` (texto).

4. **Parsear JSON e IF Node (Agente de decisión de flujo)**:
   - Extrae los datos que generó Gemini y verifica el valor de `valido`.
   - **Rama True**: Continúa con el ingreso aprobado.
   - **Rama False**: Envía una alerta de rechazo.

5. **Notificaciones Simultáneas**:
   - Si se aprueba, el flujo se divide para notificar a dos departamentos simultáneamente usando el análisis hecho por Gemini:
   - **Admisiones**: Se autoriza el ingreso adjuntando el resumen de alerta de la IA.
   - **Gestor de Casos**: Se emite una notificación de emergencia adjuntando el análisis clínico y de póliza generado por Gemini.

## Pasos para el HackIAthon:

1. Importar el archivo `workflow_emergencia.json` en tu instancia de n8n.
2. Crear y configurar la credencial para **Google Gemini API** (`TU_CREDENCIAL_GEMINI`).
3. Crear y configurar la credencial de **Notion API**.
4. Actualizar el **Database ID** en el nodo de Notion.
5. (Opcional) Configurar los nodos de Email o reemplazarlos por nodos de Telegram/Slack/Teams para enviar las notificaciones.
