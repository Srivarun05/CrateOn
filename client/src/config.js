const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

export const API_BASE_URL = `${API_ORIGIN}/api`;
export const SERVER_BASE_URL = API_ORIGIN;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${SERVER_BASE_URL}/${imagePath.replace(/\\/g, '/')}`;
};
