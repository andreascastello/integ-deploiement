import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import { test, expect } from 'vitest';
import App from '../App.jsx'; // Assure-toi que le chemin est correct

test('Affiche un titre', () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
});

test('Le compteur démarre à 0 et augmente quand on clique', () => {
    render(<App />);

    // Vérifie que le compteur commence bien à 0
    const button = screen.getByRole('button', { name: /count is/i });
    expect(button).toHaveTextContent('count is 0');

    // Simule un clic
    fireEvent.click(button);

    // Vérifie que le compteur a bien augmenté à 1
    expect(button).toHaveTextContent('count is 1');
});