import { useState } from "react";

export default function AdminLoginModal({ onClose, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            // Essayer d'abord l'API Python (pour les utilisateurs)
            let res = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                const token = data.access_token;
                onLoginSuccess(token);
                onClose();
                return;
            }

            // // Si l'API Python échoue, essayer l'API Node.js (pour les posts)
            // res = await fetch(`${import.meta.env.VITE_REACT_APP_EXPRESS_API_URL}/api/auth/admin-login`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ email, password })
            // });

            // if (res.ok) {
            //     const data = await res.json();
            //     const token = data.access_token;
            //     onLoginSuccess(token);
            //     onClose();
            // } else {
            //     throw new Error("Connexion échouée");
            // }
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
            console.error(err);
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                minWidth: "300px"
            }}>
                <h2>Connexion Admin</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={onClose} style={{ padding: "0.5rem" }}>Annuler</button>
                    <button onClick={handleLogin} style={{ padding: "0.5rem" }}>Se connecter</button>
                </div>
            </div>
        </div>
    );
}