/**
 * Dev: origin rỗng → axios + SockJS gọi /api, /ws qua Vite proxy (không CORS).
 * Build/preview không proxy: mặc định http://localhost:8080.
 * Override: VITE_API_ORIGIN=https://api.example.com
 */
const trimSlash = (s) => s.replace(/\/+$/, '');

export const backendOrigin =
  (import.meta.env.VITE_API_ORIGIN && trimSlash(import.meta.env.VITE_API_ORIGIN)) ||
  (import.meta.env.DEV ? '' : 'http://localhost:8080');

export const apiBaseUrl = backendOrigin ? `${backendOrigin}/api` : '/api';

export const sockJsUrl = backendOrigin ? `${backendOrigin}/ws` : 'http://localhost:8080/ws';
