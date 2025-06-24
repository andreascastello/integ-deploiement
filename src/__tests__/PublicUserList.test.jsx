import { render, screen, fireEvent } from "@testing-library/react";
import PublicUserList from "../components/PublicUserList";

const users = [
  { id: 1, nom: "Dupont", prenom: "Jean", email: "jean@ex.com", date_naissance: "2000-01-01", ville: "Paris", code_postal: "75000" },
  { id: 2, nom: "Martin", prenom: "Alice", email: "alice@ex.com", date_naissance: "1995-05-05", ville: "Lyon", code_postal: "69000" }
];

describe("PublicUserList", () => {
  it("affiche la liste publique", () => {
    render(<PublicUserList users={users} isAdmin={false} />);
    expect(screen.getByText(/Dupont/)).toBeInTheDocument();
    expect(screen.getByText(/Martin/)).toBeInTheDocument();
    expect(screen.queryByText(/Email/)).not.toBeInTheDocument();
  });

  it("affiche les infos admin et le bouton supprimer", () => {
    const onDeleteUser = vi.fn();
    render(<PublicUserList users={users} isAdmin={true} onDeleteUser={onDeleteUser} adminEmail="admin@ex.com" />);
    expect(screen.getByText(/Email: jean@ex.com/)).toBeInTheDocument();
    const btns = screen.getAllByText(/Supprimer/);
    expect(btns.length).toBe(2);
    fireEvent.click(btns[0]);
    expect(onDeleteUser).toHaveBeenCalledWith(1);
  });

  it("n'affiche pas le bouton supprimer pour l'admin connecté", () => {
    const onDeleteUser = vi.fn();
    render(<PublicUserList users={[{...users[0], email: "admin@ex.com"}]} isAdmin={true} onDeleteUser={onDeleteUser} adminEmail="admin@ex.com" />);
    expect(screen.queryByText(/Supprimer/)).not.toBeInTheDocument();
  });
}); 