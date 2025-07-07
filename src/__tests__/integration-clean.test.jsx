import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

// Mock des variables d'environnement
vi.stubEnv('VITE_REACT_APP_SERVER_URL', 'http://localhost:8000');
vi.stubEnv('VITE_REACT_APP_EXPRESS_API_URL', 'http://localhost:3001');

// Mock global de fetch
const mockFetch = vi.fn();
// eslint-disable-next-line no-undef
global.fetch = mockFetch;

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

// Helper pour render l'App avec Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe("Tests d'intégration - Tests fonctionnels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Mock par défaut pour éviter les erreurs
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Success" }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Test 1: Création d'utilisateur", () => {
    it("création d'utilisateur via formulaire avec vérification du message de succès", async () => {
      // Mock pour la récupération initiale des utilisateurs (liste vide)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour la récupération des posts de blog
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Mock pour la création de l'utilisateur
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Utilisateur créé avec succès" }),
      });

      renderWithRouter(<App />);

      // Remplir le formulaire d'inscription
      fireEvent.change(screen.getByPlaceholderText("Prénom"), {
        target: { value: "Marie" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nom"), {
        target: { value: "Dupont" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "marie.dupont@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Ville"), {
        target: { value: "Lyon" },
      });
      fireEvent.change(screen.getByPlaceholderText("Code Postal"), {
        target: { value: "69000" },
      });

      // Remplir la date de naissance
      const date = new Date();
      date.setFullYear(date.getFullYear() - 29); // 29 ans
      const birthDate = date.toISOString().split("T")[0];

      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, {
        target: { value: birthDate, name: "birthDate" },
      });

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /join us/i });
      fireEvent.click(submitButton);

      // Vérifier que l'inscription a réussi
      await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      });

      // Vérifier que fetch a été appelé pour créer l'utilisateur
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: "Dupont",
            prenom: "Marie",
            email: "marie.dupont@example.com",
            date_naissance: birthDate,
            ville: "Lyon",
            code_postal: "69000",
          }),
        })
      );
    });
  });

  describe("Test 2: Connexion admin", () => {
    it("connexion admin réussie avec vérification du bouton de déconnexion", async () => {
      // Mock pour la récupération des utilisateurs (public)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour la récupération des posts de blog
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Mock pour la connexion admin
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "admin-token-123" }),
      });

      // Mock pour la récupération des utilisateurs (admin)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          utilisateurs: [
            {
              id: 1,
              nom: "Doe",
              prenom: "John",
              email: "john@example.com",
              ville: "Paris",
              code_postal: "75000",
            },
          ],
        }),
      });

      renderWithRouter(<App />);

      // Ouvrir la modal de connexion admin
      const adminButton = screen.getByText(/connexion admin/i);
      fireEvent.click(adminButton);

      // Remplir les identifiants admin
      const emailInput = screen.getAllByPlaceholderText(/email/i)[1]; // Le deuxième input email
      const passwordInput = screen.getByPlaceholderText(/mot de passe/i);
      
      fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "adminpass" } });

      // Se connecter
      const loginButton = screen.getByText(/se connecter/i);
      fireEvent.click(loginButton);

      // Vérifier que la connexion a réussi en cherchant le bouton de déconnexion
      await waitFor(() => {
        expect(screen.getByText(/déconnexion admin/i)).toBeInTheDocument();
      });

      // Vérifier que fetch a été appelé pour la connexion
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "admin@example.com",
            password: "adminpass",
          }),
        })
      );
    });
  });

  describe("Test 3: Gestion des blogs", () => {
    it("récupération des posts de blog réussie", async () => {
      // Mock pour la récupération des utilisateurs
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour la récupération des posts de blog
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            _id: "1",
            title: "Premier post",
            content: "Contenu du premier post",
            author: "John Doe",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            _id: "2",
            title: "Deuxième post",
            content: "Contenu du deuxième post",
            author: "Jane Smith",
            createdAt: "2024-01-02T00:00:00.000Z",
          },
        ],
      });

      renderWithRouter(<App />);

      // Vérifier que les posts sont affichés
      await waitFor(() => {
        expect(screen.getByText("Premier post")).toBeInTheDocument();
        expect(screen.getByText("Deuxième post")).toBeInTheDocument();
        expect(screen.getByText("Contenu du premier post")).toBeInTheDocument();
        expect(screen.getByText("Contenu du deuxième post")).toBeInTheDocument();
      });

      // Vérifier que fetch a été appelé pour récupérer les posts
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/posts",
        expect.objectContaining({
          cache: "no-store",
        })
      );
    });

    it("création d'un nouveau post de blog", async () => {
      // Mock pour la récupération initiale des utilisateurs
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour la récupération initiale des posts (liste vide)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Mock pour la création du post
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Post créé avec succès" }),
      });

      // Mock pour la récupération après création
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            _id: "1",
            title: "Nouveau post",
            content: "Contenu du nouveau post",
            author: "Test User",
            createdAt: "2024-01-03T00:00:00.000Z",
          },
        ],
      });

      renderWithRouter(<App />);

      // Remplir le formulaire de création de post
      const titleInput = screen.getByPlaceholderText("Titre");
      const contentInput = screen.getByPlaceholderText("Contenu");
      
      fireEvent.change(titleInput, { target: { value: "Nouveau post" } });
      fireEvent.change(contentInput, { target: { value: "Contenu du nouveau post" } });

      // Soumettre le formulaire
      const publishButton = screen.getByRole("button", { name: /publier/i });
      fireEvent.click(publishButton);

      // Vérifier que le post a été créé
      await waitFor(() => {
        expect(screen.getByText("Nouveau post")).toBeInTheDocument();
        expect(screen.getByText("Contenu du nouveau post")).toBeInTheDocument();
      });

      // Vérifier que fetch a été appelé pour créer le post
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/posts",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Nouveau post",
            content: "Contenu du nouveau post",
          }),
        })
      );
    });
  });

  describe("Test 4: Gestion des erreurs", () => {
    it("gestion d'erreur lors de la création d'utilisateur", async () => {
      // Mock pour la récupération initiale des utilisateurs
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour la récupération des posts de blog
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Mock pour une erreur lors de la création
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      renderWithRouter(<App />);

      // Remplir le formulaire d'inscription
      fireEvent.change(screen.getByPlaceholderText("Prénom"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nom"), {
        target: { value: "User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Ville"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByPlaceholderText("Code Postal"), {
        target: { value: "12345" },
      });

      const date = new Date();
      date.setFullYear(date.getFullYear() - 25);
      const birthDate = date.toISOString().split("T")[0];

      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, {
        target: { value: birthDate, name: "birthDate" },
      });

      // Soumettre le formulaire
      const submitButton = screen.getByRole("button", { name: /join us/i });
      fireEvent.click(submitButton);

      // Vérifier que l'erreur est gérée
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it("gestion d'erreur lors de la récupération des posts de blog", async () => {
      // Mock pour la récupération des utilisateurs
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

      // Mock pour une erreur lors de la récupération des posts
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      renderWithRouter(<App />);

      // Vérifier que l'erreur est affichée
      await waitFor(() => {
        expect(screen.getByText(/erreur réseau ou serveur \(blog\)/i)).toBeInTheDocument();
      });
    });
  });
}); 