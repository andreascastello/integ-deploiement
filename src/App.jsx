import { useEffect, useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import PublicUserList from "./components/PublicUserList";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminLoginButton from "./components/AdminLoginButton";
import { Routes, Route, Navigate } from "react-router-dom";

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

    const fetchUsers = async () => {
        try {
            setFetchError(null);
            const headers = isAdmin && adminToken
                ? { Authorization: `Bearer ${adminToken}` }
                : {};
            const res = await fetch(`http://localhost:8000/${isAdmin ? "users" : "public-users"}`, { headers });
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

    const handleDeleteUser = async (id) => {
        if (!adminToken) return;
        const res = await fetch(`http://localhost:8000/users?id=${id}`, {
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

    useEffect(() => {
        fetchUsers();
    }, [isAdmin, adminToken]);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
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