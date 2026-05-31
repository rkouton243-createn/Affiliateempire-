import React, { useState, useEffect } from 'react';

const getPseudo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pseudo = '';
  for (let i = 0; i < 8; i++) {
    pseudo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pseudo;
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('arakforum_data')) || { accueil: [], chat: [] };
    setPosts(savedData.accueil);
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;

    const pseudo = getPseudo();
    const newItem = { pseudo, text: newPost, timestamp: Date.now() };

    const savedData = JSON.parse(localStorage.getItem('arakforum_data')) || { accueil: [], chat: [] };
    const updatedAccueil = [newItem, ...savedData.accueil];

    const newData = { ...savedData, accueil: updatedAccueil };
    localStorage.setItem('arakforum_data', JSON.stringify(newData));

    setPosts(updatedAccueil);
    setNewPost('');
  };

  return (
    <div className="section">
      <h2>Fil d'actualité</h2>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Écris un post..."
      ></textarea>
      <button onClick={handlePost} className="btn-glow">Poster</button>

      <div id="postsAccueil">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <span className="pseudo">{post.pseudo}</span>: {post.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
