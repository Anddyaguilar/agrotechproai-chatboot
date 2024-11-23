import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = async () => {
        if (!message) return;

        setChatHistory((prevChatHistory) => [...prevChatHistory, { sender: 'user', text: message }]);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/chat', { message });
            setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                { sender: 'ai', text: response.data.reply }
            ]);
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>informatec<samp>proAI</samp></h1>
            <div className="chatbox">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`message ${chat.sender}`}>
                        {chat.sender === 'user' ? (
                            <p> {chat.text}</p>
                        ) : (
                            <div>
                                
                                <div
                                    className="ai-response"
                                    dangerouslySetInnerHTML={{ __html: formatAIResponse(chat.text) }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        
          <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
            />
         <button onClick={handleSendMessage}>Enviar</button>
         
        </div>
    );
}

function formatAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursiva
        .replace(/\n/g, '<br />'); // Saltos de línea
}

export default App;
