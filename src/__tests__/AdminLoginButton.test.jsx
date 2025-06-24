import { render, screen, fireEvent } from "@testing-library/react";
import AdminLoginButton from "../components/AdminLoginButton";

describe("AdminLoginButton", () => {
  it("affiche le bouton et gère le clic", () => {
    const onClick = vi.fn();
    render(<AdminLoginButton onClick={onClick} />);
    const btn = screen.getByText(/Connexion Admin/);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
}); 