import grab from 'grab-url';
import './lib/mocks';

(grab as any).defaults.baseURL = import.meta.env.VITE_API_URL;
