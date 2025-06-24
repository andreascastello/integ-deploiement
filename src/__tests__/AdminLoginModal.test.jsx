import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLoginModal from "../components/AdminLoginModal";

describe("AdminLoginModal", () => {
  it("affiche le formulaire et gère la fermeture", () => {
    const onClose = vi.fn();
    render(<AdminLoginModal onClose={onClose} onLoginSuccess={vi.fn()} />);
    expect(screen.getByText(/Connexion Admin/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Annuler/));
    expect(onClose).toHaveBeenCalled();
  });

  it("gère la saisie des champs", () => {
    render(<AdminLoginModal onClose={vi.fn()} onLoginSuccess={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Email/), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/), { target: { value: "secret" } });
    expect(screen.getByPlaceholderText(/Email/)).toHaveValue("admin@ex.com");
    expect(screen.getByPlaceholderText(/Mot de passe/)).toHaveValue("secret");
  });

  it("affiche une erreur si la connexion échoue", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    render(<AdminLoginModal onClose={vi.fn()} onLoginSuccess={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Email/), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/), { target: { value: "wrong" } });
    fireEvent.click(screen.getByText(/Se connecter/));
    await waitFor(() => expect(screen.getByText(/incorrect/i)).toBeInTheDocument());
  });

  it("appelle onLoginSuccess en cas de succès", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "tokentest" }) });
    const onLoginSuccess = vi.fn();
    const onClose = vi.fn();
    render(<AdminLoginModal onClose={onClose} onLoginSuccess={onLoginSuccess} />);
    fireEvent.change(screen.getByPlaceholderText(/Email/), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/), { target: { value: "secret" } });
    fireEvent.click(screen.getByText(/Se connecter/));
    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledWith("tokentest"));
    expect(onClose).toHaveBeenCalled();
  });
}); 