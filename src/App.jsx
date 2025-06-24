import { useEffect, useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import PublicUserList from "./components/PublicUserList";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminLoginButton from "./components/AdminLoginButton";

export default function App() {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [adminToken, setAdminToken] = useState(null);
    const [adminEmail, setAdminEmail] = useState("");
    const [fetchError, setFetchError] = useState(null);

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
        } else {
            alert("Erreur lors de la suppression de l'utilisateur");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isAdmin, adminToken]);

    return (
        <>
            {fetchError && <div style={{color: 'red'}}>{fetchError}</div>}
            <RegistrationForm onUserCreated={fetchUsers} />
            <AdminLoginButton onClick={() => setShowModal(true)} />
            <PublicUserList users={users} isAdmin={isAdmin} onDeleteUser={handleDeleteUser} adminEmail={adminEmail} />
            {showModal && (
                <AdminLoginModal
                    onClose={() => setShowModal(false)}
                    onLoginSuccess={(token) => {
                        setIsAdmin(true);
                        setAdminToken(token);
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
    );
}