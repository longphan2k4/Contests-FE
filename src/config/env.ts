export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || '';

export const getMediaUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // For development, use relative URLs that will be proxied by Vite
  if (import.meta.env.DEV) {
    if (path.startsWith('/')) return path;
    return `/${path}`;
  }
  
  // For production, use full URLs
  if (path.startsWith('/')) {
    return `${MEDIA_URL}${path}`;
  }
  return `${MEDIA_URL}/${path}`;
};