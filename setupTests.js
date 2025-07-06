import '@testing-library/jest-dom'; // Ajoute des matchers comme toBeInTheDocument()

// Configuration des variables d'environnement pour les tests
import { vi } from 'vitest';

// Mock des variables d'environnement
vi.stubEnv('VITE_REACT_APP_SERVER_URL', 'http://localhost:8000');
vi.stubEnv('VITE_REACT_APP_EXPRESS_API_URL', 'http://localhost:3001');
vi.stubEnv('VITE_BASE_PATH', '/');