
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './', 
    // We define API_KEY specifically because the Google GenAI SDK might look for it,
    // but we will stick to import.meta.env for our own logic.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});
