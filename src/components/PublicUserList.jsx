// PublicUserList.jsx
import React  from 'react';

function PublicUserList({ users = [], isAdmin, onDeleteUser, adminEmail }) {
    return (
        <div className="public-users-container">
            <h2>Liste des utilisateurs</h2>
            <ul>
                {(Array.isArray(users) ? users : []).map((user, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div>{user.nom} {user.prenom}</div>
                            {isAdmin && user.email && (
                                <>
                                    <div>Email: {user.email}</div>
                                    <div>Naissance: {user.date_naissance}</div>
                                    <div>Ville: {user.ville}</div>
                                    <div>Code Postal: {user.code_postal}</div>
                                </>
                            )}
                        </div>
                        {isAdmin && user.id && user.email !== adminEmail && (
                            <button style={{ marginLeft: '1rem', background: '#c53030', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.7rem', cursor: 'pointer' }} onClick={() => onDeleteUser(user.id)}>
                                Supprimer
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PublicUserList;