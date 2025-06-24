export default function AdminLoginButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#6a4c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
            }}
        >
            Connexion Admin
        </button>
    );
}