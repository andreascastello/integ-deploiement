import { render, screen, fireEvent } from "@testing-library/react";
import BlogPostList from "../components/BlogPostList";

describe("BlogPostList", () => {
  const posts = [
    {
      _id: "1",
      title: "Titre 1",
      content: "Contenu 1",
      author: { email: "auteur1@test.com" },
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Titre 2",
      content: "Contenu 2",
      author: { email: "auteur2@test.com" },
      createdAt: new Date().toISOString(),
    },
  ];

  it("affiche la liste des posts", () => {
    render(<BlogPostList posts={posts} />);
    expect(screen.getByText("Titre 1")).toBeInTheDocument();
    expect(screen.getByText("Contenu 1")).toBeInTheDocument();
    expect(screen.getByText("Titre 2")).toBeInTheDocument();
    expect(screen.getByText("Contenu 2")).toBeInTheDocument();
  });

  it("affiche le message aucun post si la liste est vide", () => {
    render(<BlogPostList posts={[]} />);
    expect(screen.getByText(/Aucun post pour le moment/i)).toBeInTheDocument();
  });

  it("affiche le bouton supprimer si admin", () => {
    render(<BlogPostList posts={posts} isAdmin={true} onDeletePost={() => {}} />);
    expect(screen.getAllByText(/Supprimer/i).length).toBe(2);
  });

  it("n'affiche pas le bouton supprimer si non admin", () => {
    render(<BlogPostList posts={posts} isAdmin={false} />);
    expect(screen.queryByText(/Supprimer/i)).not.toBeInTheDocument();
  });

  it("appelle onDeletePost au clic sur Supprimer", () => {
    const onDeletePost = vi.fn();
    render(<BlogPostList posts={posts} isAdmin={true} onDeletePost={onDeletePost} />);
    const btns = screen.getAllByText(/Supprimer/i);
    fireEvent.click(btns[0]);
    expect(onDeletePost).toHaveBeenCalledWith("1");
  });

  it("affiche une erreur si error est fourni", () => {
    render(<BlogPostList posts={posts} error="Erreur blog" />);
    expect(screen.getByText(/Erreur blog/)).toBeInTheDocument();
  });
}); 