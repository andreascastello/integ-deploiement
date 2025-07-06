// PublicUserList.jsx
import React  from 'react';

function PublicUserList({ users = [], isAdmin, onDeleteUser, adminEmail }) {
    return (
        <div className="public-users-container">
            <h2>Liste des utilisateurs</h2>
            <ul>
                {(Array.isArray(users) ? users : []).map((user, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>
                            {user.nom} {user.prenom}
                            {isAdmin && user.email && (
                                <>
                                    <br />Email: {user.email}
                                    <br />Naissance: {user.date_naissance}
                                    <br />Ville: {user.ville}
                                    <br />Code Postal: {user.code_postal}
                                </>
                            )}
                        </span>
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