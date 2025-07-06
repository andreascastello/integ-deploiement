import { useEffect, useState, useRef } from "react";
import RegistrationForm from "./components/RegistrationForm";
import PublicUserList from "./components/PublicUserList";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminLoginButton from "./components/AdminLoginButton";
import { Routes, Route, Navigate } from "react-router-dom";
import BlogPostList from "./components/BlogPostList";

export default function App() {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [adminToken, setAdminToken] = useState(null);
    const [adminEmail, setAdminEmail] = useState("");
    const [fetchError, setFetchError] = useState(null);
    const [successAdminLogin, setSuccessAdminLogin] = useState(false);
    const [successDelete, setSuccessDelete] = useState(false);
    const [successLogout, setSuccessLogout] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogError, setBlogError] = useState(null);
    const titleRef = useRef();
    const contentRef = useRef();
    const [blogSuccess, setBlogSuccess] = useState("");
    const [blogErrorToast, setBlogErrorToast] = useState("");

    const fetchUsers = async () => {
        try {
            setFetchError(null);
            const headers = isAdmin && adminToken
                ? { Authorization: `Bearer ${adminToken}` }
                : {};
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/${isAdmin ? "users" : "public-users"}`, { headers });
            if (res.ok) {
                const data = await res.json();
                const userData = data.utilisateurs || data; // adapte à la structure reçue
                setUsers(userData);
            } else if (res.status === 401) {
                setIsAdmin(false);
                setAdminToken(null);
            }
        } catch (err) {
            setFetchError("Erreur réseau ou serveur");
            setUsers([]);
        }
    };

    const fetchBlogPosts = async () => {
        try {
            setBlogError(null);
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_EXPRESS_API_URL}/api/posts`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setBlogPosts(data);
            } else {
                setBlogError("Erreur lors de la récupération des posts du blog");
            }
        } catch (err) {
            setBlogError("Erreur réseau ou serveur (blog)");
            setBlogPosts([]);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!adminToken) return;
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/users?id=${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });
        if (res.ok) {
            fetchUsers();
            setSuccessDelete(true);
            setTimeout(() => setSuccessDelete(false), 2000);
        } else {
            alert("Erreur lors de la suppression de l'utilisateur");
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setAdminToken(null);
        setAdminEmail("");
        setSuccessLogout(true);
        setTimeout(() => setSuccessLogout(false), 2000);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const title = titleRef.current.value.trim();
        const content = contentRef.current.value.trim();
        if (!title || !content) {
            setBlogErrorToast("Titre et contenu obligatoires");
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_EXPRESS_API_URL}/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });
            if (res.ok) {
                setBlogSuccess("Post créé !");
                setBlogErrorToast("");
                titleRef.current.value = "";
                contentRef.current.value = "";
                fetchBlogPosts();
                setTimeout(() => setBlogSuccess(""), 2000);
            } else {
                setBlogErrorToast("Erreur lors de la création du post");
            }
        } catch (err) {
            setBlogErrorToast("Erreur réseau ou serveur");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!adminToken) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_EXPRESS_API_URL}/api/posts/${postId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.ok) {
                fetchBlogPosts();
            } else {
                alert("Erreur lors de la suppression du post");
            }
        } catch (err) {
            alert("Erreur réseau ou serveur lors de la suppression du post");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchBlogPosts();
    }, [isAdmin, adminToken]);

    console.log("VITE_REACT_APP_EXPRESS_API_URL =", import.meta.env.VITE_REACT_APP_EXPRESS_API_URL);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <BlogPostList posts={blogPosts} error={blogError} isAdmin={isAdmin} adminToken={adminToken} onDeletePost={handleDeletePost} />
                        <form onSubmit={handleCreatePost} style={{ maxWidth: 600, margin: '20px auto', background: '#fffbe6', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.07)' }}>
                            <h3 style={{ textAlign: 'center', color: '#4e220e' }}>Créer un post de blog</h3>
                            {blogSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{blogSuccess}</div>}
                            {blogErrorToast && <div style={{ color: 'red', marginBottom: 8 }}>{blogErrorToast}</div>}
                            <input ref={titleRef} type="text" placeholder="Titre" style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #d2b48c' }} />
                            <textarea ref={contentRef} placeholder="Contenu" style={{ width: '100%', minHeight: 80, marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #d2b48c' }} />
                            <button type="submit" style={{ width: '100%', background: '#4e220e', color: 'white', padding: '0.7rem', border: 'none', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>Publier</button>
                        </form>
                        {fetchError && <div style={{color: 'red'}}>{fetchError}</div>}
                        <RegistrationForm onUserCreated={fetchUsers} />
                        <AdminLoginButton onClick={() => setShowModal(true)} />
                        <PublicUserList users={users} isAdmin={isAdmin} onDeleteUser={handleDeleteUser} adminEmail={adminEmail} />
                        {successAdminLogin && (
                            <div style={{ position: 'fixed', top: 20, left: 0, right: 0, zIndex: 2000, textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', background: '#4caf50', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                    Connexion admin réussie !
                                </div>
                            </div>
                        )}
                        {successDelete && (
                            <div style={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 2000, textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', background: '#2196f3', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                    Utilisateur supprimé avec succès !
                                </div>
                            </div>
                        )}
                        {successLogout && (
                            <div style={{ position: 'fixed', top: 120, left: 0, right: 0, zIndex: 2000, textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', background: '#ff9800', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                    Déconnexion admin réussie !
                                </div>
                            </div>
                        )}
                        {isAdmin && (
                            <button onClick={handleLogout} style={{ position: 'fixed', top: '1rem', left: '1rem', padding: '0.5rem 1rem', backgroundColor: '#b71c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', zIndex: 1001 }}>
                                Déconnexion admin
                            </button>
                        )}
                        {showModal && (
                            <AdminLoginModal
                                onClose={() => setShowModal(false)}
                                onLoginSuccess={(token) => {
                                    setIsAdmin(true);
                                    setAdminToken(token);
                                    setSuccessAdminLogin(true);
                                    setTimeout(() => setSuccessAdminLogin(false), 2000);
                                    try {
                                        const payload = JSON.parse(atob(token.split('.')[1]));
                                        setAdminEmail(payload.data[0].email);
                                    } catch (e) {
                                        setAdminEmail("");
                                    }
                                }}
                            />
                        )}
                    </>
                }
            />
            {/* Route catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}