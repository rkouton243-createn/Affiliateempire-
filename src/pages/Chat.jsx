import React, { useState, useEffect } from 'react';

const getPseudo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pseudo = '';
  for (let i = 0; i < 8; i++) {
    pseudo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pseudo;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('arakforum_data')) || { accueil: [], chat: [] };
    setMessages(savedData.chat);
  }, []);

  const handleSend = () => {
    if (!newMsg.trim()) return;

    const pseudo = getPseudo();
    const newItem = { pseudo, text: newMsg, timestamp: Date.now() };

    const savedData = JSON.parse(localStorage.getItem('arakforum_data')) || { accueil: [], chat: [] };
    const updatedChat = [newItem, ...savedData.chat];

    const newData = { ...savedData, chat: updatedChat };
    localStorage.setItem('arakforum_data', JSON.stringify(newData));

    setMessages(updatedChat);
    setNewMsg('');
  };

  return (
    <div className="section">
      <h2>Chat 🐱</h2>
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Écris un message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} className="btn-glow">Envoyer</button>

      <div id="postsChat">
        {messages.map((msg, index) => (
          <div key={index} className="post">
            <span className="pseudo">{msg.pseudo}</span>: {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
