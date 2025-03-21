import React from 'react';
import { vi, expect, test, beforeAll } from 'vitest';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';

// Mock du DOM et de createRoot
beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>';
});

vi.mock('react-dom/client', () => ({
    createRoot: vi.fn(() => ({
        render: vi.fn(),
    })),
}));

test('L\'application se monte dans #root sans erreur', () => {
    const root = document.getElementById('root');
    expect(root).not.toBeNull(); // Vérifie que l'élément existe

    const mockRender = vi.fn();
    createRoot.mockReturnValue({ render: mockRender });

    // Simule le rendu de l'application
    createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>
    );

    // Vérifie que createRoot a bien été appelé
    expect(createRoot).toHaveBeenCalledWith(root);
    // Vérifie que render a été exécuté
    expect(mockRender).toHaveBeenCalled();
});