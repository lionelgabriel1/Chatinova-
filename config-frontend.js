// ============ CONFIGURAÇÃO DO FRONTEND CHATINOVA ============
// Este arquivo contém as URLs e configurações do frontend

export const frontendConfig = {
  // URL do Backend Express
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001',

  // URL do Supabase (para Realtime e autenticação)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://voogfreckytqcevwubsv.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb2dmcmVja3l0cWNldnd1YnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODMyNzgsImV4cCI6MjA5MzE1OTI3OH0.weSuc3HRzHcaEwjDQWiC-jerzCGyToMuROnGY5qMqzE',

  // Ambiente
  ENV: import.meta.env.VITE_ENV || 'development',
  IS_PRODUCTION: import.meta.env.VITE_ENV === 'production',

  // Analytics
  ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',

  // App Info
  APP_NAME: 'ChatInova',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Automação de WhatsApp com IA'
};

export default frontendConfig;
