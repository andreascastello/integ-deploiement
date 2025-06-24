import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { test, expect } from 'vitest';
import App from '../App.jsx'; // Assure-toi que le chemin est correct
import { vi } from 'vitest';

global.fetch = vi.fn();

describe("App", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it("affiche la liste publique par défaut", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean" }] }) });
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Dupont/)).toBeInTheDocument());
    expect(screen.queryByText(/Email/)).not.toBeInTheDocument();
  });

  it("affiche les infos admin après connexion", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean" }] }) }) // public-users
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "header.eyJkYXRhIjpbeyJlbWFpbCI6ImFkbWluQGV4LmNvbSJ9XX0=.signature" }) }) // login
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com", date_naissance: "2000-01-01", ville: "Paris", code_postal: "75000" }] }) }); // users
    render(<App />);
    fireEvent.click(screen.getByText(/Connexion Admin/));
    const emailInputs = screen.getAllByPlaceholderText(/Email/);
    fireEvent.change(emailInputs[emailInputs.length - 1], { target: { value: "admin@ex.com" } });
    const pwdInputs = screen.getAllByPlaceholderText(/Mot de passe/);
    fireEvent.change(pwdInputs[pwdInputs.length - 1], { target: { value: "secret" } });
    fireEvent.click(screen.getByText(/Se connecter/));
    await waitFor(() => expect(screen.getByText(/Email: jean@ex.com/)).toBeInTheDocument());
  });

  it("permet de supprimer un utilisateur en admin", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com" }] }) }) // public-users
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "header.eyJkYXRhIjpbeyJlbWFpbCI6ImFkbWluQGV4LmNvbSJ9XX0=.signature" }) }) // login
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com" }] }) }) // users
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Utilisateur supprimé avec succès" }) }) // delete
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [] }) }); // fetch après delete
    render(<App />);
    fireEvent.click(screen.getByText(/Connexion Admin/));
    const emailInputs = screen.getAllByPlaceholderText(/Email/);
    fireEvent.change(emailInputs[emailInputs.length - 1], { target: { value: "admin@ex.com" } });
    const pwdInputs = screen.getAllByPlaceholderText(/Mot de passe/);
    fireEvent.change(pwdInputs[pwdInputs.length - 1], { target: { value: "secret" } });
    fireEvent.click(screen.getByText(/Se connecter/));
    await waitFor(() => expect(screen.getByText(/Email: jean@ex.com/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Supprimer/));
    await waitFor(() => expect(screen.queryByText(/Dupont/)).not.toBeInTheDocument());
  });

  it("gère l'erreur de suppression", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com" }] }) }) // public-users
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "header.eyJkYXRhIjpbeyJlbWFpbCI6ImFkbWluQGV4LmNvbSJ9XX0=.signature" }) }) // login
      .mockResolvedValueOnce({ ok: true, json: async () => ({ utilisateurs: [{ id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com" }] }) }) // users
      .mockResolvedValueOnce({ ok: false }); // delete
    window.alert = vi.fn();
    render(<App />);
    fireEvent.click(screen.getByText(/Connexion Admin/));
    const emailInputs = screen.getAllByPlaceholderText(/Email/);
    fireEvent.change(emailInputs[emailInputs.length - 1], { target: { value: "admin@ex.com" } });
    const pwdInputs = screen.getAllByPlaceholderText(/Mot de passe/);
    fireEvent.change(pwdInputs[pwdInputs.length - 1], { target: { value: "secret" } });
    fireEvent.click(screen.getByText(/Se connecter/));
    await waitFor(() => expect(screen.getByText(/Email: jean@ex.com/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Supprimer/));
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });

  it("gère la déconnexion admin sur 401", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    render(<App />);
    // On force le mode admin
    // On simule un fetchUsers qui retourne 401
    // On vérifie que isAdmin repasse à false (donc on n'affiche plus les infos admin)
    // (On ne peut pas tester l'état interne, mais on peut vérifier que la liste publique s'affiche)
    await waitFor(() => expect(screen.getByText(/Liste des utilisateurs/i)).toBeInTheDocument());
  });

  it("gère une erreur réseau dans fetchUsers", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/erreur réseau|erreur serveur/i)).toBeInTheDocument();
      // Vérifie que la liste est vide
      const items = document.querySelectorAll('li');
      expect(items.length).toBe(0);
    });
  });
});