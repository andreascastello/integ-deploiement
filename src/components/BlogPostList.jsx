import React from "react";

export default function BlogPostList({ posts, error }) {
    return (
        <div className="blog-posts-container" style={{ maxWidth: 600, margin: '40px auto', background: '#f5f5f5', borderRadius: 16, padding: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#4e220e', fontSize: '2.2rem', marginBottom: 20, textAlign: 'center' }}>Blog</h2>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            {posts && posts.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {posts.map((post) => (
                        <li key={post._id} style={{ padding: '12px 20px', borderBottom: '1px solid #d2b48c', color: '#4a2511', fontSize: '1.1rem' }}>
                            <strong>{post.title}</strong>
                            <div style={{ margin: '8px 0' }}>{post.content}</div>
                            {post.author && post.author.email && (
                                <div style={{ fontSize: '0.95em', color: '#7b5e3b' }}>Auteur : {post.author.email}</div>
                            )}
                            <div style={{ fontSize: '0.85em', color: '#a1887f' }}>{new Date(post.createdAt).toLocaleString('fr-FR')}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div style={{ color: '#7b5e3b', textAlign: 'center' }}>Aucun post pour le moment.</div>
            )}
        </div>
    );
} 