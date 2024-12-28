// components/Chat.js
import { useEffect, useState, useRef } from 'react';
import './Chat.css'; // Import the CSS file for custom styles
import { useSelector } from 'react-redux';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const username = useSelector((state) => state.user.userName);
    const pollingInterval = 5000;

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, pollingInterval);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        const response = await fetch('/api/messages',{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setMessages(data);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, message: inputMessage }),
        });
        setInputMessage('');
        fetchMessages(); // Fetch messages immediately after sending
    };

    return (
        <div className="chat-container">
            <h2>Chat Room</h2>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div className="message" key={index}>
                        <div className="message-username">{msg.username}</div>
                        <div className="message-text">{msg.message}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default Chat;
