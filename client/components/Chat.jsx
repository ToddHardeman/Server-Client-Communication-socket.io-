import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/chat.css';

// Connect to the backend server
const socket = io('http://localhost:3000');

export default function Chat() {

  const [messages, setMessages] = useState([]);
  
  const [inputValue, setInputValue] = useState('');

  // Listen for new chat messages from the server
  useEffect(() => {
    // When a 'chat message' event is received, add it to the messages array
    socket.on('chat message', (newMessage) => {
      setMessages((oldMessagesArray) => [...oldMessagesArray, newMessage]);
    });

    // Remove the event listener when the component unmounts (socket.off)
    return () => {
      socket.off('chat message');
    };
  }, []);

  // Handle sending a new message
  function handleFormSubmit(formEvent) {
    formEvent.preventDefault(); // Prevent the page from reloading
    if (inputValue) {
      socket.emit('chat message', inputValue); // Send the message to the server
      setInputValue(''); // Clear the input box
    }
  }

  return (
    <div className="chat-container">
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleFormSubmit}>
        <input
          id="input"
          autoComplete="off"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
