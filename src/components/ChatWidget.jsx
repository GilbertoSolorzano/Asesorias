'use client';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function ChatWidget({ room, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('join', room);
    socketRef.current.on('message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    // Cargar historial
    fetch(`http://localhost:3001/api/alumno/mensajes/${room}`)
      .then(r => r.json())
      .then(setMessages)
      .catch(console.error);

    return () => socketRef.current.disconnect();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { room, remitente: user, texto: input };
    socketRef.current.emit('message', msg);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-lg rounded flex flex-col">
      <div className="bg-blue-500 text-white p-2 rounded-t">
        Chat Asesoría #{room}
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.remitente === user ? 'text-right' : 'text-left'}>
            <span className="inline-block bg-gray-200 p-1 my-1 rounded">
              <strong>{m.remitente}:</strong> {m.texto}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t flex">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button 
          className="ml-2 bg-blue-500 text-white px-3 rounded"
          onClick={send}
        >Enviar</button>
      </div>
    </div>
  );
}
